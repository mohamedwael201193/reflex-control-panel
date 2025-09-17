// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AuctionHouse is Ownable, ReentrancyGuard {
    struct Bundle {
        address payable searcher;
        uint256 bid;
        bytes32 bundleId;
        bytes transactions; // Changed to single bytes payload
    }

    address public jitVaultAddress;
    Bundle public currentWinningBundle;
    uint256 public auctionEndTime;
    uint256 public constant AUCTION_DURATION = 1 seconds;

    event BundleSubmitted(address indexed searcher, uint256 bid, bytes32 indexed bundleId);
    event BundleExecuted(bytes32 indexed bundleId, bool success);

    constructor(address _jitVaultAddress) {
        require(_jitVaultAddress != address(0), "Vault address cannot be zero");
        jitVaultAddress = _jitVaultAddress;
    }

    function submitBundle(bytes calldata _transactions) external payable nonReentrant {
        // Allow a new bid if the auction is over OR if the new bid is higher
        require(block.timestamp >= auctionEndTime || msg.value > currentWinningBundle.bid, "Bid must be higher or auction ended");

        if (currentWinningBundle.searcher != address(0)) {
            (bool sent, ) = currentWinningBundle.searcher.call{value: currentWinningBundle.bid}("");
            require(sent, "Failed to refund previous bidder");
        }

        currentWinningBundle = Bundle({
            searcher: payable(msg.sender),
            bid: msg.value,
            bundleId: keccak256(abi.encodePacked(msg.sender, _transactions, block.timestamp)),
            transactions: _transactions
        });

        // If it's a new auction, set the end time
        if (block.timestamp >= auctionEndTime) {
            auctionEndTime = block.timestamp + AUCTION_DURATION;
        }

        emit BundleSubmitted(msg.sender, msg.value, currentWinningBundle.bundleId);
    }

    function executeWinningBundle() external nonReentrant {
        require(block.timestamp >= auctionEndTime, "Auction has not ended");
        require(currentWinningBundle.searcher != address(0), "No winning bundle to execute");

        Bundle memory winningBundle = currentWinningBundle;

        // Reset state before external call
        delete currentWinningBundle;
        auctionEndTime = 0;

        // Send bid to the vault as profit
        (bool sent, ) = jitVaultAddress.call{value: winningBundle.bid}("");
        require(sent, "Failed to send bid to JIT vault");
        
        // **CRITICAL CHANGE**: The AuctionHouse *calls* the router with the bundle's transaction data.
        // The `transactions` payload should be the encoded function call for the OpportunityRouter.
        (bool success, ) = winningBundle.transactions.length > 0 ? jitVaultAddress.call(winningBundle.transactions) : (true, "");

        emit BundleExecuted(winningBundle.bundleId, success);
    }
}