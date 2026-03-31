import { expect } from "chai";
import hre from "hardhat";
import { DSHIT } from "../typechain-types";

describe("DSHIT Token", () => {
  let token: DSHIT;
  let owner: any;
  let treasury: any;
  let user1: any;

  beforeEach(async () => {
    [owner, treasury, user1] = await hre.ethers.getSigners();
    const DSHIT = await hre.ethers.getContractFactory("DSHIT");
    token = await DSHIT.deploy(treasury.address);
    await token.waitForDeployment();
  });

  describe("Deployment", () => {
    it("Should have correct initial supply", async () => {
      const supply = await token.totalSupply();
      expect(supply).to.equal(hre.ethers.parseEther("1000000000"));
    });

    it("Should have owner set correctly", async () => {
      const contractOwner = await token.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("Should have treasury address set", async () => {
      const treasuryAddr = await token.treasuryAddress();
      expect(treasuryAddr).to.equal(treasury.address);
    });
  });

  describe("Transfer Tax", () => {
    it("Should apply 5% tax on transfers", async () => {
      const transferAmount = hre.ethers.parseEther("100");
      const tax = (transferAmount * BigInt(5)) / BigInt(100);

      await token.transfer(user1.address, transferAmount);

      const userBalance = await token.balanceOf(user1.address);
      const treasuryBalance = await token.balanceOf(treasury.address);

      expect(userBalance).to.equal(transferAmount - tax);
      expect(treasuryBalance).to.equal(tax);
    });
  });

  describe("Pause Functionality", () => {
    it("Should pause transfers", async () => {
      await token.pause();
      const transferAmount = hre.ethers.parseEther("100");

      await expect(token.transfer(user1.address, transferAmount)).to.be.revertedWithCustomError(
        token,
        "EnforcedPause"
      );
    });

    it("Should allow transfers after unpause", async () => {
      await token.pause();
      await token.unpause();
      const transferAmount = hre.ethers.parseEther("100");

      await expect(token.transfer(user1.address, transferAmount)).to.not.be.reverted;
    });
  });
});
