// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title JITLiquidityVault
 * @author Gemini
 * @notice This contract securely holds user-deposited ERC20 tokens for Just-In-Time (JIT)
 * liquidity provision in MEV auctions and accrues yield from those auctions.
 */
contract JITLiquidityVault is Ownable, ReentrancyGuard {
    /**
     * @notice The address of the AuctionHouse contract.
     * @dev This is the only address allowed to call the `deployLiquidity` function.
     */
    address public auctionHouseAddress;

    /**
     * @notice The ERC-20 token being managed by this vault (e.g., W-SOMI).
     */
    IERC20 public immutable underlyingToken;

    /**
     * @notice A mapping from user addresses to their deposit balances.
     */
    mapping(address => uint256) public balances;

    /**
     * @notice The total amount of tokens held by the vault.
     */
    uint256 public totalDeposits;

    /**
     * @notice Emitted when a user deposits tokens into the vault.
     * @param user The address of the user who deposited.
     * @param amount The amount of tokens deposited.
     */
    event Deposited(address indexed user, uint256 amount);

    /**
     * @notice Emitted when a user withdraws tokens from the vault.
     * @param user The address of the user who withdrew.
     * @param amount The amount of tokens withdrawn.
     */
    event Withdrawn(address indexed user, uint256 amount);

    /**
     * @notice Emitted when the vault receives profit from an auction.
     * @param amount The amount of profit received in ETH.
     */
    event ProfitReceived(uint256 amount);

    /**
     * @notice The constructor initializes the vault with the underlying token address.
     * @param _tokenAddress The address of the ERC-20 token to be managed.
     */
    constructor(address _tokenAddress) {
        underlyingToken = IERC20(_tokenAddress);
    }

    /**
     * @notice Sets the address of the AuctionHouse contract.
     * @dev Can only be called by the owner.
     * @param _auctionHouseAddress The address of the AuctionHouse contract.
     */
    function setAuctionHouse(address _auctionHouseAddress) external onlyOwner {
        auctionHouseAddress = _auctionHouseAddress;
    }

    /**
     * @notice Allows a user to deposit tokens into the vault.
     * @param _amount The amount of tokens to deposit.
     */
    function deposit(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += _amount;
        totalDeposits += _amount;
        require(underlyingToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        emit Deposited(msg.sender, _amount);
    }

    /**
     * @notice Allows a user to withdraw their deposited tokens.
     * @param _amount The amount of tokens to withdraw.
     */
    function withdraw(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        totalDeposits -= _amount;
        require(underlyingToken.transfer(msg.sender, _amount), "Token transfer failed");
        emit Withdrawn(msg.sender, _amount);
    }

    /**
     * @notice Deploys liquidity to a specified router for an MEV opportunity.
     * @dev This function can only be called by the `auctionHouseAddress`.
     * It approves the router to spend the specified amount of the token.
     * @param _router The address of the router that will use the liquidity.
     * @param _token The address of the token to be deployed.
     * @param _amount The amount of the token to be deployed.
     */
    function deployLiquidity(address _router, address _token, uint256 _amount) external {
        require(msg.sender == auctionHouseAddress, "Only AuctionHouse can deploy liquidity");
        require(address(underlyingToken) == _token, "Token not supported");
        require(totalDeposits >= _amount, "Insufficient liquidity in vault");
        require(underlyingToken.approve(_router, _amount), "Approval failed");
    }

    /**
     * @notice A payable function to receive profits from MEV auctions.
     * @dev This function is expected to be called with ETH value.
     */
    function receiveProfit() public payable {
        require(msg.value > 0, "Profit must be greater than zero");
        emit ProfitReceived(msg.value);
    }
}
