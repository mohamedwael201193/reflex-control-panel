"use client";

import { useEffect, useRef } from "react";
import { useAuctionStore, Auction } from "@/stores/auctionStore";

export function useAuctionSocket(url = import.meta.env.VITE_WS_URL || "ws://localhost:8080") {
  const { updateAuctions } = useAuctionStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS connected");
    ws.onerror = (e) => console.error("WS error", e);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "NEW_BID") {
          updateAuctions(msg.payload as Auction[]);
        }
      } catch (e) {
        console.error("WS payload error", e);
      }
    };

    return () => ws.close();
  }, [url, updateAuctions]);

  return {
    auctions: useAuctionStore((s) => s.auctions),
    completed: useAuctionStore((s) => s.completed),
  };
}