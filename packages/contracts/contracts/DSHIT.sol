// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DSHIT
 * @dev Memecoin on Base L2 with governance capabilities
 *
 * Features:
 * - Fixed supply of 1 billion tokens
 * - 5% configurable transfer tax
 * - Pausable for emergency situations
 * - Burnable tokens
 * - ReentrancyGuard protection
 */
contract DSHIT is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    Ownable,
    ReentrancyGuard
{
    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens with 18 decimals

    // Tax configuration
    uint256 public taxPercentage = 5; // 5% default tax
    address public taxRecipient;

    // Events
    event TaxUpdated(uint256 newTaxPercentage, address indexed taxRecipient);

    /**
     * @dev Initialize DSHIT token with initial supply
     * Mints all tokens to the deployer (owner)
     */
    constructor() ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        taxRecipient = msg.sender;
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Pause token transfers
     * Only callable by owner
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     * Only callable by owner
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Update tax percentage and recipient
     * Only callable by owner
     *
     * @param _newTaxPercentage New tax percentage (0-100)
     * @param _newTaxRecipient New tax recipient address
     */
    function setTax(uint256 _newTaxPercentage, address _newTaxRecipient)
        public
        onlyOwner
    {
        require(_newTaxPercentage <= 100, "Tax cannot exceed 100%");
        require(_newTaxRecipient != address(0), "Invalid tax recipient");

        taxPercentage = _newTaxPercentage;
        taxRecipient = _newTaxRecipient;

        emit TaxUpdated(_newTaxPercentage, _newTaxRecipient);
    }

    /**
     * @dev Internal hook to apply transfer tax
     * Deducts tax from transfer amount and sends to tax recipient
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        // Calculate tax
        uint256 taxAmount = (amount * taxPercentage) / 100;
        uint256 transferAmount = amount - taxAmount;

        // Transfer tax to recipient (if tax > 0)
        if (taxAmount > 0 && taxRecipient != address(0)) {
            super._update(from, taxRecipient, taxAmount);
        }

        // Transfer remaining amount to recipient
        super._update(from, to, transferAmount);
    }

    /**
     * @dev Override decimals to return 18
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
