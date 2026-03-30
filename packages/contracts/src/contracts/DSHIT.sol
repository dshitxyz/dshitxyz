// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DSHIT Token
 * @dev ERC20 token with transfer tax and pause capabilities
 */
contract DSHIT is
    ERC20,
    ERC20Burnable,
    Ownable,
    Pausable,
    ReentrancyGuard
{
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint256 public transferTaxPercent = 5;
    address public taxRecipient;

    event TransferTaxPercentChanged(uint256 newPercent);
    event TaxRecipientChanged(address newRecipient);
    event TaxCollected(address indexed from, address indexed to, uint256 amount);

    constructor(address _taxRecipient) ERC20("DSHIT", "DSHIT") {
        require(_taxRecipient != address(0), "Invalid tax recipient");
        taxRecipient = _taxRecipient;
        _mint(msg.sender, MAX_SUPPLY);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function setTransferTaxPercent(uint256 _percent) public onlyOwner {
        require(_percent <= 100, "Tax percent too high");
        transferTaxPercent = _percent;
        emit TransferTaxPercentChanged(_percent);
    }

    function setTaxRecipient(address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid tax recipient");
        taxRecipient = _recipient;
        emit TaxRecipientChanged(_recipient);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        // Calculate tax
        uint256 taxAmount = 0;
        if (transferTaxPercent > 0 && from != address(0) && to != taxRecipient) {
            taxAmount = (amount * transferTaxPercent) / 100;
        }

        if (taxAmount > 0) {
            super._update(from, taxRecipient, taxAmount);
            emit TaxCollected(from, taxRecipient, taxAmount);
            amount -= taxAmount;
        }

        super._update(from, to, amount);
    }
}
