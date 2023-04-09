// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthPolicy {
    uint256 healthContractId = 1;

    struct HealthContract {
        uint256 healthcontractID;
        uint32 coverageLimit;
        uint32 premium;
        string coverageType;
        uint32 dental;
        uint32 eyeCare;
        uint32 generalCare;
        bool approval;
    }

    HealthContract[] public healthContracts;
    // mapping(uint256 => HealthContract) public healthContracts;
    mapping(string => bool) public iscoverageTypeExists;
    address insuranceCompanyAddress;

    // Events
    event NewPolicy(uint256 healthContractId);
    event InsuranceAddressSetup(address);

    // Modifier to ensure only the contract owner can execute the function
    modifier onlyInsurance {
        require(msg.sender == insuranceCompanyAddress, "Only the insurance can execute this function.");
        _;
    }

    // Functions
    function setInsuranceCompanyAddress() public {
        require(insuranceCompanyAddress == address(0), "Insurance company address has already been set.");
        insuranceCompanyAddress = msg.sender;
        emit InsuranceAddressSetup(insuranceCompanyAddress);
    }
    
    function getInsuranceCompanyAddress() public view returns (address){
        return insuranceCompanyAddress;
    }
    
    function getHealthContract(uint256 _healthContractId) public view returns (HealthContract memory) {
        for (uint256 i = 0; i < healthContracts.length; i++) {
            if (healthContracts[i].healthcontractID == _healthContractId) {
                return healthContracts[i];
            }
        }
        return HealthContract(0,0,0,"empty",0,0,0,false);
    }

    // Function to upload the health insurance policy
    function uploadPolicy(string memory _coverageType, uint32 _coverageLimit, uint32 _premium) public  onlyInsurance {
        require(!iscoverageTypeExists[_coverageType], "Coverage already exits");

        HealthContract memory newHealthContract;
        // Assign the policy information
        uint256 policyId = healthContractId++;
        newHealthContract.healthcontractID = policyId;
        newHealthContract.coverageLimit = _coverageLimit;
        newHealthContract.coverageType = _coverageType;
        newHealthContract.premium = _premium;

        iscoverageTypeExists[_coverageType] = true;

        healthContracts.push(newHealthContract);
        emit NewPolicy(policyId);
    }

    function getAllHealthContracts() public view returns (HealthContract[] memory) {
        return healthContracts;
    }
}
