const Claim = artifacts.require("./ClaimContract.sol");

module.exports = function(deployer) {
    deployer.deploy(Claim);
}