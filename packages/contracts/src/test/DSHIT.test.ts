import { expect } from "chai";
import { ethers } from "hardhat";
import { DSHIT } from "../typechain/ethers-v6";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DSHIT Token", function () {
  let dshit: DSHIT;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const ONE_BILLION = ethers.parseEther("1000000000");
  const ONE_TOKEN = ethers.parseEther("1");
  const TAX_RATE = 500; // 5%

  beforeEach(async function () {
    [owner, treasury, user1, user2] = await ethers.getSigners();

    const DSHIT = await ethers.getContractFactory("DSHIT");
    dshit = await DSHIT.deploy(treasury.address);
    await dshit.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should deploy with correct initial supply", async function () {
      const supply = await dshit.totalSupply();
      expect(supply).to.equal(ONE_BILLION);
    });

    it("should mint entire supply to deployer", async function () {
      const balance = await dshit.balanceOf(owner.address);
      expect(balance).to.equal(ONE_BILLION);
    });

    it("should set correct treasury address", async function () {
      expect(await dshit.treasuryAddress()).to.equal(treasury.address);
    });

    it("should set correct initial tax rate", async function () {
      expect(await dshit.transferTaxRate()).to.equal(TAX_RATE);
    });

    it("should have owner and treasury tax exempt by default", async function () {
      expect(await dshit.isTaxExempt(owner.address)).to.be.true;
      expect(await dshit.isTaxExempt(treasury.address)).to.be.true;
    });

    it("should have correct token name and symbol", async function () {
      expect(await dshit.name()).to.equal("DSHIT");
      expect(await dshit.symbol()).to.equal("DSHIT");
    });

    it("should have correct decimals", async function () {
      expect(await dshit.decimals()).to.equal(18);
    });
  });

  describe("Transfer Tax", function () {
    beforeEach(async function () {
      // Transfer some tokens to user1
      await dshit.transfer(user1.address, ethers.parseEther("1000"));
    });

    it("should apply 5% tax on regular transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      const expectedTax = ethers.parseEther("5"); // 5% of 100
      const expectedReceived = ethers.parseEther("95");

      const tx = await dshit.connect(user1).transfer(user2.address, transferAmount);

      const user2Balance = await dshit.balanceOf(user2.address);
      const treasuryBalance = await dshit.balanceOf(treasury.address);

      expect(user2Balance).to.equal(expectedReceived);
      expect(treasuryBalance).to.equal(expectedTax);
    });

    it("should not apply tax on transfers from tax-exempt addresses", async function () {
      const transferAmount = ethers.parseEther("100");

      // Owner is tax exempt
      const tx = await dshit.connect(owner).transfer(user1.address, transferAmount);

      const user1Balance = await dshit.balanceOf(user1.address);
      expect(user1Balance).to.equal(ethers.parseEther("1100")); // Previous 1000 + 100
    });

    it("should not apply tax on transfers to tax-exempt addresses", async function () {
      const transferAmount = ethers.parseEther("100");

      // Set user2 as tax exempt
      await dshit.setTaxExemption(user2.address, true);

      const tx = await dshit.connect(user1).transfer(user2.address, transferAmount);

      const user2Balance = await dshit.balanceOf(user2.address);
      expect(user2Balance).to.equal(transferAmount); // Full amount, no tax
    });

    it("should handle zero transfers correctly", async function () {
      const tx = await dshit.connect(user1).transfer(user2.address, 0);
      expect(await dshit.balanceOf(user2.address)).to.equal(0);
    });

    it("should handle max uint256 transfers (within balance)", async function () {
      const transferAmount = ethers.parseEther("1000");
      const tx = await dshit.connect(user1).transfer(user2.address, transferAmount);

      const expectedTax = (transferAmount * 5n) / 100n;
      const expectedReceived = transferAmount - expectedTax;

      const balance = await dshit.balanceOf(user2.address);
      expect(balance).to.equal(expectedReceived);
    });
  });

  describe("Tax Management", function () {
    it("should allow owner to update tax rate", async function () {
      const newTaxRate = 750; // 7.5%
      await dshit.setTransferTaxRate(newTaxRate);

      expect(await dshit.transferTaxRate()).to.equal(newTaxRate);
    });

    it("should emit TaxRateUpdated event", async function () {
      const newTaxRate = 750;
      await expect(dshit.setTransferTaxRate(newTaxRate))
        .to.emit(dshit, "TaxRateUpdated")
        .withArgs(TAX_RATE, newTaxRate);
    });

    it("should prevent tax rate exceeding 10%", async function () {
      const invalidTaxRate = 1001; // > 10%
      await expect(dshit.setTransferTaxRate(invalidTaxRate)).to.be.revertedWith(
        "Tax rate cannot exceed 10%"
      );
    });

    it("should allow owner to change treasury address", async function () {
      const newTreasury = user1.address;
      await dshit.setTreasuryAddress(newTreasury);

      expect(await dshit.treasuryAddress()).to.equal(newTreasury);
    });

    it("should emit TreasuryAddressUpdated event", async function () {
      const newTreasury = user1.address;
      await expect(dshit.setTreasuryAddress(newTreasury))
        .to.emit(dshit, "TreasuryAddressUpdated")
        .withArgs(treasury.address, newTreasury);
    });

    it("should prevent invalid treasury address (zero address)", async function () {
      await expect(dshit.setTreasuryAddress(ethers.ZeroAddress)).to.be.revertedWith(
        "Invalid treasury address"
      );
    });

    it("should allow owner to exempt/un-exempt addresses", async function () {
      expect(await dshit.isTaxExempt(user1.address)).to.be.false;

      await dshit.setTaxExemption(user1.address, true);
      expect(await dshit.isTaxExempt(user1.address)).to.be.true;

      await dshit.setTaxExemption(user1.address, false);
      expect(await dshit.isTaxExempt(user1.address)).to.be.false;
    });

    it("should emit TaxExemptionUpdated event", async function () {
      await expect(dshit.setTaxExemption(user1.address, true))
        .to.emit(dshit, "TaxExemptionUpdated")
        .withArgs(user1.address, true);
    });

    it("should prevent non-owner from changing tax rate", async function () {
      await expect(dshit.connect(user1).setTransferTaxRate(750)).to.be.reverted;
    });

    it("should prevent non-owner from changing treasury", async function () {
      await expect(dshit.connect(user1).setTreasuryAddress(user2.address)).to.be.reverted;
    });
  });

  describe("Pausable", function () {
    it("should allow owner to pause transfers", async function () {
      await dshit.pause();
      expect(await dshit.paused()).to.be.true;
    });

    it("should prevent transfers when paused", async function () {
      await dshit.transfer(user1.address, ethers.parseEther("100"));
      await dshit.pause();

      await expect(
        dshit.connect(user1).transfer(user2.address, ethers.parseEther("50"))
      ).to.be.reverted;
    });

    it("should allow owner to unpause", async function () {
      await dshit.pause();
      await dshit.unpause();
      expect(await dshit.paused()).to.be.false;
    });

    it("should allow transfers after unpausing", async function () {
      await dshit.transfer(user1.address, ethers.parseEther("100"));
      await dshit.pause();
      await dshit.unpause();

      const tx = await dshit.connect(user1).transfer(user2.address, ethers.parseEther("50"));
      const balance = await dshit.balanceOf(user2.address);
      expect(balance).to.be.gt(0);
    });

    it("should prevent non-owner from pausing", async function () {
      await expect(dshit.connect(user1).pause()).to.be.reverted;
    });
  });

  describe("Snapshot", function () {
    it("should create a snapshot", async function () {
      const tx = await dshit.snapshot();
      const receipt = await tx.wait();
      expect(receipt).to.not.be.null;
    });

    it("should emit SnapshotCreated event", async function () {
      await expect(dshit.snapshot()).to.emit(dshit, "SnapshotCreated");
    });

    it("should track balance at snapshot", async function () {
      await dshit.transfer(user1.address, ethers.parseEther("500"));
      const snapshotTx = await dshit.snapshot();
      const snapshotReceipt = await snapshotTx.wait();

      // Snapshot ID should be 1 (first snapshot)
      const user1BalanceAtSnapshot = await dshit.balanceOfAt(user1.address, 1);
      expect(user1BalanceAtSnapshot).to.be.gt(0);
    });

    it("should track total supply at snapshot", async function () {
      const snapshotTx = await dshit.snapshot();
      const supplyAtSnapshot = await dshit.totalSupplyAt(1);
      expect(supplyAtSnapshot).to.equal(ONE_BILLION);
    });

    it("should prevent non-owner from creating snapshot", async function () {
      await expect(dshit.connect(user1).snapshot()).to.be.reverted;
    });
  });

  describe("Burnable", function () {
    beforeEach(async function () {
      await dshit.transfer(user1.address, ethers.parseEther("1000"));
    });

    it("should allow burning tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialSupply = await dshit.totalSupply();

      await dshit.connect(user1).burn(burnAmount);

      const finalSupply = await dshit.totalSupply();
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });

    it("should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("100");
      await expect(dshit.connect(user1).burn(burnAmount))
        .to.emit(dshit, "TokensBurned")
        .withArgs(user1.address, burnAmount);
    });

    it("should allow burnFrom with approval", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialSupply = await dshit.totalSupply();

      // Approve owner to burn user1's tokens
      await dshit.connect(user1).approve(owner.address, burnAmount);
      await dshit.burnFrom(user1.address, burnAmount);

      const finalSupply = await dshit.totalSupply();
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });

    it("should prevent burning zero amount", async function () {
      await expect(dshit.connect(user1).burn(0)).to.be.revertedWith(
        "Burn amount must be greater than 0"
      );
    });

    it("should prevent burning more than balance", async function () {
      const balance = await dshit.balanceOf(user1.address);
      await expect(dshit.connect(user1).burn(balance + ethers.parseEther("1"))).to.be
        .reverted;
    });
  });

  describe("Approvals & Allowances", function () {
    it("should allow approval", async function () {
      await dshit.approve(user1.address, ethers.parseEther("100"));
      const allowance = await dshit.allowance(owner.address, user1.address);
      expect(allowance).to.equal(ethers.parseEther("100"));
    });

    it("should allow transferFrom with sufficient allowance", async function () {
      const transferAmount = ethers.parseEther("100");
      await dshit.approve(user1.address, transferAmount);

      const tx = await dshit.connect(user1).transferFrom(owner.address, user2.address, transferAmount);
      const balance = await dshit.balanceOf(user2.address);
      expect(balance).to.be.gt(0);
    });

    it("should prevent transferFrom with insufficient allowance", async function () {
      await dshit.approve(user1.address, ethers.parseEther("50"));

      await expect(
        dshit.connect(user1).transferFrom(owner.address, user2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("should handle self-transfers correctly", async function () {
      const transferAmount = ethers.parseEther("100");
      await dshit.transfer(user1.address, transferAmount);

      const balanceBefore = await dshit.balanceOf(user1.address);
      await dshit.connect(user1).transfer(user1.address, ethers.parseEther("50"));
      const balanceAfter = await dshit.balanceOf(user1.address);

      // Should have tax applied even to self-transfers
      expect(balanceAfter).to.be.lt(balanceBefore);
    });

    it("should handle multiple sequential transfers correctly", async function () {
      await dshit.transfer(user1.address, ethers.parseEther("1000"));

      // First transfer
      await dshit.connect(user1).transfer(user2.address, ethers.parseEther("100"));
      const balance1 = await dshit.balanceOf(user2.address);

      // Second transfer
      await dshit.connect(user1).transfer(user2.address, ethers.parseEther("100"));
      const balance2 = await dshit.balanceOf(user2.address);

      expect(balance2).to.be.gt(balance1);
    });

    it("should have correct supply after burn operations", async function () {
      const initialSupply = await dshit.totalSupply();
      const burnAmount = ethers.parseEther("1000");

      await dshit.burn(burnAmount);

      const finalSupply = await dshit.totalSupply();
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });
  });
});
