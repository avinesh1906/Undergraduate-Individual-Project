const Insurance = artifacts.require("./InsuranceProvider.sol");

module.exports = function(deployer) {
    deployer.deploy(Insurance);
}