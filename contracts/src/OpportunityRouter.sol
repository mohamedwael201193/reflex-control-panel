// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IUniswapV2Router
 * @notice Interface for a Uniswap V2-style DEX router.
 */
interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

/**
 * @title OpportunityRouter
 * @author Reflex Protocol
 * @notice A generic, stateless contract for executing a simple two-step arbitrage trade.
 * This contract is designed to be called by an AuctionHouse to capitalize on arbitrage
 * opportunities identified by searchers.
 */
contract OpportunityRouter {

    /**
     * @notice Executes a simple two-step arbitrage trade.
     * @dev This function is expected to be called by an AuctionHouse.
     * It pulls tokens from a vault, performs two swaps, and sends the profit back to the vault.
     * The caller (AuctionHouse) must ensure that the vault has approved this contract
     * to spend the necessary tokens.
     * @param _tokenIn The input token for the arbitrage.
     * @param _tokenOut The intermediate token for the arbitrage.
     * @param _amountIn The amount of the input token to use.
     * @param _dexA The address of the first DEX router.
     * @param _dexB The address of the second DEX router.
     * @param _vault The address of the JITLiquidityVault.
     */
    function executeSimpleArbitrage(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        address _dexA,
        address _dexB,
        address _vault
    ) external {
        // 1. Pull tokens from the vault
        IERC20 tokenIn = IERC20(_tokenIn);
        require(tokenIn.transferFrom(_vault, address(this), _amountIn), "Failed to pull funds from vault");

        // 2. Execute swap on DEX A
        tokenIn.approve(_dexA, _amountIn);
        address[] memory pathA = new address[](2);
        pathA[0] = _tokenIn;
        pathA[1] = _tokenOut;

        uint[] memory amountsA = IUniswapV2Router(_dexA).swapExactTokensForTokens(
            _amountIn,
            0, // We accept any amount out for the first swap
            pathA,
            address(this),
            block.timestamp
        );
        uint amountOutA = amountsA[1];

        // 3. Execute swap on DEX B
        IERC20 tokenOut = IERC20(_tokenOut);
        tokenOut.approve(_dexB, amountOutA);
        address[] memory pathB = new address[](2);
        pathB[0] = _tokenOut;
        pathB[1] = _tokenIn;

        uint[] memory amountsB = IUniswapV2Router(_dexB).swapExactTokensForTokens(
            amountOutA,
            0, // We accept any amount out for the second swap
            pathB,
            address(this),
            block.timestamp
        );
        uint finalAmountIn = amountsB[1];

        // 4. Ensure profit and send all funds back to the vault in one transfer
        require(finalAmountIn > _amountIn, "Arbitrage did not result in a profit");
        require(tokenIn.transfer(_vault, finalAmountIn), "Failed to return funds to vault");
    }
}