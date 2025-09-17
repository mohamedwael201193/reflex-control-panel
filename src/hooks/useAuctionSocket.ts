import { useEffect } from 'react';
import { useAuctionStore } from '../stores/auctionStore';

const WS_URL = 'ws://localhost:8080';

export const useAuctionSocket = () => {
  const setAuctions = useAuctionStore((state) => state.setAuctions);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to auction socket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'AUCTION_UPDATE') {
          setAuctions(data.payload);
        }
      } catch (error) {
        console.error('Error parsing auction data:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from auction socket');
    };

    ws.onerror = (error) => {
      console.error('Auction socket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [setAuctions]);
};
