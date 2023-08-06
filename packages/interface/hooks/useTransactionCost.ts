import type { FunctionInvocationScope, MultiCallInvocationScope } from 'fuels';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useNativeBalance } from './useNativeBalance';
import { ZERO, type TransactionCost } from '@app/utils';

type UseTransactionCost = TransactionCost & {
  isLoading: boolean;
};

export function useTransactionCost(
  queryKey: unknown[],
  request?: FunctionInvocationScope | MultiCallInvocationScope,
  options?: Omit<UseQueryOptions<TransactionCost>, 'queryKey' | 'queryFn'>
): UseTransactionCost {
  const { formatted } = useNativeBalance();

  if (Array.isArray(queryKey)) {
    queryKey.push(formatted);
  }

  const { data, isLoading } = useQuery<TransactionCost>(
    queryKey,
    async () => {
      try {
        const txCost = await request!
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
    },
    options
  );

  return {
    ...(data || { fee: ZERO, total: ZERO }),
    isLoading,
  };
}
