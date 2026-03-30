import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('DSHIT Token', function () {
  it('Should deploy with correct name and symbol', async function () {
    const DSHIT = await ethers.getContractFactory('DSHIT');
    const dshit = await DSHIT.deploy();
    await dshit.waitForDeployment();

    expect(await dshit.name()).to.equal('DSHIT');
    expect(await dshit.symbol()).to.equal('DSHIT');
    expect(await dshit.decimals()).to.equal(18);
  });
});
