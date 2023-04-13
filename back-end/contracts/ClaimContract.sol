// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./HealthPolicy.sol";

contract ClaimContract is HealthPolicy {
    uint32 ClaimContractCount = 0;

    // Enumeration for claim status
    enum ClaimStatus { Submitted, Approved, Denied }

    mapping(string => mapping(uint32 => string[])) public individualByClaim;

    // Variables to store the claims
    Claim[] public claims;

    // Variables to store the contract insurance company, individual and the health organization
    address public healthOrganizationAddress;

    // Struct to store the claim details
    struct Claim {
        uint32 id;
        string requester;
        string claimant;
        HealthContract healthContract;
        ClaimStatus status;
        uint32 claimAmount;
        string claimType;
    }

    // Modifier to ensure only the health organization can execute the function
    modifier onlyHealthOrganization {
        require(msg.sender == healthOrganizationAddress, "Only the health organization can execute this function.");
        _;
    }
     // Modifier to ensure only the individual can execute the function
    modifier onlyIndividual {
        require(msg.sender != insuranceCompanyAddress && msg.sender != healthOrganizationAddress, "Only the individual can execute this function.");
        _;
    }

    // Events
    event returnClaimID(uint id);
    event LogClaimLimit(uint);
    event LogHOClaims(Claim[]);
    event HealthOrganizationAddressSetup(address);

    function setHealthOrganizationAddress() public {
        require(healthOrganizationAddress == address(0), "Health organization address has already been set.");
        healthOrganizationAddress = msg.sender;
        emit HealthOrganizationAddressSetup(healthOrganizationAddress);
    }

    function hasIndividualClaim(string memory _username, uint32 _healthContractID, string memory _claimType) public view returns (bool){
        return checkClaimType(_username, _healthContractID, _claimType);
    }

    // Function to submit a claim by the health organization
    function submitClaim(string memory _username, string memory _individual, uint32 _claimAmount, uint32 _healthContractID, string memory _claimType) public onlyHealthOrganization {
        if (checkHealthContractMapping(_individual,  _healthContractID)){
            require(!checkClaimType(_individual, _healthContractID, _claimType), "You have already submitted a claim for this claim type.");
        } else {
            individualByClaim[_individual][_healthContractID] = new string[](0);
        }
        individualByClaim[_individual][_healthContractID].push(_claimType);

        HealthContract memory _healthContract = getHealthContract(_healthContractID);

        uint32 claimID = ClaimContractCount++;

        // Create a new claim
        Claim memory newClaim = Claim({
            id: claimID,
            requester: _username,
            claimant: _individual,
            healthContract: _healthContract,
            claimAmount: _claimAmount,
            status: ClaimStatus.Submitted,
            claimType: _claimType
        });

        // Add the claim to the list of claims
        claims.push(newClaim);

        // Approve/Disapprove claim
        if (_healthContract.approval){
            approveClaim(newClaim.id);
        }

        emit returnClaimID(newClaim.id);
    }   

    // Function to request a claim by the individual
    function requestClaim(string memory _username, uint32 _claimAmount, uint32 _healthContractID, string memory _claimType) public {
        if (checkHealthContractMapping(_username,  _healthContractID)){
            require(!checkClaimType(_username, _healthContractID, _claimType), "You have already submitted a claim for this claim type.");
        } else {
            individualByClaim[_username][_healthContractID] = new string[](0);
        }
        individualByClaim[_username][_healthContractID].push(_claimType);

        HealthContract memory _healthContract = getHealthContract(_healthContractID);
        
        uint32 claimID = ClaimContractCount++;

        // Create a new claim
        Claim memory newClaim = Claim({
            id: claimID,
            requester: _username,
            claimant: _username,
            healthContract: _healthContract,
            claimAmount: _claimAmount,
            status: ClaimStatus.Submitted,
            claimType: _claimType
        });

        // Add the claim to the list of claims
        claims.push(newClaim);

        // Approve/Disapprove claim
        if (_healthContract.approval){
            approveClaim(newClaim.id);
        }

        emit returnClaimID(newClaim.id);
    }
    
    // Function to approve a claim
    function approveClaim(uint _claimId) public  {
        require(claims.length > 0, "Claims array is empty.");
        require(_claimId < claims.length, "Claim with this id does not exist.");

       // Get the claim from the list of claims
        Claim memory claim = claims[_claimId];

        // Check if the claim has already been approved or denied
        require(claim.status == ClaimStatus.Submitted, "The claim has already been approved or denied.");

        uint claimLimit = 0;
        if (compareString(claim.claimType,"eyeCare")){
            claimLimit = (claim.healthContract.premium  * claim.healthContract.eyeCare) / 100;
        } else if (compareString(claim.claimType,"generalCare")){
            claimLimit = (claim.healthContract.premium  * claim.healthContract.generalCare) / 100;
        } else {
            claimLimit = (claim.healthContract.premium  * claim.healthContract.dental) / 100;
        }

        // Approve the claim if the claim amount is within the coverage limit
        if (claim.claimAmount <= claimLimit) {
            claim.status = ClaimStatus.Approved;
        } else {
            claim.status = ClaimStatus.Denied;
        }
        claims[_claimId] = claim;

        emit LogClaimLimit(claimLimit);
    }

    function adminApproval(uint _claimID) public {
        // Get the claim from the list of claims
        Claim memory claim = claims[_claimID];
        claim.status = ClaimStatus.Approved;
        claims[_claimID] = claim;
    }

    function adminDisapproval(uint _claimID) public {
        // Get the claim from the list of claims
        Claim memory claim = claims[_claimID];
        claim.status = ClaimStatus.Denied;
        claims[_claimID] = claim;
    }

    // Function to get all claims
    function getAllClaims() public onlyInsurance view returns (Claim[] memory){
        // Returns an array of all claims stored in the contract
        return claims;
    }

    // function for the health organization to get all claims related to him
    function getOrganizationClaims(string memory _username) public onlyHealthOrganization view returns (Claim[] memory) {
        uint count = 0;
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].requester, _username)) {
                count++;
            }
        }
        Claim[] memory result = new Claim[](count);
        uint index = 0;
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].requester, _username)) {
                result[index] = claims[i];
                index++;
            }
        }
        return result;
    }


    // function for the individual to get all claims related to him
    function getIndividualClaims(string memory _username) public view returns (Claim[] memory) {
        uint count = 0;
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].claimant, _username)) {
                count++;
            }
        }
        Claim[] memory result = new Claim[](count);
        uint index = 0;
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].claimant, _username)) {
                result[index] = claims[i];
                index++;
            }
        }
        return result;
    }

    function compareString(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function checkClaimType(string memory key1, uint32 key2, string memory value) internal view returns (bool) {
        string[] storage claimValues = individualByClaim[key1][key2]; // retrieve the array of values at key2
        for (uint i = 0; i < claimValues.length; i++) { // loop through the array
            if (keccak256(bytes(claimValues[i])) == keccak256(bytes(value))) { // check if the value exists
                return true;
            }
        }
        return false;
    }

    function checkHealthContractMapping(string memory individual, uint32 healthContractId) public view returns (bool) {
        return individualByClaim[individual][healthContractId].length > 0;
    }
}
