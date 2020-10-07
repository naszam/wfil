var WFIL = artifacts.require("WFIL");
const kovan = require('./kovan');

module.exports = function(deployer) {

	deployer.deploy(WFIL, kovan.wfil.feeTo);
};
