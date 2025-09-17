import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 8080;

// Function to generate a random Ethereum address
const generateRandomAddress = () => {
  const characters = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += characters[Math.floor(Math.random() * characters.length)];
  }
  return address;
};

// Function to create a new auction object
const createAuction = () => ({
  bundleId: uuidv4(),
  topBid: (Math.random() * 10).toFixed(4),
  leadingSearcher: generateRandomAddress(),
  endTime: Date.now() + 1000, // Ends 1 second from now
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send new auction data every second
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const auctions = Array.from({ length: Math.floor(Math.random() * 2) + 2 }, createAuction);
      ws.send(JSON.stringify({ type: 'AUCTION_UPDATE', payload: auctions }));
    }
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
