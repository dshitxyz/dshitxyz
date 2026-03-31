import { expect } from "chai";
import { ethers } from "hardhat";
import { DSHIT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("DSHIT Token", function () {
  let dshit: DSHIT;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  const INITIAL_SUPPLY = ethers.parseEther("1000000000"); // 1 billion
  const TAX_DENOMINATOR = 10000n;
  const DEFAULT_TAX_RATE = 500n; // 5%

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const DSHITFactory = await ethers.getContractFactory("DSHIT");
    dshit = (await DSHITFactory.deploy()) as DSHIT;
    await dshit.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right initial supply", async function () {
      const balance = await dshit.balanceOf(owner.address);
      expect(balance).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct token name and symbol", async function () {
      expect(await dshit.name()).to.equal("DSHIT");
      expect(await dshit.symbol()).to.equal("DSHIT");
    });

    it("Should have correct decimals", async function () {
      expect(await dshit.decimals()).to.equal(18);
    });

    it("Should set owner correctly", async function () {
      expect(await dshit.owner()).to.equal(owner.address);
    });

    it("Should set tax recipient to owner", async function () {
      expect(await dshit.taxRecipient()).to.equal(owner.address);
    });

    it("Should have default tax rate of 5%", async function () {
      expect(await dshit.taxRate()).to.equal(DEFAULT_TAX_RATE);
    });
  });

  describe("Transfer Tax", function () {
    it("Should apply 5% tax on transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * DEFAULT_TAX_RATE) / TAX_DENOMINATOR;
      const expectedAfterTax = transferAmount - expectedTax;

      await dshit.transfer(addr1.address, transferAmount);

      // addr1 should receive amount - tax
      expect(await dshit.balanceOf(addr1.address)).to.equal(expectedAfterTax);
      // owner (tax recipient) should receive initial supply + tax
      expect(await dshit.balanceOf(owner.address)).to.be.gte(expectedTax);
    });

    it("Should calculate correct tax for different amounts", async function () {
      const amount1 = ethers.parseEther("1000");
      const tax1 = (amount1 * DEFAULT_TAX_RATE) / TAX_DENOMINATOR;

      await dshit.transfer(addr1.address, amount1);
      const addr1Balance = await dshit.balanceOf(addr1.address);

      expect(addr1Balance).to.equal(amount1 - tax1);
    });

    it("Should not apply tax on zero amount", async function () {
      const ownerBalanceBefore = await dshit.balanceOf(owner.address);
      await dshit.transfer(addr1.address, 0);
      const ownerBalanceAfter = await dshit.balanceOf(owner.address);

      expect(ownerBalanceBefore).to.equal(ownerBalanceAfter);
    });
  });

  describe("Tax Configuration", function () {
    it("Should allow owner to change tax rate", async function () {
      const newRate = 1000n; // 10%
      await dshit.setTaxRate(newRate);
      expect(await dshit.taxRate()).to.equal(newRate);
    });

    it("Should emit TaxRateUpdated event", async function () {
      const newRate = 1000n;
      await expect(dshit.setTaxRate(newRate))
        .to.emit(dshit, "TaxRateUpdated")
        .withArgs(DEFAULT_TAX_RATE, newRate);
    });

    it("Should not allow tax rate > 20%", async function () {
      const excessiveRate = 2001n;
      await expect(dshit.setTaxRate(excessiveRate)).to.be.revertedWith(
        "Tax rate cannot exceed 20%"
      );
    });

    it("Should allow owner to change tax recipient", async function () {
      await dshit.setTaxRecipient(addr1.address);
      expect(await dshit.taxRecipient()).to.equal(addr1.address);
    });

    it("Should emit TaxRecipientUpdated event", async function () {
      await expect(dshit.setTaxRecipient(addr1.address))
        .to.emit(dshit, "TaxRecipientUpdated")
        .withArgs(owner.address, addr1.address);
    });

    it("Should not allow zero address as tax recipient", async function () {
      await expect(dshit.setTaxRecipient(ethers.ZeroAddress)).to.be.revertedWith(
        "Tax recipient cannot be zero address"
      );
    });

    it("Should not allow non-owner to change tax rate", async function () {
      await expect(
        dshit.connect(addr1).setTaxRate(1000n)
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });

    it("Should not allow non-owner to change tax recipient", async function () {
      await expect(
        dshit.connect(addr1).setTaxRecipient(addr2.address)
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should pause transfers", async function () {
      await dshit.pause();
      const amount = ethers.parseEther("10");
      await expect(dshit.transfer(addr1.address, amount)).to.be.revertedWithCustomError(
        dshit,
        "EnforcedPause"
      );
    });

    it("Should unpause transfers", async function () {
      await dshit.pause();
      await dshit.unpause();
      const amount = ethers.parseEther("10");
      await expect(dshit.transfer(addr1.address, amount)).to.not.be.reverted;
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(dshit.connect(addr1).pause()).to.be.revertedWithCustomError(
        dshit,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should not allow non-owner to unpause", async function () {
      await dshit.pause();
      await expect(dshit.connect(addr1).unpause()).to.be.revertedWithCustomError(
        dshit,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Burning", function () {
    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const balanceBefore = await dshit.balanceOf(owner.address);

      await dshit.burn(burnAmount);

      const balanceAfter = await dshit.balanceOf(owner.address);
      expect(balanceBefore - balanceAfter).to.equal(burnAmount);
    });

    it("Should reduce total supply on burn", async function () {
      const totalBefore = await dshit.totalSupply();
      const burnAmount = ethers.parseEther("100");

      await dshit.burn(burnAmount);

      const totalAfter = await dshit.totalSupply();
      expect(totalBefore - totalAfter).to.equal(burnAmount);
    });

    it("Should allow burning from approval", async function () {
      const burnAmount = ethers.parseEther("100");

      // Transfer some to addr1
      await dshit.transfer(addr1.address, ethers.parseEther("500"));

      // addr1 approves owner to burn
      await dshit.connect(addr1).approve(owner.address, burnAmount);

      // owner burns from addr1
      const balanceBefore = await dshit.balanceOf(addr1.address);
      await dshit.burnFrom(addr1.address, burnAmount);
      const balanceAfter = await dshit.balanceOf(addr1.address);

      expect(balanceBefore - balanceAfter).to.be.gte(burnAmount);
    });
  });


  describe("Access Control", function () {
    it("Should allow only owner to pause", async function () {
      await expect(dshit.connect(addr1).pause()).to.be.revertedWithCustomError(
        dshit,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should allow only owner to unpause", async function () {
      await dshit.pause();
      await expect(dshit.connect(addr1).unpause()).to.be.revertedWithCustomError(
        dshit,
        "OwnableUnauthorizedAccount"
      );
    });


    it("Should allow only owner to set tax rate", async function () {
      await expect(dshit.connect(addr1).setTaxRate(1000n)).to.be.revertedWithCustomError(
        dshit,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should allow only owner to set tax recipient", async function () {
      await expect(
        dshit.connect(addr1).setTaxRecipient(addr2.address)
      ).to.be.revertedWithCustomError(dshit, "OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle transfer to self", async function () {
      const amount = ethers.parseEther("100");
      const balanceBefore = await dshit.balanceOf(owner.address);

      // Transfer to self should apply tax
      await dshit.transfer(owner.address, amount);

      // Balance should be reduced by the tax amount
      const tax = (amount * DEFAULT_TAX_RATE) / TAX_DENOMINATOR;
      const balanceAfter = await dshit.balanceOf(owner.address);
      expect(balanceBefore - balanceAfter).to.equal(tax);
    });

    it("Should handle very large transfers", async function () {
      const largeAmount = ethers.parseEther("999999999"); // Close to max supply
      const tax = (largeAmount * DEFAULT_TAX_RATE) / TAX_DENOMINATOR;

      await dshit.transfer(addr1.address, largeAmount);

      const addr1Balance = await dshit.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(largeAmount - tax);
    });

    it("Should maintain constant total supply (accounting for tax redistribution)", async function () {
      const totalBefore = await dshit.totalSupply();

      // Transfers don't change total supply, just redistribution
      await dshit.transfer(addr1.address, ethers.parseEther("100"));
      await dshit.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));

      const totalAfter = await dshit.totalSupply();
      expect(totalAfter).to.equal(totalBefore);
    });
  });

  describe("Integration", function () {
    it("Should handle multiple transfers with tax accumulation", async function () {
      const amount = ethers.parseEther("100");

      // Transfer 1: owner -> addr1
      await dshit.transfer(addr1.address, amount);

      // Transfer 2: owner -> addr2
      await dshit.transfer(addr2.address, amount);

      const addr1Balance = await dshit.balanceOf(addr1.address);
      const addr2Balance = await dshit.balanceOf(addr2.address);

      expect(addr1Balance).to.be.gt(0);
      expect(addr2Balance).to.be.gt(0);
      expect(addr1Balance).to.be.equal(addr2Balance); // Same amount transferred
    });

    it("Should work with approvals and transfers", async function () {
      const amount = ethers.parseEther("100");

      await dshit.approve(addr1.address, amount);
      await dshit.connect(addr1).transferFrom(owner.address, addr2.address, amount);

      const addr2Balance = await dshit.balanceOf(addr2.address);
      const tax = (amount * DEFAULT_TAX_RATE) / TAX_DENOMINATOR;
      expect(addr2Balance).to.equal(amount - tax);
    });
  });
});
