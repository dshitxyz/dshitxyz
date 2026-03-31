// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DSHIT
 * @dev DSHIT Token - Community-driven memecoin on Base L2
 *
 * Features:
 * - 1 billion fixed supply (no minting after deploy)
 * - 5% configurable transfer tax
 * - Emergency pause mechanism
 * - Burnable tokens
 * - Reentrancy protection
 */
contract DSHIT is
  ERC20,
  Ownable,
  Pausable,
  ERC20Burnable,
  ReentrancyGuard
{
  // Tax configuration
  uint256 public constant TAX_DENOMINATOR = 10000; // 100.00%
  uint256 public taxRate = 500; // 5% = 500/10000
  address public taxRecipient;

  // Events
  event TaxRateUpdated(uint256 oldRate, uint256 newRate);
  event TaxRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);

  // Constants
  uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens with 18 decimals

  constructor() ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
    _mint(msg.sender, MAX_SUPPLY);
    taxRecipient = msg.sender;
  }

  /**
   * @dev Pause all token transfers (emergency circuit breaker)
   */
  function pause() public onlyOwner {
    _pause();
  }

  /**
   * @dev Unpause all token transfers
   */
  function unpause() public onlyOwner {
    _unpause();
  }

  /**
   * @dev Update the transfer tax rate
   * @param newRate New tax rate (e.g., 500 for 5%)
   */
  function setTaxRate(uint256 newRate) public onlyOwner {
    require(newRate <= 2000, "Tax rate cannot exceed 20%");
    uint256 oldRate = taxRate;
    taxRate = newRate;
    emit TaxRateUpdated(oldRate, newRate);
  }

  /**
   * @dev Update the tax recipient address
   * @param newRecipient New tax recipient
   */
  function setTaxRecipient(address newRecipient) public onlyOwner {
    require(newRecipient != address(0), "Tax recipient cannot be zero address");
    address oldRecipient = taxRecipient;
    taxRecipient = newRecipient;
    emit TaxRecipientUpdated(oldRecipient, newRecipient);
  }

  // Internal overrides

  function _update(address from, address to, uint256 amount)
    internal
    override(ERC20)
    whenNotPaused
    nonReentrant
  {
    // Apply tax on transfers (not minting or burning)
    if (from != address(0) && to != address(0)) {
      uint256 tax = (amount * taxRate) / TAX_DENOMINATOR;
      uint256 amountAfterTax = amount - tax;

      // Transfer tax to recipient
      super._update(from, taxRecipient, tax);
      // Transfer remaining amount to recipient
      super._update(from, to, amountAfterTax);
    } else {
      // No tax on minting or burning
      super._update(from, to, amount);
    }
  }
}
