import { Price } from '@pythnetwork/pyth-evm-js';
import {
  BN,
  CallResult,
  FunctionInvocationScope,
  MultiCallInvocationScope,
  ReceiptType,
  bn,
} from 'fuels';

export function shortenAddress(address: string, chars = 4) {
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, '0');

  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${
    fraction ? `.${fraction}` : ''
  }`;
}

export function formatPriceAsLineData(price: Price) {
  const formatted = formatUnits(BigInt(price.price), price.expo);

  return {
    time: price.publishTime as any,
    value: parseFloat((+formatted).toFixed(4)),
  };
}

export function formatPrice(price: string, decimals = 8) {
  let dollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const formatted = formatUnits(BigInt(price), decimals);
  const amount = parseFloat((+formatted).toFixed(4));

  return dollar.format(amount);
}

export function getTimestamp(minutes: number) {
  const now = new Date().getTime();
  const toMilli = minutes * 60 * 1000;

  return now + toMilli;
}

export const ZERO = bn(0);

export type TransactionCost = {
  total: BN;
  fee: BN;
  error?: string;
};

export function getGasUsed(simulateResult: CallResult) {
  const scriptResult = simulateResult.receipts.find(
    (receipt) => receipt.type === ReceiptType.ScriptResult
  );

  if (scriptResult?.type === ReceiptType.ScriptResult) {
    return scriptResult.gasUsed;
  }

  return ZERO;
}

export async function getTransactionCost(
  functionInvocation: FunctionInvocationScope | MultiCallInvocationScope
): Promise<TransactionCost> {
  try {
    const txCost = await functionInvocation
      .txParams({
        gasPrice: ZERO,
      })
      .getTransactionCost({
        fundTransaction: true,
      });
    return {
      total: txCost.gasUsed.mul(1.3),
      fee: txCost.fee,
    };
  } catch (err: any) {
    return { fee: ZERO, total: ZERO, error: err?.message };
  }
}
