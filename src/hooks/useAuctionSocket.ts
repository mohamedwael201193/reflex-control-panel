import { useEffect } from 'react';
import { useAuctionStore } from '@/stores/auctionStore';

// The live server URL from Render
const LIVE_SERVER_URL = 'wss://reflex-hackathon-server.onrender.com';

export function useAuctionSocket() {
  const setAuctions = useAuctionStore((state) => state.setAuctions);

  useEffect(() => {
    // This line connects to your live server
    const ws = new WebSocket(LIVE_SERVER_URL);

    ws.onopen = () => {
      console.log('Connected to LIVE auction socket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'AUCTION_UPDATE') {
          setAuctions(data.payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from auction socket');
    };

    ws.onerror = (error) => {
      console.error('Auction socket error:', error);
    };

    // Cleanup function to close the connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [setAuctions]); // Dependency array ensures this effect runs only once
}