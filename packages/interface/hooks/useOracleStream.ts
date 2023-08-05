import { useMarketStore } from "@app/hooks";
import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { useEffect } from "react";

// const ENDPOINT = String(process.env.NEXT_PUBLIC_PRICE_SERVICE_ENDPOINT);
const ENDPOINT = "https://xc-mainnet.pyth.network";

export function useOracleStream(priceId: string) {
  const setPrice = useMarketStore((state) => state.setPrice);

  useEffect(() => {
    const connection = new EvmPriceServiceConnection(ENDPOINT, {
      priceFeedRequestConfig: { binary: true },
    });

    const connect = async () => {
      const priceIds = [priceId];
      await connection.subscribePriceFeedUpdates(priceIds, (priceFeed) => {
        const price = priceFeed.getPriceNoOlderThan(1);

        if (price) {
          setPrice(price);
        }
      });
    };

    connect();

    return () => {
      connection.closeWebSocket();
    };
  }, [priceId, setPrice]);
}
