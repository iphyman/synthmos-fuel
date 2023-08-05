import { useQuery } from '@tanstack/react-query';
import { useFuel } from './useFuel';

export function useEagerlyConnect() {
  const { fuel } = useFuel();

  const {
    data: isConnected,
    isLoading: isConnectedLoading,
    isError: isConnectedError,
  } = useQuery(['connected'], async () => await fuel!.isConnected(), {
    enabled: !!fuel,
    initialData: false,
    refetchInterval: 1000,
  });

  return {
    isConnected,
    isConnectedLoading,
    isConnectedError,
  };
}
