const HealthPolicy = artifacts.require("./HealthPolicy.sol");

module.exports = function(deployer) {
    deployer.deploy(HealthPolicy);
}