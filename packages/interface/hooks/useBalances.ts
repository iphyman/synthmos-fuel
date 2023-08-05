import { useQuery } from '@tanstack/react-query';
import { useWallet } from './useWallet';

export function useBalances() {
  const { wallet } = useWallet();

  const balances = useQuery(
    ['balances'],
    async () => {
      if (!wallet) return [];

      return await wallet.getBalances();
    },
    {
      enabled: Boolean(wallet),
      initialData: [],
    }
  );

  return balances;
}
