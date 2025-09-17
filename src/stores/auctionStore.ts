import {create} from 'zustand';

interface Auction {
  bundleId: string;
  topBid: string;
  leadingSearcher: string;
  endTime: number;
}

interface KPI {
    totalVolume: number;
    activeAuctions: number;
    avgGasPrice: number;
    successRate: number;
    myLiquidity: number;
    rewards24h: number;
}

interface AuctionState {
  auctions: Auction[];
  kpis: KPI;
  completed: Auction[];
  setAuctions: (auctions: Auction[]) => void;
}

const defaultKpis: KPI = {
    totalVolume: 0,
    activeAuctions: 0,
    avgGasPrice: 0,
    successRate: 0,
    myLiquidity: 0,
    rewards24h: 0,
};

export const useAuctionStore = create<AuctionState>((set) => ({
  auctions: [],
  kpis: defaultKpis,
  completed: [],
  setAuctions: (auctions) => set((state) => ({
    auctions,
    kpis: {
        ...state.kpis,
        activeAuctions: auctions.length,
    }
  })),
}));