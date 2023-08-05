import { format, type CoinQuantity } from 'fuels';
import { useBalances } from './useBalances';
import { SYNTH_TOKEN } from '@app/configs';

export function useSynthBalance() {
  const { data: balances } = useBalances();

  const balance = balances?.find(
    (item: CoinQuantity) => item.assetId === SYNTH_TOKEN
  )?.amount;

  return {
    raw: balance,
    formatted: format(balance || 0),
  };
}
