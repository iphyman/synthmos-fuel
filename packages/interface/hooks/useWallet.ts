import { useQuery } from '@tanstack/react-query';
import { useFuel } from './useFuel';

export function useWallet() {
  const { fuel } = useFuel();

  const {
    data: isConnected,
    isLoading: isConnectedLoading,
    isError: isConnectedError,
  } = useQuery(['connected'], async () => await fuel!.isConnected(), {
    enabled: !!fuel,
    initialData: false,
  });

  const { data, isError, isLoading } = useQuery(
    ['wallet'],
    async () => {
      const currentAccount = await fuel!.currentAccount();
      const wallet = await fuel!.getWallet(currentAccount);

      return { wallet, account: currentAccount };
    },
    {
      enabled:
        !!fuel && !!isConnected && !isConnectedLoading && !isConnectedError,
    }
  );

  return { isError, isLoading, ...data };
}
