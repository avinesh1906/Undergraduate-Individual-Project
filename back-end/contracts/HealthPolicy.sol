// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthPolicy {
    uint256 healthContractId = 1;

    struct HealthContract {
        uint healthcontractID;
        uint coverageLimit;
        uint premium;
        string coverageType;
    }

    HealthContract[] public healthContracts;
    // mapping(uint256 => HealthContract) public healthContracts;
    mapping(string => uint256) public coverageTypeByHealthContract;
    address insuranceCompanyAddress;

    // Events
    event NewPolicy(uint256 healthContractId);
    

    // Modifier to ensure only the contract owner can execute the function
    modifier onlyInsurance {
        require(msg.sender == insuranceCompanyAddress, "Only the insurance can execute this function.");
        _;
    }

    // Functions
     function setInsuranceCompanyAddress(address _insuranceCompanyAddress) public {
        require(insuranceCompanyAddress == address(0), "Insurance company address has already been set.");
        insuranceCompanyAddress = _insuranceCompanyAddress;
    }
    
    function getHealthContract(uint256 _healthContractId) public view returns (HealthContract memory) {
        return healthContracts[_healthContractId];
    }

    // Function to upload the health insurance policy
    function uploadPolicy(string memory _coverageType, uint _coverageLimit, uint _premium) public  onlyInsurance {
        require(coverageTypeByHealthContract[_coverageType] == 0, "Coverage already exits");

        // Assign the policy information
        uint256 policyId = healthContractId++;
        healthContracts[policyId].coverageLimit = _coverageLimit;
        healthContracts[policyId].coverageType = _coverageType;
        healthContracts[policyId].premium = _premium;

        emit NewPolicy(policyId);
    }

    function getAllHealthContracts() public view returns (HealthContract[] memory) {
        return healthContracts;
    }
}
