// based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/presets/ERC20PresetMinterPauser.test.js

// test/WFIL.test.js

const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert, send, ether } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const WFIL = contract.fromArtifact('WFIL');

let wfil;

describe('WFIL', function () {
const [ owner, minter, feeTo, fee_setter, other, feeTo2 ] = accounts;

const name = 'Wrapped Filecoin';
const symbol = 'WFIL';

const filaddress = 't3r65ygzflxsibwkput2c5thotk4qpo4vkz2t5dtg76dhxgotynlb7nbzabt6z2if3xmlfpvu7ujyhfy44qvoq';

const amount = ether('100');
const fee = '5';
const newFee = '6';
const wrapOut = ether('99.5');
const wrapFee = ether('0.5');
const unwrapFee = ether('0.4975');
const unwrapOut = ether('99.0025');
const totFee = ether('0.9975');

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');
const PAUSER_ROLE = web3.utils.soliditySha3('PAUSER_ROLE');
const FEE_SETTER_ROLE = web3.utils.soliditySha3('FEE_SETTER_ROLE');

  beforeEach(async function () {
    wfil = await WFIL.new(feeTo, fee, { from: owner });
  });

  describe('Setup', async function () {

    it('the deployed fee is correct', async function () {
      expect(await wfil.fee()).to.be.bignumber.equal(fee);
    });

    it('owner has the default admin role', async function () {
      expect(await wfil.getRoleMemberCount(DEFAULT_ADMIN_ROLE)).to.be.bignumber.equal('1');
      expect(await wfil.getRoleMember(DEFAULT_ADMIN_ROLE, 0)).to.equal(owner);
    });

    it('owner has the minter role', async function () {
      expect(await wfil.getRoleMemberCount(MINTER_ROLE)).to.be.bignumber.equal('1');
      expect(await wfil.getRoleMember(MINTER_ROLE, 0)).to.equal(owner);
    });

    it('owner has the pauser role', async function () {
      expect(await wfil.getRoleMemberCount(PAUSER_ROLE)).to.be.bignumber.equal('1');
      expect(await wfil.getRoleMember(PAUSER_ROLE, 0)).to.equal(owner);
    });

    it('owner has the fee setter role', async function () {
      expect(await wfil.getRoleMemberCount(FEE_SETTER_ROLE)).to.be.bignumber.equal('1');
      expect(await wfil.getRoleMember(FEE_SETTER_ROLE, 0)).to.equal(owner);
    });

    it('minter, pauser and fee setter role admin is the default admin', async function () {
      expect(await wfil.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
      expect(await wfil.getRoleAdmin(PAUSER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
      expect(await wfil.getRoleAdmin(FEE_SETTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
    });
  });

  // Check Fallback function
  describe('fallback()', async function () {
    it('should revert when sending ether to contract address', async function () {
        await expectRevert.unspecified(send.ether(owner, wfil.address, 1));
    });
  });

  describe('WFIL metadata', function () {
    it('has a name', async () => {
        expect(await wfil.name({from:other})).to.equal(name);
    })
    it('has a symbol', async () => {
        expect(await wfil.symbol({from:other})).to.equal(symbol);
    })
  });

  describe('wrap()', function () {
    it('owner can mint tokens', async function () {
      const receipt = await wfil.wrap(other, amount, { from: owner });
      expect(await wfil.balanceOf(other)).to.be.bignumber.equal(wrapOut);
      expect(await wfil.balanceOf(feeTo)).to.be.bignumber.equal(wrapFee);
    });

    it('should emit the appropriate event when wfil is wrapped', async () => {
      const receipt = await wfil.wrap(other, amount, {from:owner});
      expectEvent(receipt, 'Wrapped', { to: other, wrapOut: wrapOut, wrapFee: wrapFee });
      expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: other, value: wrapOut });
      expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: feeTo, value: wrapFee });
    });

    it('other accounts cannot wrap tokens', async function () {
      await expectRevert(wfil.wrap(other, amount, { from: other }),'WFIL/invalid-minter');
    });
  });

  describe('unwrap()', async () => {
      beforeEach(async () => {
        await wfil.wrap(owner, amount, {from: owner});
      });

      it('wfil owner should be able to burn wfil', async () => {
        await wfil.unwrap(filaddress, wrapOut, {from: owner});
        expect(await wfil.balanceOf(owner)).to.be.bignumber.equal('0');
        expect(await wfil.balanceOf(feeTo)).to.be.bignumber.equal(totFee);
      });

      it('should emit the appropriate event when wfil is unwrapped', async () => {
        const receipt = await wfil.unwrap(filaddress, wrapOut, {from:owner});
        expectEvent(receipt, 'Unwrapped', { filaddress: filaddress, unwrapOut: unwrapOut, unwrapFee: unwrapFee });
        expectEvent(receipt, 'Transfer', { from: owner, to: feeTo, value: unwrapFee });
        expectEvent(receipt, 'Transfer', { from: owner, to: ZERO_ADDRESS, value: unwrapOut });
      });

      it('other accounts cannot unwrap tokens', async function () {
        await expectRevert(wfil.unwrap(filaddress, wrapOut, { from: other }), 'ERC20: transfer amount exceeds balance');
      });
  })

  describe('setFee()', async () => {
      it('fee setter should be able to add a new fee', async () => {
        await wfil.setFee(newFee, {from:owner});
        expect(await wfil.fee()).to.be.bignumber.equal(newFee);
      })

      it('should emit the appropriate event when a new fee is set', async () => {
        const receipt = await wfil.setFee(newFee, {from:owner});
        expectEvent(receipt, 'NewFee', { fee: newFee });
      })

      it('other address should not be able to add a new fee', async () => {
        await expectRevert(wfil.setFee(newFee, {from:other}), 'WFIL/invalid-fee-setter');
      })
  })

  describe('setFeeTo()', async () => {
      it('fee setter should be able to add a new feeTo address', async () => {
        const receipt = await wfil.setFeeTo(feeTo2, {from:owner});
        expectEvent(receipt, 'NewFeeTo', { feeTo: feeTo2 });
      })

      it('other address should not be able to add a new feeTo address', async () => {
        await expectRevert(wfil.setFeeTo(feeTo2, {from:other}), 'WFIL/invalid-fee-setter');
      })

      it('should revert when a zero address is specified', async () => {
        await expectRevert(wfil.setFeeTo(ZERO_ADDRESS, {from:owner}), 'WFIL/invalid-address-0');
      })

      it('should revert when contract address is specified', async () => {
        await expectRevert(wfil.setFeeTo(wfil.address, {from:owner}), 'WFIL/invalid-address-this');
      })
  })

  describe('pausing', function () {
      it('owner can pause', async function () {
        const receipt = await wfil.pause({ from: owner });
        expectEvent(receipt, 'Paused', { account: owner });

        expect(await wfil.paused()).to.equal(true);
      });

      it('owner can unpause', async function () {
        await wfil.pause({ from: owner });

        const receipt = await wfil.unpause({ from: owner });
        expectEvent(receipt, 'Unpaused', { account: owner });

        expect(await wfil.paused()).to.equal(false);
      });

      it('cannot wrap while paused', async function () {
        await wfil.pause({ from: owner });

        await expectRevert(
          wfil.wrap(other, amount, { from: owner }),
          'ERC20Pausable: token transfer while paused'
        );
      });

      it('cannot transfer while paused', async function () {
        await wfil.wrap(owner, amount, {from: owner});
        await wfil.pause({ from: owner });

        await expectRevert(
          wfil.transfer(other, amount, { from: owner }),
          'ERC20Pausable: token transfer while paused'
        );
      });

      it('cannot unwrap while paused', async function () {
        await wfil.wrap(owner, amount, {from: owner});
        await wfil.pause({ from: owner });

        await expectRevert(
          wfil.unwrap(filaddress, amount, { from: owner }),
          'ERC20Pausable: token transfer while paused'
        );
      });

      it('other accounts cannot pause', async function () {
        await expectRevert(wfil.pause({ from: other }), 'WFIL/invalid-pauser');
      });
  });

  // Check override _tranfer() function
  describe('ERC20 override _transfer()', async function () {
      beforeEach(async function () {
        await wfil.wrap(owner, amount, {from: owner});
      });

      it('check transfer() for revert when trying to transfer to the token contract', async function () {
        await expectRevert(wfil.transfer(wfil.address, amount, {from:owner}), 'WFIL/invalid-address-this');
      });

      it('check transferFrom() for revert when trying to transfer to the token contract', async function () {
        await wfil.increaseAllowance(wfil.address, amount, {from: owner});
        await expectRevert(wfil.transferFrom(owner, wfil.address, amount, {from:owner}), 'WFIL/invalid-address-this');
      });
  });
});
