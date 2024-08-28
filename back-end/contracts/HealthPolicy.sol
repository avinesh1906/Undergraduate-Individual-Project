// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthPolicy {
    uint32 healthContractId = 1;

    struct HealthContract {
        uint32 healthcontractID;
        uint32 premium;
        string coverageType;
        uint32 dental;
        uint32 eyeCare;
        uint32 generalCare;
        bool approval;
    }

    HealthContract[] public healthContracts;

    mapping(string => bool) public iscoverageTypeExists;

    address insuranceCompanyAddress;

    // Events
    event NewPolicy(uint32 healthContractId);
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
    
    /**

    @dev Returns the health insurance policy for a given health contract ID
    @param _healthContractId The unique ID of the health insurance policy
    @return The health insurance policy details as a struct
    */
    function getHealthContract(uint32 _healthContractId) public view returns (HealthContract memory) {
        //If the health contract ID exists in the healthContracts array, the corresponding policy details are returned
        for (uint32 i = 0; i < healthContracts.length; i++) {
            if (healthContracts[i].healthcontractID == _healthContractId) {
                return healthContracts[i];
            }
        }
        // If the health contract ID does not exist in the healthContracts array,
        // a default HealthContract struct with all fields set to 0 and the coverage type set to "empty" is returned
        return HealthContract(0,0,"empty",0,0,0,false);
    }

    /**
        @dev Allows the insurance company to upload a new health insurance policy by providing the coverage type, premium,
        dental coverage, eye care coverage, general care coverage and approval status.
        @param _coverageType The type of coverage for the policy being uploaded.
        @param _premium The amount of premium to be paid for the policy.
        @param _dental The amount of dental coverage provided by the policy.
        @param _eyeCare The amount of eye care coverage provided by the policy.
        @param _generalCare The amount of general care coverage provided by the policy.
        @param _approval The approval status of the policy.
    */
    function uploadPolicy(string memory _coverageType, uint32 _premium, uint32 _dental, uint32 _eyeCare, uint32 _generalCare, bool _approval) public onlyInsurance {
        // Check if the coverage type already exists
        require(!iscoverageTypeExists[_coverageType], "Coverage already exits");

        // Create a new HealthContract object with the given policy information
        HealthContract memory newHealthContract;
        // Assign the policy information
        uint32 policyId = healthContractId++;
        newHealthContract.healthcontractID = policyId;
        newHealthContract.coverageType = _coverageType;
        newHealthContract.premium = _premium;
        newHealthContract.dental = _dental;
        newHealthContract.eyeCare = _eyeCare;
        newHealthContract.generalCare = _generalCare;
        newHealthContract.approval = _approval;

        // Update the coverage type in the mapping
        iscoverageTypeExists[_coverageType] = true;

        // Add the new policy to the array
        healthContracts.push(newHealthContract);

        // Emit an event to signify the addition of the new policy
        emit NewPolicy(policyId);

    }

    /**
    @dev Returns an array of all HealthContracts stored in the healthContracts array.
    @return An array of HealthContract objects representing all stored health insurance policies.
    */
    function getAllHealthContracts() public view returns (HealthContract[] memory) {
        return healthContracts;
    }
}
