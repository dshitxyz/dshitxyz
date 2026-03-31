import { expect } from 'chai';
import { ethers } from 'hardhat';
import { DSHIT } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('DSHIT Token', function () {
  let dshit: DSHIT;
  let owner: SignerWithAddress;
  let taxRecipient: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseEther('1000000000'); // 1 billion
  const DEFAULT_TAX_RATE = 50; // 5%

  beforeEach(async function () {
    [owner, taxRecipient, user1, user2] = await ethers.getSigners();

    const DSHIT = await ethers.getContractFactory('DSHIT');
    dshit = await DSHIT.deploy(taxRecipient.address);
    await dshit.waitForDeployment();
  });

  describe('Deployment', function () {
    it('should have correct name and symbol', async function () {
      expect(await dshit.name()).to.equal('DSHIT');
      expect(await dshit.symbol()).to.equal('DSHIT');
    });

    it('should have correct decimals', async function () {
      expect(await dshit.decimals()).to.equal(18);
    });

    it('should mint initial supply to deployer', async function () {
      expect(await dshit.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it('should set correct initial total supply', async function () {
      expect(await dshit.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it('should set correct tax recipient', async function () {
      expect(await dshit.taxRecipient()).to.equal(taxRecipient.address);
    });

    it('should have default tax rate of 5%', async function () {
      expect(await dshit.taxRate()).to.equal(DEFAULT_TAX_RATE);
    });
  });

  describe('Basic Transfer', function () {
    it('should transfer tokens correctly with tax applied', async function () {
      const transferAmount = ethers.parseEther('1000');
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      await dshit.connect(owner).transfer(user1.address, transferAmount);

      expect(await dshit.balanceOf(user1.address)).to.equal(expectedReceived);
      expect(await dshit.balanceOf(taxRecipient.address)).to.equal(expectedTax);
    });

    it('should revert on zero amount transfer', async function () {
      await expect(dshit.connect(owner).transfer(user1.address, 0)).to.be.revertedWith(
        'Transfer amount must be greater than zero'
      );
    });

    it('should emit Transfer events for both recipient and tax recipient', async function () {
      const transferAmount = ethers.parseEther('1000');
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      await expect(dshit.connect(owner).transfer(user1.address, transferAmount))
        .to.emit(dshit, 'Transfer')
        .withArgs(owner.address, taxRecipient.address, expectedTax)
        .to.emit(dshit, 'Transfer')
        .withArgs(owner.address, user1.address, expectedReceived);
    });
  });

  describe('Transfer Tax', function () {
    it('should calculate tax correctly', async function () {
      const transferAmount = ethers.parseEther('1000');
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      await dshit.connect(owner).transfer(user1.address, transferAmount);

      expect(await dshit.balanceOf(taxRecipient.address)).to.equal(expectedTax);
      expect(await dshit.balanceOf(user1.address)).to.equal(expectedReceived);
    });

    it('should handle small amounts correctly', async function () {
      const transferAmount = ethers.parseEther('100');
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      await dshit.connect(owner).transfer(user1.address, transferAmount);

      expect(await dshit.balanceOf(user1.address)).to.equal(expectedReceived);
      expect(await dshit.balanceOf(taxRecipient.address)).to.equal(expectedTax);
    });
  });

  describe('Tax Configuration', function () {
    it('should update tax rate', async function () {
      const newTaxRate = 75; // 7.5%

      await dshit.connect(owner).setTaxRate(newTaxRate);

      expect(await dshit.taxRate()).to.equal(newTaxRate);
    });

    it('should revert if tax rate exceeds maximum', async function () {
      const excessiveTaxRate = 101; // > 10%

      await expect(dshit.connect(owner).setTaxRate(excessiveTaxRate)).to.be.revertedWith(
        'Tax rate exceeds maximum'
      );
    });

    it('should revert if non-owner tries to set tax rate', async function () {
      const newTaxRate = 75;

      await expect(dshit.connect(user1).setTaxRate(newTaxRate)).to.be.revertedWithCustomError(
        dshit,
        'OwnableUnauthorizedAccount'
      );
    });

    it('should update tax recipient', async function () {
      await dshit.connect(owner).setTaxRecipient(user1.address);

      expect(await dshit.taxRecipient()).to.equal(user1.address);
    });

    it('should revert setting invalid tax recipient', async function () {
      await expect(dshit.connect(owner).setTaxRecipient(ethers.ZeroAddress)).to.be.revertedWith(
        'Invalid tax recipient'
      );
    });

    it('should apply new tax rate to subsequent transfers', async function () {
      const newTaxRate = 100; // 10%
      await dshit.connect(owner).setTaxRate(newTaxRate);

      const transferAmount = ethers.parseEther('1000');
      const expectedTax = (transferAmount * BigInt(newTaxRate)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      await dshit.connect(owner).transfer(user1.address, transferAmount);

      expect(await dshit.balanceOf(user1.address)).to.equal(expectedReceived);
      expect(await dshit.balanceOf(taxRecipient.address)).to.equal(expectedTax);
    });
  });

  describe('Pause/Unpause', function () {
    it('should pause and unpause transfers', async function () {
      await dshit.connect(owner).pause();
      expect(await dshit.paused()).to.be.true;

      await expect(
        dshit.connect(owner).transfer(user1.address, ethers.parseEther('100'))
      ).to.be.revertedWithCustomError(dshit, 'EnforcedPause');

      await dshit.connect(owner).unpause();
      expect(await dshit.paused()).to.be.false;

      await expect(
        dshit.connect(owner).transfer(user1.address, ethers.parseEther('100'))
      ).to.not.be.reverted;
    });

    it('should revert if non-owner tries to pause', async function () {
      await expect(dshit.connect(user1).pause()).to.be.revertedWithCustomError(
        dshit,
        'OwnableUnauthorizedAccount'
      );
    });
  });

  describe('Burn', function () {
    it('should burn tokens from user balance', async function () {
      const burnAmount = ethers.parseEther('100');
      const initialBalance = await dshit.balanceOf(owner.address);
      const initialSupply = await dshit.totalSupply();

      await dshit.connect(owner).burn(burnAmount);

      expect(await dshit.balanceOf(owner.address)).to.equal(initialBalance - burnAmount);
      expect(await dshit.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it('should revert burning more than balance', async function () {
      const excessiveAmount = (await dshit.balanceOf(user1.address)) + ethers.parseEther('1');

      await expect(dshit.connect(user1).burn(excessiveAmount)).to.be.revertedWithCustomError(
        dshit,
        'ERC20InsufficientBalance'
      );
    });

    it('should allow burnFrom with approval', async function () {
      const burnAmount = ethers.parseEther('100');
      const initialSupply = await dshit.totalSupply();

      // Transfer tokens to user1 first
      await dshit.connect(owner).transfer(user1.address, ethers.parseEther('500'));

      // Approve user2 to burn user1's tokens
      await dshit.connect(user1).approve(user2.address, burnAmount);

      // user2 burns user1's tokens
      await dshit.connect(user2).burnFrom(user1.address, burnAmount);

      expect(await dshit.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe('Snapshots', function () {
    it('should create snapshots and query balances at snapshot', async function () {
      // Initial snapshot
      const snapshot1 = await dshit.connect(owner).snapshot();
      await snapshot1.wait();

      // Transfer tokens
      const transferAmount = ethers.parseEther('1000');
      await dshit.connect(owner).transfer(user1.address, transferAmount);

      // Create second snapshot
      const snapshot2 = await dshit.connect(owner).snapshot();
      await snapshot2.wait();

      // Check balances at different snapshots
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      // At snapshot 0: owner had all tokens
      expect(await dshit.balanceOfAt(owner.address, 0)).to.equal(INITIAL_SUPPLY);

      // After snapshot 1: user1 received tokens (minus tax)
      expect(await dshit.balanceOfAt(user1.address, 1)).to.equal(expectedReceived);
    });

    it('should allow only owner to create snapshots', async function () {
      await expect(dshit.connect(user1).snapshot()).to.be.revertedWithCustomError(
        dshit,
        'OwnableUnauthorizedAccount'
      );
    });
  });

  describe('Allowance and TransferFrom', function () {
    it('should allow transferFrom with proper allowance', async function () {
      const transferAmount = ethers.parseEther('100');

      // Owner approves user1 to spend tokens
      await dshit.connect(owner).approve(user1.address, transferAmount);

      // user1 transfers on behalf of owner
      await dshit.connect(user1).transferFrom(owner.address, user2.address, transferAmount);

      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      const expectedReceived = transferAmount - expectedTax;

      expect(await dshit.balanceOf(user2.address)).to.equal(expectedReceived);
    });

    it('should revert transferFrom without sufficient allowance', async function () {
      const transferAmount = ethers.parseEther('100');

      // Approve less than transfer amount
      await dshit.connect(owner).approve(user1.address, transferAmount / BigInt(2));

      await expect(
        dshit.connect(user1).transferFrom(owner.address, user2.address, transferAmount)
      ).to.be.revertedWithCustomError(dshit, 'ERC20InsufficientAllowance');
    });
  });

  describe('Edge Cases', function () {
    it('should handle self-transfers correctly', async function () {
      const transferAmount = ethers.parseEther('100');
      const initialBalance = await dshit.balanceOf(owner.address);

      // Transfer to self
      await dshit.connect(owner).transfer(owner.address, transferAmount);

      // Should have deducted tax
      const expectedTax = (transferAmount * BigInt(DEFAULT_TAX_RATE)) / BigInt(1000);
      expect(await dshit.balanceOf(owner.address)).to.equal(
        initialBalance - expectedTax - transferAmount + (transferAmount - expectedTax)
      );
    });

    it('should not allow transfers to zero address', async function () {
      await expect(
        dshit.connect(owner).transfer(ethers.ZeroAddress, ethers.parseEther('100'))
      ).to.be.revertedWithCustomError(dshit, 'ERC20InvalidReceiver');
    });
  });
});
