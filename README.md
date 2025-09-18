# Reflex by Somnia

<p align="center">
  <img src="./public/logo-full.svg" alt="Reflex by Somnia Logo" width="400"/>
</p>

<p align="center">
  <em>Transforming MEV from an adversarial tax into a transparent, on-chain economic engine.</em>
</p>

<p align="center">
  <a href="https://reflex-control-panel.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://youtu.be/AYZBj0sKPYI" target="_blank">
    <img src="https://img.shields.io/badge/Demo_Video-YouTube-red?style=for-the-badge&logo=youtube" alt="Demo Video" />
  </a>
  <a href="https://github.com/mohamedwael201193/reflex-control-panel" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Somnia-DeFi_Hackathon-purple?style=for-the-badge" alt="Somnia Hackathon"/>
</p>

## Core Concept

Reflex is a **Just-in-Time (JIT) Liquidity Protocol** that runs a real-time, on-chain auction for Maximal Extractable Value (MEV) opportunities. Built to leverage Somnia's high-speed infrastructure, Reflex captures value that would otherwise be lost to inefficient markets and returns it to the ecosystem as yield for liquidity providers.

## 🚀 Why This Is Only Possible on Somnia

Reflex's core feature—atomic, sub-second auction and settlement of MEV bundles—is fundamentally impossible on slower, less scalable chains. The protocol's design is a direct bet on the architectural pillars of Somnia:

*   **Sub-second Finality:** Guarantees that auction results are irreversible the moment they are confirmed. This is critical for the high-stakes, time-sensitive nature of MEV, eliminating the risk of costly chain reorganizations.
*   **High Throughput (1M+ TPS):** Somnia's ability to handle over a million transactions per second is the bedrock of Reflex. It allows for a high-frequency bidding environment where searcher bots can submit and update bids in real-time without causing network congestion or prohibitive gas wars.

##  लाइव डेमो और अनुबंध (Live Demo & Contracts)

The protocol is live and fully interactive on the Somnia (Shannon) Testnet.

| Contract            | Role                               | Address (Shannon Testnet)                                                                                                   |
| ------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `MockERC20`         | Faucet Token (STT)                 | [`0x8772...242F3`](https://shannon.somniascan.io/address/0x87729f38481BfB62CfFB3148dEd644c3B13242F3) |
| `JITLiquidityVault` | Holds user-provided liquidity      | [`0xBf9D...4313`](https://shannon.somniascan.io/address/0xBf9D07E824953d3CA531063d82dd5f109a124313) |
| `AuctionHouse`      | Runs the real-time MEV auctions    | [`0xEfE4...F272`](https://shannon.somniascan.io/address/0xEfE4A6a857a6fb8c4387B20FcD10f2471D8eF272) |
| `OpportunityRouter` | Executes the final arbitrage trade | [`0x94db...1645`](https://shannon.somniascan.io/address/0x94db6E5612a012f057dEc4caB580d210768a1645) |

## 🏛️ Technical Architecture

Reflex consists of on-chain smart contracts for logic and settlement, and off-chain components for real-time data streaming.

```
+----------------+      +-----------------------+      +---------------------+
|      User      |----->|   Frontend (React)    |<---->| JITLiquidityVault   |
+----------------+      +-----------------------+      +---------------------+
                          ^                      
                          | (Live Auction Feed)      
                          |                      
+----------------+      +-----------------------+      +---------------------+
|  Searcher Bot  |----->|    AuctionHouse       |----->|  OpportunityRouter  |
+----------------+      +-----------------------+      +---------------------+
                          |                      
                          | (WebSocket Server)       
                          v                      
                     (Node.js)                     
```

*   **On-Chain (Solidity):** The core logic resides in the four smart contracts deployed on the Somnia network, handling everything from liquidity provision to auction settlement.
*   **Off-Chain (Node.js):** A simple WebSocket server provides the frontend with a live, real-time feed of auction data, enabling the dynamic and responsive UI.

## 🛠️ How to Test

Follow these simple steps to test the full protocol:

1.  **Connect to Somnia:** Ensure your MetaMask wallet is connected to the **Somnia Testnet (Shannon)**.
    *   **Network Name:** `Somnia Shannon Testnet`
    *   **RPC URL:** `https://testnet-rpc.somnia.network`
    *   **Chain ID:** `50312`
    *   **Currency Symbol:** `tCORE`
2.  **Get Tokens:** Visit the [**Live Demo**](https://reflex-control-panel.vercel.app/) and click the **"Get Testnet Tokens"** button. This will grant you 100 STT tokens to use in the protocol.
3.  **Provide Liquidity:** Use the "Approve" and "Deposit" functions in the JIT Liquidity Vault card to provide liquidity and start earning yield.
4.  **Observe:** Watch the "Live Auctions" feed to see MEV opportunities being auctioned and settled in real time.

## 🗺️ Future Roadmap

Reflex is just getting started. Here are some of the features on our immediate roadmap:

*   **Spectator Mode:** A dedicated UI for viewing market-wide MEV activity, providing a god-mode view of the Somnia mempool.
*   **Advanced Analytics:** A historical data dashboard for LPs and searchers to analyze profitability, auction win rates, and more.
*   **Native Mode Integration:** Upgrading the backend searcher bots to use Somnia's hyper-optimized **Native Transaction Mode** for maximum efficiency and bidding speed.