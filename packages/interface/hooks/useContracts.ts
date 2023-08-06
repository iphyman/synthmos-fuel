import {
  MARKET,
  MARKET_CONTROLLER,
  MarketIds,
  SYNTH_TOKEN,
} from '@app/configs';
import { useWallet } from './useWallet';
import {
  MarketAbi__factory,
  MarketControllerAbi__factory,
  SynthTokenAbi__factory,
} from '@app/types';

export function useContract() {
  const { wallet } = useWallet();

  const market = (marketId: MarketIds) => {
    const id = MARKET[marketId].address;

    return wallet && MarketAbi__factory.connect(id, wallet);
  };

  const marketController = () => {
    return (
      wallet && MarketControllerAbi__factory.connect(MARKET_CONTROLLER, wallet)
    );
  };

  const synth = () => {
    return wallet && SynthTokenAbi__factory.connect(SYNTH_TOKEN, wallet);
  };

  return { market, marketController, synth };
}
