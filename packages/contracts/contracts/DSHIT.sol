// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DSHIT
 * @dev ERC-20 token for the dshit.xyz platform
 * Features:
 * - Fixed supply of 1 billion tokens
 * - 5% transfer tax (configurable)
 * - Emergency pause (controlled by owner via flag)
 * - Burnable (deflationary)
 * - ReentrancyGuard for safety
 */
contract DSHIT is ERC20, Ownable, ReentrancyGuard {
    /// @dev Fixed supply: 1 billion tokens with 18 decimals
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    /// @dev Transfer tax rate (in basis points, 500 = 5%)
    uint256 public taxRate = 500; // 5%

    /// @dev Maximum tax rate (10%)
    uint256 public constant MAX_TAX_RATE = 1000;

    /// @dev Treasury address that receives taxes
    address public treasury;

    /// @dev Total tax collected
    uint256 public totalTaxCollected;

    /// @dev Emergency pause flag
    bool public paused;

    /// @dev Events
    event TaxRateUpdated(uint256 newRate);
    event TreasuryUpdated(address newTreasury);
    event Paused();
    event Unpaused();
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor mints initial supply and sets treasury
     * @param _treasury Address to receive transfer taxes
     */
    constructor(address _treasury) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_treasury != address(0), "Treasury cannot be zero address");

        // Mint all tokens to deployer
        _mint(msg.sender, MAX_SUPPLY);

        // Set treasury
        treasury = _treasury;
    }

    /**
     * @dev Override transfer to implement tax collection
     */
    function transfer(address to, uint256 value)
        public
        override(ERC20)
        nonReentrant
        returns (bool)
    {
        require(!paused, "DSHIT: transfers are paused");
        return _transferWithTax(msg.sender, to, value);
    }

    /**
     * @dev Override transferFrom to implement tax collection
     */
    function transferFrom(address from, address to, uint256 value)
        public
        override(ERC20)
        nonReentrant
        returns (bool)
    {
        require(!paused, "DSHIT: transfers are paused");
        address spender = msg.sender;
        _spendAllowance(from, spender, value);
        return _transferWithTax(from, to, value);
    }

    /**
     * @dev Internal transfer with tax calculation
     */
    function _transferWithTax(
        address from,
        address to,
        uint256 value
    ) internal returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(value > 0, "ERC20: transfer amount must be greater than zero");

        // Calculate tax
        uint256 tax = (value * taxRate) / 10000;
        uint256 amountAfterTax = value - tax;

        // Transfer tax to treasury
        if (tax > 0) {
            _transfer(from, treasury, tax);
            totalTaxCollected += tax;
        }

        // Transfer remaining amount to recipient
        _transfer(from, to, amountAfterTax);

        return true;
    }

    /**
     * @dev Pause the contract (emergency circuit breaker)
     */
    function pause() public onlyOwner {
        paused = true;
        emit Paused();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused();
    }

    /**
     * @dev Burn tokens (remove from circulation)
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from another account (requires approval)
     */
    function burnFrom(address account, uint256 amount) public {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "DSHIT: burn amount exceeds allowance");

        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @dev Set transfer tax rate (owner only)
     * @param newRate New tax rate in basis points (max 10%)
     */
    function setTaxRate(uint256 newRate) public onlyOwner {
        require(newRate <= MAX_TAX_RATE, "Tax rate exceeds maximum");
        taxRate = newRate;
        emit TaxRateUpdated(newRate);
    }

    /**
     * @dev Set treasury address (owner only)
     */
    function setTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Treasury cannot be zero address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

}
