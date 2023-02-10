// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HealthContract {
    // Fields
    address insuranceCompany;
    string coverageType;
    
    // Enumeration for coverage types
    enum Coverage { Bronze, Silver, Gold, Premium }

    // Events
    event LogHealthCoverage(address company, string coverage);

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
    }
}
