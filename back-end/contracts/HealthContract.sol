// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthContract {
    // Fields
    address insuranceCompanyAddress;
    Coverage coverageType;
    uint coverageLimit; // Coverage limit for the policy
    uint premium; // Premium amount to be paid by the individual
    uint claimAmount; // Amount to be claimed by the individual in case of an emergency

    mapping (address => bool) individuals;
    mapping (Coverage => string) public coverageTypes;
    
    // Enumeration for coverage types
    enum Coverage { Bronze, Silver, Gold, Premium }

    // Events
    event LogHealthCoverage(address company, string coverage);
    event NewClaimSubmitted(address claimant);
    event NewClaimRequested(address requester);
    event ClaimApproved(address requester);
    event ClaimRejected(address requester);
    event NewPolicy(string coverageType, uint coverageLimit, uint premium);

    // Modifier to ensure only the contract owner can execute the function
    modifier onlyInsurance {
        require(msg.sender == insuranceCompanyAddress, "Only the insurance can execute this function.");
        _;
    }

    // Functions

    // Function to upload the health insurance policy
    function uploadPolicy(Coverage _coverageType, uint _coverageLimit, uint _premium) public  onlyInsurance {
        // Assign the policy information
        insuranceCompanyAddress = msg.sender;
        coverageType = _coverageType;
        coverageLimit = _coverageLimit;
        premium = _premium;

        // Emit a NewPolicy event
        emit NewPolicy(stringToCoverageType(_coverageType), _coverageLimit, _premium);
    }

    // Function to convert Coverage type to string
    function stringToCoverageType(Coverage _coverageType) private pure returns (string memory) {
        if (_coverageType == Coverage.Bronze) return "Bronze";
        if (_coverageType == Coverage.Silver) return "Silver";
        if (_coverageType == Coverage.Gold) return "Gold";
        if (_coverageType == Coverage.Premium) return "Premium";
        return "Invalid Coverage Type";
    }

    function getCoverageTypes() public view onlyInsurance returns (string[] memory) {
        string[] memory coverageTypesArr = new string[](4);
        coverageTypesArr[uint(Coverage.Bronze)] = coverageTypes[Coverage.Bronze];
        coverageTypesArr[uint(Coverage.Silver)] = coverageTypes[Coverage.Silver];
        coverageTypesArr[uint(Coverage.Gold)] = coverageTypes[Coverage.Gold];
        coverageTypesArr[uint(Coverage.Premium)] = coverageTypes[Coverage.Premium];

        return coverageTypesArr;
    }

    function submitClaim(address _individual) public {
        require(individuals[_individual], "Individual not registered in the contract");
        individuals[_individual] = false;
        emit NewClaimSubmitted(_individual);
    }

    function requestClaim(address _individual) public {
        require(!individuals[_individual], "Claim already submitted by this individual");
        emit NewClaimRequested(_individual);
    }

    function approveClaim(address _individual) public {
        require(!individuals[_individual], "Claim already approved");
        individuals[_individual] = true;
        emit ClaimApproved(_individual);
    }

    function rejectClaim(address _individual) public {
        require(!individuals[_individual], "Claim already rejected");
        individuals[_individual] = true;
        emit ClaimRejected(_individual);
    }
}
