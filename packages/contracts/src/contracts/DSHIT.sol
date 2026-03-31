// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DSHIT Token
 * @dev ERC-20 token for dshit.xyz platform with tax, snapshot, and governance features
 *
 * Features:
 * - Fixed supply of 1 billion tokens (no mint after deploy)
 * - 5% configurable transfer tax sent to treasury
 * - Pausable (emergency circuit breaker)
 * - Snapshot for governance voting (anti-flash-loan)
 * - Burnable tokens
 * - Reentrancy protection
 */
contract DSHIT is ERC20, ERC20Burnable, ERC20Snapshot, Pausable, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_TAX = 500; // 5% = 500 basis points
    uint256 private constant BASIS_POINTS = 10_000; // 100% = 10,000 basis points

    // State variables
    uint256 public transferTaxRate = INITIAL_TAX; // Tax rate in basis points (500 = 5%)
    address public treasuryAddress; // Treasury address that receives tax
    mapping(address => bool) public isTaxExempt; // Addresses exempt from tax

    // Events
    event TaxRateUpdated(uint256 oldRate, uint256 newRate);
    event TreasuryAddressUpdated(address indexed oldTreasury, address indexed newTreasury);
    event TaxExemptionUpdated(address indexed account, bool isExempt);
    event SnapshotCreated(uint256 indexed snapshotId);
    event TokensBurned(address indexed burner, uint256 amount);

    /**
     * @dev Constructor initializes the token with fixed supply
     * @param _treasury Address to receive transfer taxes
     */
    constructor(address _treasury) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");

        treasuryAddress = _treasury;

        // Mint entire supply to deployer
        _mint(msg.sender, MAX_SUPPLY);

        // Exempt deployer and treasury from tax
        isTaxExempt[msg.sender] = true;
        isTaxExempt[_treasury] = true;
    }

    /**
     * @dev Pause token transfers (emergency circuit breaker)
     * Only owner can call
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     * Only owner can call
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Create a snapshot for governance voting
     * Returns snapshot ID
     * Only owner can call
     */
    function snapshot() public onlyOwner returns (uint256) {
        uint256 snapshotId = _snapshot();
        emit SnapshotCreated(snapshotId);
        return snapshotId;
    }

    /**
     * @dev Set the transfer tax rate
     * @param _newTaxRate New tax rate in basis points (e.g., 500 = 5%)
     * Only owner can call, max 10% (1000 basis points)
     */
    function setTransferTaxRate(uint256 _newTaxRate) public onlyOwner {
        require(_newTaxRate <= 1000, "Tax rate cannot exceed 10%");

        uint256 oldRate = transferTaxRate;
        transferTaxRate = _newTaxRate;

        emit TaxRateUpdated(oldRate, _newTaxRate);
    }

    /**
     * @dev Set the treasury address that receives taxes
     * @param _newTreasury New treasury address
     * Only owner can call
     */
    function setTreasuryAddress(address _newTreasury) public onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");

        address oldTreasury = treasuryAddress;
        treasuryAddress = _newTreasury;

        // Grant tax exemption to new treasury
        isTaxExempt[_newTreasury] = true;

        emit TreasuryAddressUpdated(oldTreasury, _newTreasury);
    }

    /**
     * @dev Exempt or un-exempt an address from transfer tax
     * @param _account Address to update
     * @param _isExempt Whether the address should be tax exempt
     * Only owner can call
     */
    function setTaxExemption(address _account, bool _isExempt) public onlyOwner {
        require(_account != address(0), "Invalid account");

        isTaxExempt[_account] = _isExempt;
        emit TaxExemptionUpdated(_account, _isExempt);
    }

    /**
     * @dev Burn tokens (reduce total supply)
     * Callable by any token holder
     */
    function burn(uint256 amount) public override {
        require(amount > 0, "Burn amount must be greater than 0");
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Burn tokens from another account (requires approval)
     * @param account Account to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public override {
        require(amount > 0, "Burn amount must be greater than 0");
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    /**
     * @dev Get balance at a specific snapshot
     * @param account Account address
     * @param snapshotId Snapshot ID
     */
    function balanceOfAt(address account, uint256 snapshotId)
        public
        view
        returns (uint256)
    {
        return super.balanceOfAt(account, snapshotId);
    }

    /**
     * @dev Get total supply at a specific snapshot
     * @param snapshotId Snapshot ID
     */
    function totalSupplyAt(uint256 snapshotId)
        public
        view
        returns (uint256)
    {
        return super.totalSupplyAt(snapshotId);
    }

    /**
     * @dev Internal transfer with tax calculation
     * Override to apply transfer tax
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) whenNotPaused {
        // Skip tax for excluded addresses and minting/burning
        if (from == address(0) || to == address(0) || isTaxExempt[from] || isTaxExempt[to]) {
            super._update(from, to, amount);
            return;
        }

        // Calculate tax
        uint256 tax = (amount * transferTaxRate) / BASIS_POINTS;
        uint256 amountAfterTax = amount - tax;

        // Transfer amount after tax to recipient
        super._update(from, to, amountAfterTax);

        // Transfer tax to treasury
        if (tax > 0) {
            super._update(from, treasuryAddress, tax);
        }
    }
}
