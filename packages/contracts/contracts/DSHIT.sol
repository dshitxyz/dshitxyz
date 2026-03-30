// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title DSHIT Token
 * @dev ERC-20 token with transfer tax and burn capabilities
 */
contract DSHIT is ERC20, Ownable, ERC20Burnable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;
    uint256 public constant TAX_PERCENTAGE = 5; // 5% transfer tax
    uint256 public constant PERCENTAGE_DENOMINATOR = 100;

    address public taxRecipient;

    // Events
    event TaxRecipientUpdated(address indexed newTaxRecipient);
    event TaxCollected(address indexed from, address indexed to, uint256 taxAmount);

    constructor(address _taxRecipient) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_taxRecipient != address(0), "Tax recipient cannot be zero address");
        taxRecipient = _taxRecipient;
        _mint(msg.sender, MAX_SUPPLY);
    }

    /**
     * @dev Set tax recipient address
     */
    function setTaxRecipient(address _taxRecipient) external onlyOwner {
        require(_taxRecipient != address(0), "Tax recipient cannot be zero address");
        taxRecipient = _taxRecipient;
        emit TaxRecipientUpdated(_taxRecipient);
    }

    /**
     * @dev Internal transfer with tax applied
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(to != address(0), "Cannot transfer to zero address");

        // Calculate tax if not minting and transferring
        if (from != address(0) && to != address(0)) {
            uint256 taxAmount = (amount * TAX_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
            uint256 transferAmount = amount - taxAmount;

            // Transfer tokens
            super._transfer(from, to, transferAmount);

            // Transfer tax to tax recipient
            if (taxAmount > 0) {
                super._transfer(from, taxRecipient, taxAmount);
                emit TaxCollected(from, taxRecipient, taxAmount);
            }
        } else {
            super._transfer(from, to, amount);
        }
    }

    /**
     * @dev Override decimals to return 18
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
