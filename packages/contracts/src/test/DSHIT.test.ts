import { expect } from "chai";
import { ethers } from "hardhat";
import { DSHIT } from "../typechain-types";

describe("DSHIT Token", function () {
  let dshit: DSHIT;
  let owner: any;
  let taxRecipient: any;
  let addr1: any;
  let addr2: any;

  const MAX_SUPPLY = ethers.parseEther("1000000000");
  const INITIAL_TRANSFER = ethers.parseEther("1000");

  beforeEach(async function () {
    [owner, taxRecipient, addr1, addr2] = await ethers.getSigners();

    const DSHIT = await ethers.getContractFactory("DSHIT");
    dshit = await DSHIT.deploy(taxRecipient.address);
    await dshit.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial supply", async function () {
      const totalSupply = await dshit.totalSupply();
      expect(totalSupply).to.equal(MAX_SUPPLY);
    });

    it("Should assign initial supply to owner", async function () {
      const balance = await dshit.balanceOf(owner.address);
      expect(balance).to.equal(MAX_SUPPLY);
    });

    it("Should have correct name and symbol", async function () {
      expect(await dshit.name()).to.equal("DSHIT");
      expect(await dshit.symbol()).to.equal("DSHIT");
    });

    it("Should set tax recipient correctly", async function () {
      expect(await dshit.taxRecipient()).to.equal(taxRecipient.address);
    });

    it("Should have default 5% transfer tax", async function () {
      expect(await dshit.transferTaxPercent()).to.equal(5);
    });
  });

  describe("Transfer", function () {
    it("Should transfer tokens without tax to tax recipient", async function () {
      await dshit.transfer(taxRecipient.address, INITIAL_TRANSFER);
      const balance = await dshit.balanceOf(taxRecipient.address);
      expect(balance).to.equal(INITIAL_TRANSFER);
    });

    it("Should apply tax on regular transfers", async function () {
      await dshit.transfer(addr1.address, INITIAL_TRANSFER);

      const transferAmount = ethers.parseEther("100");
      const expectedTax = (transferAmount * 5n) / 100n;
      const expectedReceived = transferAmount - expectedTax;

      await dshit.connect(addr1).transfer(addr2.address, transferAmount);

      const addr2Balance = await dshit.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(expectedReceived);

      const taxRecipientBalance = await dshit.balanceOf(taxRecipient.address);
      expect(taxRecipientBalance).to.equal(expectedTax);
    });

    it("Should fail when paused", async function () {
      await dshit.pause();
      await expect(
        dshit.transfer(addr1.address, INITIAL_TRANSFER)
      ).to.be.revertedWithCustomError(dshit, "EnforcedPause");
    });
  });

  describe("Tax Management", function () {
    it("Should allow owner to change transfer tax", async function () {
      await dshit.setTransferTaxPercent(10);
      expect(await dshit.transferTaxPercent()).to.equal(10);
    });

    it("Should reject tax percent > 100", async function () {
      await expect(dshit.setTransferTaxPercent(101)).to.be.revertedWith(
        "Tax percent too high"
      );
    });

    it("Should allow owner to change tax recipient", async function () {
      await dshit.setTaxRecipient(addr1.address);
      expect(await dshit.taxRecipient()).to.equal(addr1.address);
    });

    it("Should reject zero address as tax recipient", async function () {
      await expect(
        dshit.setTaxRecipient(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid tax recipient");
    });
  });

  describe("Pause/Unpause", function () {
    it("Should allow owner to pause", async function () {
      await dshit.pause();
      expect(await dshit.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await dshit.pause();
      await dshit.unpause();
      expect(await dshit.paused()).to.be.false;
    });
  });

  describe("Burn", function () {
    it("Should allow burning tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialSupply = await dshit.totalSupply();

      await dshit.burn(burnAmount);

      const newSupply = await dshit.totalSupply();
      expect(newSupply).to.equal(initialSupply - burnAmount);
    });
  });

});
