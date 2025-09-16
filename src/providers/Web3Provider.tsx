"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

const somniaTestnet = defineChain({
  id: 50312,
  name: "Somnia Testnet (Shannon)",
  nativeCurrency: { name: "Somnia Test Token", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: { 
      http: ["https://dream-rpc.somnia.network/"] 
    },
    public: {
      http: [
        "https://dream-rpc.somnia.network/",
        "https://rpc.ankr.com/somnia_testnet"
      ]
    }
  },
  blockExplorers: {
    default: { 
      name: "Shannon Explorer", 
      url: "https://shannon-explorer.somnia.network" 
    }
  }
});

const config = createConfig({
  chains: [somniaTestnet],
  connectors: [injected()],
  transports: {
    [somniaTestnet.id]: http(somniaTestnet.rpcUrls.public.http[0])
  }
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}