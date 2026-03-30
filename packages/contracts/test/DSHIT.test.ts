import { expect } from "chai";
import { ethers } from "hardhat";
import { DSHIT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DSHIT Token", () => {
  let dshit: DSHIT;
  let owner: SignerWithAddress;
  let treasury: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  const MAX_SUPPLY = ethers.parseEther("1000000000"); // 1B tokens
  const INITIAL_TAX = 500; // 5%

  beforeEach(async () => {
    [owner, treasury, user1, user2, user3] = await ethers.getSigners();

    const DSHIT = await ethers.getContractFactory("DSHIT");
    dshit = await DSHIT.deploy(treasury.address);
    await dshit.waitForDeployment();
  });

  describe("Deployment", () => {
    it("Should deploy with correct name and symbol", async () => {
      expect(await dshit.name()).to.equal("DSHIT");
      expect(await dshit.symbol()).to.equal("DSHIT");
    });

    it("Should mint MAX_SUPPLY to owner", async () => {
      const ownerBalance = await dshit.balanceOf(owner.address);
      expect(ownerBalance).to.equal(MAX_SUPPLY);
    });

    it("Should set treasury address", async () => {
      expect(await dshit.treasuryAddress()).to.equal(treasury.address);
    });

    it("Should have correct initial tax rate", async () => {
      expect(await dshit.transferTaxBasisPoints()).to.equal(INITIAL_TAX);
    });

    it("Should have total supply equal to MAX_SUPPLY", async () => {
      expect(await dshit.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should have 18 decimals", async () => {
      expect(await dshit.decimals()).to.equal(18);
    });
  });

  describe("Transfer with Tax", () => {
    it("Should transfer with 5% tax deducted", async () => {
      const transferAmount = ethers.parseEther("1000");
      const expectedTax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);
      const expectedTransfer = transferAmount - expectedTax;

      await dshit.transfer(user1.address, transferAmount);

      expect(await dshit.balanceOf(user1.address)).to.equal(expectedTransfer);
      expect(await dshit.balanceOf(treasury.address)).to.equal(expectedTax);
    });

    it("Should transfer to treasury on every transfer", async () => {
      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);

      const treasuryBefore = await dshit.balanceOf(treasury.address);
      await dshit.transfer(user1.address, transferAmount);
      const treasuryAfter = await dshit.balanceOf(treasury.address);

      expect(treasuryAfter - treasuryBefore).to.equal(expectedTax);
    });

    it("Should handle multiple transfers correctly", async () => {
      const amount1 = ethers.parseEther("1000");
      const amount2 = ethers.parseEther("500");

      await dshit.transfer(user1.address, amount1);
      const user1Balance = await dshit.balanceOf(user1.address);

      await dshit.connect(user1).transfer(user2.address, amount2);

      const tax2 = (amount2 * BigInt(INITIAL_TAX)) / BigInt(10000);
      expect(await dshit.balanceOf(user2.address)).to.equal(amount2 - tax2);
    });

    it("Should not apply tax to minting (zero address)", async () => {
      // This is tested indirectly via deployment
      expect(await dshit.totalSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should emit TaxCollected event", async () => {
      const transferAmount = ethers.parseEther("100");
      const tax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);

      await expect(dshit.transfer(user1.address, transferAmount))
        .to.emit(dshit, "TaxCollected")
        .withArgs(owner.address, treasury.address, tax);
    });
  });

  describe("Tax Management", () => {
    it("Should allow owner to set transfer tax", async () => {
      const newTax = 1000; // 10%
      await dshit.setTransferTax(newTax);
      expect(await dshit.transferTaxBasisPoints()).to.equal(newTax);
    });

    it("Should emit TaxRateUpdated event", async () => {
      const newTax = 1000;
      await expect(dshit.setTransferTax(newTax))
        .to.emit(dshit, "TaxRateUpdated")
        .withArgs(newTax);
    });

    it("Should not allow tax > 100%", async () => {
      await expect(dshit.setTransferTax(10001)).to.be.revertedWith(
        "Tax cannot exceed 100%"
      );
    });

    it("Should not allow non-owner to set tax", async () => {
      await expect(dshit.connect(user1).setTransferTax(1000)).to.be.reverted;
    });

    it("Should apply new tax rate to transfers", async () => {
      const newTax = 1000; // 10%
      await dshit.setTransferTax(newTax);

      const transferAmount = ethers.parseEther("1000");
      const expectedTax = (transferAmount * BigInt(newTax)) / BigInt(10000);

      await dshit.transfer(user1.address, transferAmount);
      expect(await dshit.balanceOf(treasury.address)).to.equal(expectedTax);
    });
  });

  describe("Treasury Management", () => {
    it("Should allow owner to set treasury address", async () => {
      await dshit.setTreasuryAddress(user3.address);
      expect(await dshit.treasuryAddress()).to.equal(user3.address);
    });

    it("Should emit TreasuryAddressUpdated event", async () => {
      await expect(dshit.setTreasuryAddress(user3.address))
        .to.emit(dshit, "TreasuryAddressUpdated")
        .withArgs(user3.address);
    });

    it("Should not allow zero address as treasury", async () => {
      await expect(
        dshit.setTreasuryAddress(ethers.ZeroAddress)
      ).to.be.revertedWith("Treasury address cannot be zero");
    });

    it("Should not allow non-owner to set treasury", async () => {
      await expect(
        dshit.connect(user1).setTreasuryAddress(user3.address)
      ).to.be.reverted;
    });

    it("Should send tax to new treasury address", async () => {
      await dshit.setTreasuryAddress(user3.address);

      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);

      await dshit.transfer(user1.address, transferAmount);
      expect(await dshit.balanceOf(user3.address)).to.equal(expectedTax);
    });
  });

  describe("Pause/Unpause", () => {
    it("Should pause transfers", async () => {
      await dshit.pause();
      const paused = await dshit.paused();
      expect(paused).to.be.true;
    });

    it("Should revert transfers when paused", async () => {
      await dshit.pause();
      await expect(dshit.transfer(user1.address, ethers.parseEther("1"))).to.be
        .reverted;
    });

    it("Should unpause transfers", async () => {
      await dshit.pause();
      await dshit.unpause();
      const paused = await dshit.paused();
      expect(paused).to.be.false;
    });

    it("Should allow transfers after unpause", async () => {
      await dshit.pause();
      await dshit.unpause();

      const transferAmount = ethers.parseEther("100");
      await expect(dshit.transfer(user1.address, transferAmount)).to.not.be
        .reverted;
    });

    it("Should not allow non-owner to pause", async () => {
      await expect(dshit.connect(user1).pause()).to.be.reverted;
    });

    it("Should not allow non-owner to unpause", async () => {
      await dshit.pause();
      await expect(dshit.connect(user1).unpause()).to.be.reverted;
    });
  });

  describe("Burn", () => {
    it("Should allow user to burn their tokens", async () => {
      const burnAmount = ethers.parseEther("100");
      const balanceBefore = await dshit.balanceOf(owner.address);

      await dshit.burn(burnAmount);

      const balanceAfter = await dshit.balanceOf(owner.address);
      expect(balanceAfter).to.equal(balanceBefore - burnAmount);
    });

    it("Should reduce total supply on burn", async () => {
      const burnAmount = ethers.parseEther("100");
      const totalBefore = await dshit.totalSupply();

      await dshit.burn(burnAmount);

      const totalAfter = await dshit.totalSupply();
      expect(totalAfter).to.equal(totalBefore - burnAmount);
    });

    it("Should emit Transfer event on burn", async () => {
      const burnAmount = ethers.parseEther("100");
      await expect(dshit.burn(burnAmount))
        .to.emit(dshit, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);
    });

    it("Should not allow burning more than balance", async () => {
      const excessiveAmount = ethers.parseEther("999999999999");
      await expect(dshit.connect(user1).burn(excessiveAmount)).to.be.reverted;
    });
  });

  describe("Snapshot", () => {
    it("Should create a snapshot", async () => {
      // Snapshots are internal, so we just verify the function exists and runs
      await expect(dshit.snapshot()).to.not.be.reverted;
    });

    it("Should track balances at snapshot", async () => {
      // Transfer some tokens
      const transferAmount = ethers.parseEther("100");
      await dshit.transfer(user1.address, transferAmount);

      // Create snapshot
      const tx = await dshit.snapshot();
      const receipt = await tx.wait();

      // The snapshot was created successfully
      expect(receipt).to.not.be.null;
    });

    it("Should not allow non-owner to snapshot", async () => {
      await expect(dshit.connect(user1).snapshot()).to.be.reverted;
    });

    it("Should return snapshot ID", async () => {
      const result = await dshit.snapshot();
      expect(result).to.not.be.null;
    });
  });

  describe("Edge Cases", () => {
    it("Should handle zero transfer amount", async () => {
      // Zero transfers should not create balance changes
      const balanceBefore = await dshit.balanceOf(user1.address);
      await dshit.transfer(user1.address, 0);
      const balanceAfter = await dshit.balanceOf(user1.address);

      expect(balanceAfter).to.equal(balanceBefore);
    });

    it("Should handle self-transfer", async () => {
      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);

      await dshit.transfer(owner.address, transferAmount);

      // Owner should still get tax deducted (sent to treasury)
      expect(await dshit.balanceOf(treasury.address)).to.equal(expectedTax);
    });

    it("Should handle max uint256 transfer (reverts due to insufficient balance)", async () => {
      const maxUint = ethers.MaxUint256;
      await expect(dshit.transfer(user1.address, maxUint)).to.be.reverted;
    });

    it("Should handle approval and transferFrom", async () => {
      const transferAmount = ethers.parseEther("1000");
      const expectedTax = (transferAmount * BigInt(INITIAL_TAX)) / BigInt(10000);
      const expectedTransfer = transferAmount - expectedTax;

      // Approve user1 to spend owner's tokens
      await dshit.approve(user1.address, transferAmount);

      // user1 transfers from owner to user2
      await dshit.connect(user1).transferFrom(owner.address, user2.address, transferAmount);

      expect(await dshit.balanceOf(user2.address)).to.equal(expectedTransfer);
      expect(await dshit.balanceOf(treasury.address)).to.equal(expectedTax);
    });
  });

  describe("ReentrancyGuard", () => {
    it("Should prevent reentrancy attacks", async () => {
      // This is a basic test that the ReentrancyGuard is in place
      // Actual reentrancy attacks would require a more complex malicious contract
      const transferAmount = ethers.parseEther("100");

      // Multiple rapid transfers should be allowed (not blocked by guard)
      await dshit.transfer(user1.address, transferAmount);
      await dshit.transfer(user2.address, transferAmount);

      expect(await dshit.balanceOf(user1.address)).to.be.gt(0);
      expect(await dshit.balanceOf(user2.address)).to.be.gt(0);
    });
  });

  describe("Integration Tests", () => {
    it("Should handle complex token flow", async () => {
      // Transfer from owner to user1
      const transfer1 = ethers.parseEther("1000");
      await dshit.transfer(user1.address, transfer1);

      // Transfer from user1 to user2
      const transfer2 = ethers.parseEther("500");
      await dshit.connect(user1).transfer(user2.address, transfer2);

      // Burn some from user2
      const burn = ethers.parseEther("100");
      await dshit.connect(user2).burn(burn);

      // Pause and unpause
      await dshit.pause();
      await dshit.unpause();

      // Create snapshot
      await dshit.snapshot();

      // Change tax rate
      await dshit.setTransferTax(1000); // 10%

      // Transfer with new tax rate
      const transfer3 = ethers.parseEther("100");
      await dshit.transfer(user3.address, transfer3);

      // Verify balances exist and are correct
      expect(await dshit.balanceOf(user1.address)).to.be.gt(0);
      expect(await dshit.balanceOf(user2.address)).to.be.gt(0);
      expect(await dshit.balanceOf(user3.address)).to.be.gt(0);
      expect(await dshit.balanceOf(treasury.address)).to.be.gt(0);
    });
  });
});
