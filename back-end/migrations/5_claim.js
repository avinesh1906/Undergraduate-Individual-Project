const Claim = artifacts.require("./Claim.sol");

module.exports = function(deployer) {
    deployer.deploy(Claim);
}