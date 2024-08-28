const HealthOrganization = artifacts.require("./HealthOrganization.sol");

module.exports = function(deployer) {
    deployer.deploy(HealthOrganization);
}