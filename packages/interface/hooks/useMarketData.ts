// import { MARKET, MarketIds } from '@app/configs';
import { useEffect } from 'react';
import { useMarketStore } from './useMarketStore';
import { useBoolean } from '@chakra-ui/react';

export function useMarketData() {
  const [fetched, setFetched] = useBoolean();

  const [setRound, setRoundId] = useMarketStore((state) => [
    state.setRound,
    state.setRoundId,
  ]);

  useEffect(() => {
    const fetchData = async () => {};

    if (!fetched) {
      fetchData();
    }
  }, []);
}
