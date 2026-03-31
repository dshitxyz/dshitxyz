// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title DSHIT Token
 * @notice ERC-20 token for dshit.xyz meme protocol
 */
contract DSHIT is ERC20, Ownable, Pausable, ERC20Burnable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    uint256 public taxRate = 5; // 5% transfer tax
    address public treasuryAddress;

    event TaxRateUpdated(uint256 newRate);
    event TreasuryAddressUpdated(address newTreasury);

    constructor(address _treasuryAddress) ERC20("DSHIT", "DSHIT") Ownable(msg.sender) {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        treasuryAddress = _treasuryAddress;
        _mint(msg.sender, MAX_SUPPLY);
    }

    function setTaxRate(uint256 _taxRate) external onlyOwner {
        require(_taxRate <= 100, "Tax rate cannot exceed 100%");
        taxRate = _taxRate;
        emit TaxRateUpdated(_taxRate);
    }

    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasuryAddress = _newTreasury;
        emit TreasuryAddressUpdated(_newTreasury);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        if (from != address(0) && to != address(0) && taxRate > 0) {
            uint256 tax = (value * taxRate) / 100;
            super._update(from, treasuryAddress, tax);
            super._update(from, to, value - tax);
        } else {
            super._update(from, to, value);
        }
    }
}
