import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DSHIT Token', () => {
  it('Should deploy successfully', async () => {
    const DSHIT = await ethers.getContractFactory('DSHIT');
    const token = await DSHIT.deploy();
    await token.deployed();

    expect(token.address).to.not.equal(ethers.ZeroAddress);
  });

  it('Should have correct initial supply', async () => {
    const DSHIT = await ethers.getContractFactory('DSHIT');
    const token = await DSHIT.deploy();
    await token.deployed();

    const totalSupply = await token.totalSupply();
    const expectedSupply = ethers.parseUnits('1000000000', 18); // 1 billion tokens

    expect(totalSupply).to.equal(expectedSupply);
  });
});
