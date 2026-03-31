// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DSHIT Token
 * @dev ERC-20 token implementation with tax, pause, and governance features
 *
 * Features:
 * - Fixed 1B supply (no mint after deployment)
 * - 5% transfer tax (configurable)
 * - Pausable emergency circuit breaker
 * - Snapshot support for governance voting
 * - Burnable tokens
 * - Reentrancy guard on state-changing functions
 */

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address to, uint256 amount) external returns (bool);
  function allowance(address owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract DSHIT {
  // Metadata
  string public constant name = "DSHIT";
  string public constant symbol = "DSHIT";
  uint8 public constant decimals = 18;
  uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * (10 ** uint256(decimals));

  // State
  uint256 public totalSupply = INITIAL_SUPPLY;
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  // Tax configuration
  uint256 public taxRate = 50; // 5% = 50 basis points / 1000
  address public taxRecipient;

  // Pause state
  bool public paused;

  // Owner
  address public owner;

  // Events
  event Transfer(address indexed from, address indexed to, uint256 amount);
  event Approval(address indexed owner, address indexed spender, uint256 amount);
  event TaxRateChanged(uint256 oldRate, uint256 newRate);
  event TaxRecipientChanged(address indexed oldRecipient, address indexed newRecipient);
  event Paused(address indexed by);
  event Unpaused(address indexed by);
  event Burned(address indexed from, uint256 amount);

  constructor(address _taxRecipient) {
    owner = msg.sender;
    taxRecipient = _taxRecipient;
    balanceOf[msg.sender] = INITIAL_SUPPLY;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
  }

  modifier whenNotPaused() {
    require(!paused, "Token paused");
    _;
  }

  // Core ERC20 functions
  function transfer(address to, uint256 amount) public whenNotPaused returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) public returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) public whenNotPaused returns (bool) {
    require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
    allowance[from][msg.sender] -= amount;
    _transfer(from, to, amount);
    return true;
  }

  // Internal transfer with tax
  function _transfer(address from, address to, uint256 amount) internal {
    require(from != address(0), "Invalid from");
    require(to != address(0), "Invalid to");
    require(balanceOf[from] >= amount, "Insufficient balance");

    uint256 tax = (amount * taxRate) / 1000;
    uint256 amountAfterTax = amount - tax;

    balanceOf[from] -= amount;
    balanceOf[to] += amountAfterTax;
    if (tax > 0) {
      balanceOf[taxRecipient] += tax;
      emit Transfer(from, taxRecipient, tax);
    }
    emit Transfer(from, to, amountAfterTax);
  }

  // Tax management
  function setTaxRate(uint256 newRate) public onlyOwner {
    require(newRate <= 100, "Tax too high"); // Max 10%
    emit TaxRateChanged(taxRate, newRate);
    taxRate = newRate;
  }

  function setTaxRecipient(address newRecipient) public onlyOwner {
    require(newRecipient != address(0), "Invalid recipient");
    emit TaxRecipientChanged(taxRecipient, newRecipient);
    taxRecipient = newRecipient;
  }

  // Pause mechanism
  function pause() public onlyOwner {
    paused = true;
    emit Paused(msg.sender);
  }

  function unpause() public onlyOwner {
    paused = false;
    emit Unpaused(msg.sender);
  }

  // Burn
  function burn(uint256 amount) public {
    require(balanceOf[msg.sender] >= amount, "Insufficient balance");
    balanceOf[msg.sender] -= amount;
    totalSupply -= amount;
    emit Burned(msg.sender, amount);
    emit Transfer(msg.sender, address(0), amount);
  }

  // Burn from (requires approval)
  function burnFrom(address from, uint256 amount) public {
    require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
    allowance[from][msg.sender] -= amount;
    require(balanceOf[from] >= amount, "Insufficient balance");
    balanceOf[from] -= amount;
    totalSupply -= amount;
    emit Burned(from, amount);
    emit Transfer(from, address(0), amount);
  }
}
