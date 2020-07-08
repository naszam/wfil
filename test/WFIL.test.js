// test/WFIL.test.js

const { accounts, contract } = require('@openzeppelin/test-environment');

const WFIL = contract.fromArtifact('WFIL');

let wfil;

describe('WFIL', function () {
const [owner] = accounts;

  beforeEach(async function () {
    wfil = await WFIL.new({ from: owner })
  });


  it('the deployer is the owner', async function () {
    expect(await wfil.owner({from: owner})).toEqual(owner);
  });

});
