import { format, type CoinQuantity } from 'fuels';
import { useBalances } from './useBalances';
import { ETH_ID } from '@app/configs';

export function useNativeBalance() {
  const { data: balances } = useBalances();

  const balance = balances?.find(
    (item: CoinQuantity) => item.assetId === ETH_ID
  )?.amount;

  return {
    raw: balance,
    formatted: balance && format(balance),
  };
}
