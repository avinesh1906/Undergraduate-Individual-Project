// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthContract {
    // Fields
    address insuranceCompany;
    string coverageType;
    mapping (address => bool) individuals;
    
    // Enumeration for coverage types
    enum Coverage { Bronze, Silver, Gold, Premium }

    // Events
    event LogHealthCoverage(address company, string coverage);
    event NewClaimSubmitted(address claimant);
    event NewClaimRequested(address requester);
    event ClaimApproved(address requester);
    event ClaimRejected(address requester);

    // Functions
    function getCoverageDetails() public view returns (address, string memory) {
        return (insuranceCompany, coverageType);
    }

    // Function to set the coverage details
    function setCoverageDetails(address _insuranceCompany, Coverage _coverageType) public {
        insuranceCompany = _insuranceCompany;
        coverageType = stringToCoverageType(_coverageType);

        // Emit a LogHealthCoverage event
        emit LogHealthCoverage(insuranceCompany, coverageType);
    }

    // Function to convert Coverage type to string
    function stringToCoverageType(Coverage _coverageType) private pure returns (string memory) {
        if (_coverageType == Coverage.Bronze) return "Bronze";
        if (_coverageType == Coverage.Silver) return "Silver";
        if (_coverageType == Coverage.Gold) return "Gold";
        if (_coverageType == Coverage.Premium) return "Premium";
        return "Invalid Coverage Type";
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
