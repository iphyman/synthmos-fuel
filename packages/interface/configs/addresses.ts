interface Market {
  symbols: {
    base: string;
    quote: string;
  };
  address: string;
  oracleFeedId: string;
}

export enum MarketIds {
  BTCUSD = 1,
  DOTUSD = 2,
  ETHUSD = 3,
}

export type MarketMap = { [marketId: number]: Market };

export const MARKET: MarketMap = {
  [MarketIds.BTCUSD]: {
    symbols: {
      base: 'BTC',
      quote: 'USD',
    },
    address: '',
    oracleFeedId:
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  [MarketIds.DOTUSD]: {
    symbols: {
      base: 'DOT',
      quote: 'USD',
    },
    address: '',
    oracleFeedId: '',
  },
};

export const MARKET_CONTROLLER: string = '';

export const SYNTH_TOKEN: string =
  '0x08d3c36ea8d4899da3d5c871240dab0cf95f90b1886ce94f625d64a655c86b3a';
