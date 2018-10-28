import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ethers from 'ethers';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import Doppelganger from 'ethereum-doppelganger';
import IERC20 from '../../build/IERC20';
import AmIRichAlready from '../../build/AmIRichAlready';

chai.use(chaiAsPromised);

describe('Am I Rich Already?', () => {
  let provider;
  let deployer;
  let subject;
  let contract;
  let doppelganger;

  before(async () => {
    provider = createMockProvider();
    [deployer, subject] = await getWallets(provider);
  });

  beforeEach(async () => {
    doppelganger = new Doppelganger(JSON.parse(IERC20.interface));
    await doppelganger.deploy(deployer);
    contract = await deployContract(deployer, AmIRichAlready, [doppelganger.address, subject.address]);
  });

  describe('check method', () => {
    it('returns false if the wallet has less then 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('999999'));
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns false if the wallet has exactly 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('1000000'));
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns true if the wallet has more then 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('1000001'));
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(true);
    });
  });
});
