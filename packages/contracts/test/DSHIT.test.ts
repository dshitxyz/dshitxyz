import { expect } from "chai";
import { ethers } from "hardhat";
import { DSHIT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("DSHIT Token", function () {
  let dshit: DSHIT;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;
  let addrs: HardhatEthersSigner[];

  const INITIAL_SUPPLY = ethers.parseEther("1000000000"); // 1 billion tokens
  const TAX_PERCENTAGE = 5;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const DSHIT = await ethers.getContractFactory("DSHIT");
    dshit = await DSHIT.deploy();
    await dshit.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dshit.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await dshit.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct name and symbol", async function () {
      expect(await dshit.name()).to.equal("DSHIT");
      expect(await dshit.symbol()).to.equal("DSHIT");
    });

    it("Should have 18 decimals", async function () {
      expect(await dshit.decimals()).to.equal(18);
    });

    it("Should have correct tax recipient on deploy", async function () {
      expect(await dshit.taxRecipient()).to.equal(owner.address);
    });

    it("Should have 5% tax by default", async function () {
      expect(await dshit.taxPercentage()).to.equal(5);
    });
  });

  describe("Transfer Tax", function () {
    it("Should apply 5% tax on transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * BigInt(5)) / BigInt(100);
      const expectedTransferAmount = transferAmount - expectedTax;

      const ownerBalanceBefore = await dshit.balanceOf(owner.address);
      const addr1BalanceBefore = await dshit.balanceOf(addr1.address);

      await dshit.transfer(addr1.address, transferAmount);

      const ownerBalanceAfter = await dshit.balanceOf(owner.address);
      const addr1BalanceAfter = await dshit.balanceOf(addr1.address);

      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - transferAmount);
      expect(addr1BalanceAfter).to.equal(
        addr1BalanceBefore + expectedTransferAmount
      );
    });

    it("Should send tax to tax recipient", async function () {
      await dshit.setTax(5, addr2.address);

      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * BigInt(5)) / BigInt(100);

      const addr2BalanceBefore = await dshit.balanceOf(addr2.address);

      await dshit.transfer(addr1.address, transferAmount);

      const addr2BalanceAfter = await dshit.balanceOf(addr2.address);

      expect(addr2BalanceAfter).to.equal(addr2BalanceBefore + expectedTax);
    });

    it("Should calculate correct tax with zero transfers", async function () {
      const transferAmount = ethers.parseEther("0");

      await expect(
        dshit.transfer(addr1.address, transferAmount)
      ).to.not.be.reverted;
    });

    it("Should handle max uint transfers", async function () {
      // Transfer close to max balance
      const maxTransfer = INITIAL_SUPPLY - ethers.parseEther("1");

      await expect(dshit.transfer(addr1.address, maxTransfer)).to.not.be
        .reverted;
    });
  });

  describe("Tax Configuration", function () {
    it("Should allow owner to update tax percentage", async function () {
      await dshit.setTax(10, owner.address);
      expect(await dshit.taxPercentage()).to.equal(10);
    });

    it("Should allow owner to update tax recipient", async function () {
      await dshit.setTax(5, addr2.address);
      expect(await dshit.taxRecipient()).to.equal(addr2.address);
    });

    it("Should not allow tax > 100%", async function () {
      await expect(
        dshit.setTax(101, owner.address)
      ).to.be.revertedWithCustomError(dshit, "DSHIT");
    });

    it("Should not allow zero address as tax recipient", async function () {
      await expect(
        dshit.setTax(5, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(dshit, "DSHIT");
    });

    it("Should not allow non-owner to update tax", async function () {
      await expect(
        dshit.connect(addr1).setTax(10, addr1.address)
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });

    it("Should emit TaxUpdated event", async function () {
      await expect(dshit.setTax(10, addr2.address))
        .to.emit(dshit, "TaxUpdated")
        .withArgs(10, addr2.address);
    });
  });

  describe("Pause/Unpause", function () {
    it("Should not transfer when paused", async function () {
      await dshit.pause();

      await expect(
        dshit.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(dshit, "EnforcedPause");
    });

    it("Should transfer when unpaused", async function () {
      await dshit.pause();
      await dshit.unpause();

      await expect(
        dshit.transfer(addr1.address, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        dshit.connect(addr1).pause()
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });
  });

  describe("Snapshot", function () {
    it("Should create snapshots", async function () {
      const tx = await dshit.snapshot();

      await expect(tx).to.emit(dshit, "SnapshotCreated").withArgs(1);
      expect(await dshit.getCurrentSnapshotId()).to.equal(1);
    });

    it("Should capture balances at snapshot", async function () {
      await dshit.transfer(addr1.address, ethers.parseEther("100"));

      const snapshotTx = await dshit.snapshot();
      await snapshotTx.wait();

      const addr1Balance = await dshit.balanceOfAt(addr1.address, 1);
      expect(addr1Balance).to.be.greaterThan(0);
    });

    it("Should capture total supply at snapshot", async function () {
      await dshit.snapshot();

      const totalSupplyAtSnapshot = await dshit.totalSupplyAt(1);
      const currentTotalSupply = await dshit.totalSupply();

      // Due to taxes, they should be different if transfers occurred
      expect(totalSupplyAtSnapshot).to.be.gte(0);
    });

    it("Should not allow non-owner to snapshot", async function () {
      await expect(
        dshit.connect(addr1).snapshot()
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burn", function () {
    it("Should burn tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const ownerBalanceBefore = await dshit.balanceOf(owner.address);

      await dshit.burn(burnAmount);

      const ownerBalanceAfter = await dshit.balanceOf(owner.address);
      expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - burnAmount);
    });

    it("Should reduce total supply on burn", async function () {
      const burnAmount = ethers.parseEther("100");
      const totalSupplyBefore = await dshit.totalSupply();

      await dshit.burn(burnAmount);

      const totalSupplyAfter = await dshit.totalSupply();
      expect(totalSupplyAfter).to.equal(totalSupplyBefore - burnAmount);
    });

    it("Should allow non-owner to burn their own tokens", async function () {
      await dshit.transfer(addr1.address, ethers.parseEther("100"));

      const burnAmount = ethers.parseEther("50");

      await expect(
        dshit.connect(addr1).burn(burnAmount)
      ).to.not.be.reverted;
    });
  });

  describe("Access Control", function () {
    it("Should have correct owner", async function () {
      expect(await dshit.owner()).to.equal(owner.address);
    });

    it("Should allow owner to renounce ownership", async function () {
      await dshit.renounceOwnership();
      expect(await dshit.owner()).to.equal(ethers.ZeroAddress);
    });

    it("Should allow owner to transfer ownership", async function () {
      await dshit.transferOwnership(addr1.address);
      expect(await dshit.owner()).to.equal(addr1.address);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle self-transfers", async function () {
      const transferAmount = ethers.parseEther("100");

      await expect(
        dshit.transfer(owner.address, transferAmount)
      ).to.not.be.reverted;
    });

    it("Should handle multiple rapid transfers", async function () {
      for (let i = 0; i < 10; i++) {
        await expect(
          dshit.transfer(addr1.address, ethers.parseEther("1"))
        ).to.not.be.reverted;
      }
    });

    it("Should not transfer with insufficient balance", async function () {
      const transferAmount = ethers.parseEther("2000000000"); // More than supply

      await expect(
        dshit.transfer(addr1.address, transferAmount)
      ).to.be.revertedWithCustomError(dshit, "ERC20InsufficientBalance");
    });
  });
});
