// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DSHIT Token
 * @dev ERC-20 token with tax, pause, and snapshot features for governance
 *
 * Features:
 * - Fixed 1 billion supply (no mint after deployment)
 * - 5% configurable transfer tax directed to treasury
 * - Pausable emergency circuit breaker (owner-only)
 * - Snapshot capability for governance voting (owner-only)
 * - Burnable tokens (users can burn their own)
 * - Reentrancy protection on external transfers
 *
 * Tax Mechanism:
 * - 5% tax on all transfers (except minting and burning)
 * - Tax recipient receives taxed amount
 * - Transfer amount shown to recipient is after tax
 * - Transparent: tax is emitted in Transfer event
 */
contract DSHIT is
    ERC20,
    ERC20Burnable,
    ERC20Snapshot,
    Pausable,
    Ownable,
    ReentrancyGuard
{
    // Constants
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_TAX_RATE = 100; // 10% maximum tax (100 basis points / 1000)

    // Tax configuration
    uint256 public taxRate = 50; // 5% = 50 basis points / 1000
    address public taxRecipient;

    // Events
    event TaxRateUpdated(uint256 indexed oldRate, uint256 indexed newRate);
    event TaxRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event SnapshotCreated(uint256 indexed snapshotId);
    event TokensPaused();
    event TokensUnpaused();

    /**
     * @dev Initialize DSHIT token with fixed supply and tax configuration
     * @param _taxRecipient Address to receive tax proceeds
     */
    constructor(address _taxRecipient) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_taxRecipient != address(0), "Invalid tax recipient");

        taxRecipient = _taxRecipient;

        // Mint entire supply to deployer
        _mint(msg.sender, INITIAL_SUPPLY);

        emit TaxRecipientUpdated(address(0), _taxRecipient);
    }

    /**
     * @dev Internal hook for applying transfer tax
     * Overrides _update to intercept all transfers and apply tax
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) whenNotPaused nonReentrant {
        require(amount > 0, "Transfer amount must be greater than zero");

        // Skip tax for minting (from == address(0)) and burning (to == address(0))
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Calculate tax
        uint256 taxAmount = (amount * taxRate) / 1000;
        uint256 amountAfterTax = amount - taxAmount;

        // Transfer with tax: from -> to (amount - tax), from -> taxRecipient (tax)
        super._update(from, taxRecipient, taxAmount);
        super._update(from, to, amountAfterTax);
    }

    /**
     * @dev Set transfer tax rate
     * @param newRate New tax rate in basis points / 1000 (e.g., 50 = 5%)
     */
    function setTaxRate(uint256 newRate) external onlyOwner {
        require(newRate <= MAX_TAX_RATE, "Tax rate exceeds maximum");

        uint256 oldRate = taxRate;
        taxRate = newRate;

        emit TaxRateUpdated(oldRate, newRate);
    }

    /**
     * @dev Update tax recipient address
     * @param newRecipient New address to receive tax proceeds
     */
    function setTaxRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid tax recipient");

        address oldRecipient = taxRecipient;
        taxRecipient = newRecipient;

        emit TaxRecipientUpdated(oldRecipient, newRecipient);
    }

    /**
     * @dev Pause token transfers (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
        emit TokensPaused();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
        emit TokensUnpaused();
    }

    /**
     * @dev Create a snapshot of current token state for governance voting
     * @return Current snapshot ID
     */
    function snapshot() external onlyOwner returns (uint256) {
        return _snapshot();
    }

    /**
     * @dev Get balance at a specific snapshot
     * @param account Address to check balance for
     * @param snapshotId Snapshot ID to query
     * @return Balance at snapshot
     */
    function balanceOfAt(address account, uint256 snapshotId)
        public
        view
        override
        returns (uint256)
    {
        return super.balanceOfAt(account, snapshotId);
    }

    /**
     * @dev Get total supply at a specific snapshot
     * @param snapshotId Snapshot ID to query
     * @return Total supply at snapshot
     */
    function totalSupplyAt(uint256 snapshotId) public view override returns (uint256) {
        return super.totalSupplyAt(snapshotId);
    }

    /**
     * @dev Override decimals to match ERC-20 standard for 18 decimals
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
