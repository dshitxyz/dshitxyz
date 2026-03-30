import { expect } from "chai";
import hre from "hardhat";

describe("DSHIT Token", function () {
  let token: any;
  let owner: any;
  let taxRecipient: any;
  let user1: any;
  let user2: any;

  const INITIAL_SUPPLY = 1_000_000_000n * 10n ** 18n;
  const TAX_PERCENTAGE = 5n;
  const PERCENTAGE_DENOMINATOR = 100n;

  beforeEach(async function () {
    [owner, taxRecipient, user1, user2] = await hre.ethers.getSigners();

    const DSHIT = await hre.ethers.getContractFactory("DSHIT");
    token = await DSHIT.deploy(taxRecipient.address);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial supply", async function () {
      const balance = await token.balanceOf(owner.address);
      expect(balance).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("DSHIT");
      expect(await token.symbol()).to.equal("DSHIT");
    });

    it("Should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("Should set tax recipient correctly", async function () {
      expect(await token.taxRecipient()).to.equal(taxRecipient.address);
    });
  });

  describe("Transfer with Tax", function () {
    it("Should apply 5% tax on transfer", async function () {
      const transferAmount = 100n * 10n ** 18n;
      const taxAmount = (transferAmount * TAX_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
      const userAmount = transferAmount - taxAmount;

      await token.transfer(user1.address, transferAmount);

      expect(await token.balanceOf(user1.address)).to.equal(userAmount);
      expect(await token.balanceOf(taxRecipient.address)).to.equal(taxAmount);
    });

    it("Should transfer correct amounts after multiple transfers", async function () {
      const amount1 = 1000n * 10n ** 18n;
      const amount2 = 500n * 10n ** 18n;

      await token.transfer(user1.address, amount1);
      const _balance1 = await token.balanceOf(user1.address);

      await token.transfer(user2.address, amount2);
      const user2Balance = await token.balanceOf(user2.address);
      const tax2 = (amount2 * TAX_PERCENTAGE) / PERCENTAGE_DENOMINATOR;

      expect(user2Balance).to.equal(amount2 - tax2);
    });

    it("Should not apply tax on mint", async function () {
      const currentSupply = await token.totalSupply();
      expect(currentSupply).to.equal(INITIAL_SUPPLY);
    });

    it("Should handle zero transfers", async function () {
      const balanceBefore = await token.balanceOf(user1.address);
      await token.transfer(user1.address, 0n);
      const balanceAfter = await token.balanceOf(user1.address);
      expect(balanceBefore).to.equal(balanceAfter);
    });
  });


  describe("Burn", function () {
    it("Should burn tokens", async function () {
      const burnAmount = 100n * 10n ** 18n;
      const balanceBefore = await token.balanceOf(owner.address);

      await token.burn(burnAmount);

      const balanceAfter = await token.balanceOf(owner.address);
      expect(balanceAfter).to.equal(balanceBefore - burnAmount);
    });

    it("Should burn from approved account", async function () {
      const burnAmount = 100n * 10n ** 18n;

      await token.approve(user1.address, burnAmount);
      await token.connect(user1).burnFrom(owner.address, burnAmount);

      const balance = await token.balanceOf(owner.address);
      expect(balance).to.equal(INITIAL_SUPPLY - burnAmount);
    });
  });

  describe("Tax Recipient", function () {
    it("Should update tax recipient", async function () {
      await token.setTaxRecipient(user1.address);
      expect(await token.taxRecipient()).to.equal(user1.address);
    });

    it("Only owner can set tax recipient", async function () {
      await expect(
        token.connect(user1).setTaxRecipient(user2.address)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should not allow zero address as tax recipient", async function () {
      await expect(token.setTaxRecipient(hre.ethers.ZeroAddress)).to.be.revertedWith(
        "Tax recipient cannot be zero address"
      );
    });
  });

  describe("Approvals", function () {
    it("Should approve and transfer tokens", async function () {
      const approveAmount = 1000n * 10n ** 18n;
      await token.approve(user1.address, approveAmount);

      const allowance = await token.allowance(owner.address, user1.address);
      expect(allowance).to.equal(approveAmount);
    });

    it("Should allow approved transfer", async function () {
      const amount = 500n * 10n ** 18n;
      await token.approve(user1.address, amount);

      await token.connect(user1).transferFrom(owner.address, user2.address, amount);

      const tax = (amount * TAX_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
      expect(await token.balanceOf(user2.address)).to.equal(amount - tax);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle max uint transfer correctly", async function () {
      const maxAmount = (INITIAL_SUPPLY * BigInt(99)) / BigInt(100);
      await token.transfer(user1.address, maxAmount);

      const balance = await token.balanceOf(user1.address);
      expect(balance).to.be.gt(0n);
    });

    it("Should handle self-transfers with tax", async function () {
      const amount = 100n * 10n ** 18n;
      const balanceBefore = await token.balanceOf(owner.address);

      await token.transfer(owner.address, amount);

      // Self-transfer still deducts tax (goes to tax recipient)
      const tax = (amount * TAX_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
      const expectedBalance = balanceBefore - tax;
      expect(await token.balanceOf(owner.address)).to.equal(expectedBalance);
    });
  });
});
