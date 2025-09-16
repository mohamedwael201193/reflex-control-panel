import { create } from "zustand";

export type Auction = {
  bundleId: string;
  opportunity: string;
  topBid: number;
  leadingSearcher: string;
  endTime: number; // ms epoch
  status: "active" | "completed" | "expired";
  volume?: number;
  gasPrice?: number;
};

export type KPIData = {
  totalVolume: number;
  activeAuctions: number;
  avgGasPrice: number;
  successRate: number;
  myLiquidity: number;
  rewards24h: number;
};

type AuctionState = {
  auctions: Auction[];
  completed: Auction[];
  kpis: KPIData;
  updateAuctions: (incoming: Auction[]) => void;
  markCompleted: (id: string) => void;
  updateKPIs: (kpis: Partial<KPIData>) => void;
};

export const useAuctionStore = create<AuctionState>((set) => ({
  auctions: [
    {
      bundleId: "0x1a2b3c",
      opportunity: "Arbitrage USDC/ETH",
      topBid: 0.245,
      leadingSearcher: "0x742d35cc7cfb4f16ccf0b5bf7bdfe0b4b2a9c94f",
      endTime: Date.now() + 45000,
      status: "active",
      volume: 125000,
      gasPrice: 25
    },
    {
      bundleId: "0x4d5e6f",
      opportunity: "MEV Bundle #2847",
      topBid: 0.892,
      leadingSearcher: "0x9f6e5d4c3b2a1908f7e6d5c4b3a2918e7f6d5c4b",
      endTime: Date.now() + 72000,
      status: "active",
      volume: 340000,
      gasPrice: 30
    }
  ],
  completed: [
    {
      bundleId: "0x7g8h9i",
      opportunity: "Flash Loan Liquidation",
      topBid: 1.245,
      leadingSearcher: "0x742d35cc7cfb4f16ccf0b5bf7bdfe0b4b2a9c94f",
      endTime: Date.now() - 3600000,
      status: "completed",
      volume: 89000,
      gasPrice: 28
    }
  ],
  kpis: {
    totalVolume: 12450000,
    activeAuctions: 2,
    avgGasPrice: 27.5,
    successRate: 94.2,
    myLiquidity: 50000,
    rewards24h: 1247.89
  },
  updateAuctions: (incoming) => set({ auctions: incoming }),
  markCompleted: (id) =>
    set((state) => {
      const auction = state.auctions.find(a => a.bundleId === id);
      if (!auction) return state;
      
      return {
        auctions: state.auctions.filter(a => a.bundleId !== id),
        completed: [{ ...auction, status: "completed" as const }, ...state.completed]
      };
    }),
  updateKPIs: (newKpis) =>
    set((state) => ({
      kpis: { ...state.kpis, ...newKpis }
    }))
}));