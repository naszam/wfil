// based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/presets/ERC20PresetMinterPauser.test.js

// test/WFIL.test.js

const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const WFIL = contract.fromArtifact('WFIL');

let wfil;

describe('WFIL', function () {
const [ owner, minter, other ] = accounts;

const name = 'Wrapped Filecoin';
const symbol = 'WFIL';

const amount = new BN('5000');

const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');
const PAUSER_ROLE = web3.utils.soliditySha3('PAUSER_ROLE');

  beforeEach(async function () {
    wfil = await WFIL.new({ from: owner })
  });

  it('the deployer is the owner', async function () {
    expect(await wfil.owner()).to.equal(owner);
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

  it('minter and pauser role admin is the default admin', async function () {
    expect(await wfil.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
    expect(await wfil.getRoleAdmin(PAUSER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
  });

  describe('WFIL metadata', function () {
    it("has a name", async () => {
        expect(await wfil.name({from:other})).to.equal(name)
    })
    it("has a symbol", async () => {
        expect(await wfil.symbol({from:other})).to.equal(symbol)
    })
  });

  describe('minting', function () {
    it('owner can mint tokens', async function () {
      const receipt = await wfil.mint(other, amount, { from: owner });
      expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: other, value: amount });

      expect(await wfil.balanceOf(other)).to.be.bignumber.equal(amount);
    });

    it('other accounts cannot mint tokens', async function () {
      await expectRevert(wfil.mint(other, amount, { from: other }),'Caller is not a minter');
    });
  });

  describe("addMinter()", async () => {

      it("admin should be able to add a new minter", async () => {
        await wfil.addMinter(minter, {from:owner})
        expect(await wfil.getRoleMember(MINTER_ROLE, 1)).to.equal(minter)
      })

      it("should emit the appropriate event when a new minter is added", async () => {
        const receipt = await wfil.addMinter(minter, {from:owner})
        expectEvent(receipt, "RoleGranted", { account: minter })
      })

      it("other address should not be able to add a new minter", async () => {
        await expectRevert(wfil.addMinter(minter, {from:other}), 'Caller is not an admin')
      })
  })

  describe("removeMinter()", async () => {

      beforeEach(async () => {
        await wfil.addMinter(minter, {from: owner})
      })

      it("admin should be able to remove a minter", async () => {
        await wfil.removeMinter(minter, {from:owner})
        expect(await wfil.hasRole(MINTER_ROLE, minter)).to.equal(false)
      })

      it("should emit the appropriate event when a minter is removed", async () => {
        const receipt = await wfil.removeMinter(minter, {from:owner})
        expectEvent(receipt, "RoleRevoked", { account: minter })
      })

      it("other address should not be able to remove a minter", async () => {
        await expectRevert(wfil.removeMinter(minter, {from:other}), 'Caller is not an admin')
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

      it('cannot mint while paused', async function () {
        await wfil.pause({ from: owner });

        await expectRevert(
          wfil.mint(other, amount, { from: owner }),
          'ERC20Pausable: token transfer while paused'
        );
      });

      it('other accounts cannot pause', async function () {
        await expectRevert(wfil.pause({ from: other }), 'WFIL: must have pauser role to pause');
      });
  });

    describe('burning', function () {
      it('holders can burn their tokens', async function () {
        await wfil.mint(other, amount, { from: owner });

        const receipt = await wfil.burn(amount.subn(1), { from: other });
        expectEvent(receipt, 'Transfer', { from: other, to: ZERO_ADDRESS, value: amount.subn(1) });

        expect(await wfil.balanceOf(other)).to.be.bignumber.equal('1');
      });
    });

});
