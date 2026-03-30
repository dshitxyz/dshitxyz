// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DSHIT Token
/// @notice Brutalist meme commerce token on Base L2
/// @dev ERC20 with tax capabilities
contract DSHIT is ERC20, ERC20Burnable, Ownable {
    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    uint256 public constant INITIAL_TAX = 500; // 5% = 500 basis points

    // State variables
    uint256 public transferTaxBasisPoints = INITIAL_TAX;
    address public treasuryAddress;
    bool public paused = false;

    // Events
    event TaxRateUpdated(uint256 newRate);
    event TreasuryAddressUpdated(address newTreasury);
    event TaxCollected(address indexed from, address indexed to, uint256 amount);
    event Paused();
    event Unpaused();

    /// @notice Initialize DSHIT token
    /// @param _treasuryAddress Initial treasury address for tax collection
    constructor(address _treasuryAddress) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_treasuryAddress != address(0), "Treasury address cannot be zero");
        treasuryAddress = _treasuryAddress;
        _mint(msg.sender, MAX_SUPPLY);
    }

    // ============ Token Transfers ============

    /// @notice Override transfer with tax calculation
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!paused, "Token transfers are paused");
        return _transferWithTax(msg.sender, to, amount);
    }

    /// @notice Override transferFrom with tax calculation
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(!paused, "Token transfers are paused");
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        return _transferWithTax(from, to, amount);
    }

    /// @notice Internal transfer logic with tax
    function _transferWithTax(address from, address to, uint256 amount) internal returns (bool) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than 0");

        uint256 taxAmount = (amount * transferTaxBasisPoints) / 10000;
        uint256 transferAmount = amount - taxAmount;

        // Transfer to recipient
        _transfer(from, to, transferAmount);

        // Collect tax
        if (taxAmount > 0) {
            _transfer(from, treasuryAddress, taxAmount);
            emit TaxCollected(from, treasuryAddress, taxAmount);
        }

        return true;
    }

    // ============ Tax Management ============

    /// @notice Update transfer tax rate
    /// @param newTaxBasisPoints New tax rate in basis points (e.g., 500 = 5%)
    function setTransferTax(uint256 newTaxBasisPoints) external onlyOwner {
        require(newTaxBasisPoints <= 10000, "Tax cannot exceed 100%");
        transferTaxBasisPoints = newTaxBasisPoints;
        emit TaxRateUpdated(newTaxBasisPoints);
    }

    /// @notice Update treasury address
    /// @param newTreasury New treasury address
    function setTreasuryAddress(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Treasury address cannot be zero");
        treasuryAddress = newTreasury;
        emit TreasuryAddressUpdated(newTreasury);
    }

    // ============ Pause Management ============

    /// @notice Emergency pause all transfers
    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    /// @notice Resume transfers
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

    /// @notice Check if token is paused
    function isPaused() external view returns (bool) {
        return paused;
    }
}
