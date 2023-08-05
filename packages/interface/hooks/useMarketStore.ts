import { formatPriceAsLineData } from '@app/utils';
import { Price } from '@pythnetwork/pyth-evm-js';
import { UTCTimestamp } from 'lightweight-charts';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools, persist } from 'zustand/middleware';
import { sortedUniqBy } from 'lodash';

export type Round = {
  closingTime: string;
  entryDeadline: string;
  openingTime: string;
  closingPrice: string;
  totalWager: string;
  percentageReward: string;
  isFinalized: boolean;
};

export type MarketGesture = {
  isHigh: boolean;
  isLow: boolean;
};

type PriceFeed = {
  time: UTCTimestamp;
  value?: number;
};

interface State {
  price: Price | null;
  priceFeed: PriceFeed[];
  marketGesture: MarketGesture;
  expiryTime: number;
  roundId: number;
  round: Round | null;
}

interface Actions {
  setExpiryTime: (expiryTime: number) => void;
  setPrice: (price: Price) => void;
  setMarketGesture: (marketGesture: MarketGesture) => void;
  setRoundId: (roundId: number) => void;
  setRound: (round: Round) => void;
}

type Store = State & Actions;

const DEFAULT_EXPIRY = Math.floor(Date.now() / 1000) + 60; //1 minute

const INITIAL_STATE: State = {
  price: null,
  priceFeed: [],
  marketGesture: { isHigh: false, isLow: false },
  expiryTime: DEFAULT_EXPIRY,
  roundId: 0,
  round: null,
};

export const useMarketStore = createWithEqualityFn<Store>()(
  devtools(
    persist(
      (set, get) => ({
        ...INITIAL_STATE,
        setPrice: (price) =>
          set(() => {
            const feed = get().priceFeed;
            feed.push(formatPriceAsLineData(price));

            return {
              price,
              priceFeed: sortedUniqBy(feed, (d) => d.time),
            };
          }),
        setMarketGesture: (marketGesture) => set({ marketGesture }),
        setExpiryTime: (expiryTime) => set({ expiryTime }),
        setRoundId: (roundId) => set({ roundId }),
        setRound: (round) => set({ round }),
      }),
      { name: 'synthmos-market-data' }
    )
  ),
  Object.is
);
