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
    event HealthOrganizationAddressSetup(address);

    function setHealthOrganizationAddress() public {
        require(healthOrganizationAddress == address(0), "Health organization address has already been set.");
        healthOrganizationAddress = msg.sender;
        emit HealthOrganizationAddressSetup(healthOrganizationAddress);
    }

    function hasIndividualClaim(string memory _username, uint32 _healthContractID, string memory _claimType) public view returns (bool){
        return checkClaimType(_username, _healthContractID, _claimType);
    }

    /**
        @dev Submit a new claim
        @param _username The username of the user who submitted the claim
        @param _individual The individual's name who is submitting the claim
        @param _claimAmount The amount being claimed
        @param _healthContractID The ID of the health contract related to the claim
        @param _claimType The type of claim being submitted
    */
    function submitClaim(string memory _username, string memory _individual, uint32 _claimAmount,
                        uint32 _healthContractID, string memory _claimType) public onlyHealthOrganization {

        // Check if the health contract and claim type have not already been submitted
        if (checkHealthContractMapping(_individual,  _healthContractID)){
            require(!checkClaimType(_individual, _healthContractID, _claimType), "You have already submitted a claim for this claim type.");
        } else {
            // Create a new claim list for the individual and health contract mapping
            individualByClaim[_individual][_healthContractID] = new string[](0);
        }
        // Add the claim type to the list of claims for this individual and health contract
        individualByClaim[_individual][_healthContractID].push(_claimType);

        // Get the health contract for this claim
        HealthContract memory _healthContract = getHealthContract(_healthContractID);

        // Create a new claim ID
        uint32 claimID = ClaimContractCount++;

        // Create a new claim object with the provided information
        Claim memory newClaim = Claim({
            id: claimID,
            requester: _username,
            claimant: _individual,
            healthContract: _healthContract,
            claimAmount: _claimAmount,
            status: ClaimStatus.Submitted,
            claimType: _claimType
        });

        // Add the new claim to the claims array
        claims.push(newClaim);

        // Approve/disapprove the claim based on the health contract approval status
        if (_healthContract.approval){
            approveClaim(newClaim.id);
        }

        // Emit the claim ID
        emit returnClaimID(newClaim.id);
    }


    /**
        @dev This function allows an individual to request a claim.
        @param _username The username of the individual requesting the claim.
        @param _claimAmount The amount of the claim requested.
        @param _healthContractID The ID of the health contract for which the claim is being requested.
        @param _claimType The type of claim being requested.
    */
    function requestClaim(string memory _username, uint32 _claimAmount, uint32 _healthContractID, string memory _claimType) public {
        // Check if the user has a valid health contract for the specified health contract ID
        if (checkHealthContractMapping(_username,  _healthContractID)){
            // Check if the user has already submitted a claim for this claim type
            require(!checkClaimType(_username, _healthContractID, _claimType), "You have already submitted a claim for this claim type.");
        } else {
            // Create a new claim type array for the user and the specified health contract
            individualByClaim[_username][_healthContractID] = new string[](0);
        }


        // Add the claim type to the user's array of claim types for the specified health contract
        individualByClaim[_username][_healthContractID].push(_claimType);

        // Get the HealthContract information for the specified health contract ID
        HealthContract memory _healthContract = getHealthContract(_healthContractID);
        
        // Generate a new claim ID
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
    
    /**
        @dev This function allows to approve or disapprove automatically a claim.
        @param _claimId The claim id to approve/disapprove.
    */
    function approveClaim(uint _claimId) public  {
        require(claims.length > 0, "Claims array is empty.");
        require(_claimId < claims.length, "Claim with this id does not exist.");

       // Get the claim from the list of claims
        Claim memory claim = claims[_claimId];

        // Check if the claim has already been approved or denied
        require(claim.status == ClaimStatus.Submitted, "The claim has already been approved or denied.");

        // calculate teh claim limit based on the claim type
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
        // Set the claim status to approve
        claim.status = ClaimStatus.Approved;
        // update the claim in the map
        claims[_claimID] = claim;
    }

    function adminDisapproval(uint _claimID) public {
        // Get the claim from the list of claims
        Claim memory claim = claims[_claimID];
        // Set the claim status to approve
        claim.status = ClaimStatus.Denied;
        // update the claim in the map
        claims[_claimID] = claim;
    }

    // Function to get all claims that can only be executed by the insurance
    function getAllClaims() public onlyInsurance view returns (Claim[] memory){
        // Returns an array of all claims stored in the contract
        return claims;
    }

    // function for the health organization to get all claims related to him
    function getOrganizationClaims(string memory _username) public onlyHealthOrganization view returns (Claim[] memory) {
        uint count = 0;
        // Count the number of claims submitted by the health organization
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].requester, _username)) {
                count++;
            }
        }

        // Create an array to store the claims
        Claim[] memory result = new Claim[](count);
        uint index = 0;

        // Store the claims in the array
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].requester, _username)) {
                result[index] = claims[i];
                index++;
            }
        }
        return result;
    }

    /**
    * @dev Retrieves all claims made by a particular individual.
    * @param _username The username of the individual.
    * @return An array of claims made by the individual.
    */
    function getIndividualClaims(string memory _username) public view returns (Claim[] memory) {
        // Count the number of claims made by the individual
        uint count = 0;
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].claimant, _username)) {
                count++;
            }
        }
        
        // Create an array to hold the claims
        Claim[] memory result = new Claim[](count);
        uint index = 0;
        
        // Fill the array with the claims made by the individual
        for (uint i = 0; i < claims.length; i++) {
            if (compareString(claims[i].claimant, _username)) {
                result[index] = claims[i];
                index++;
            }
        }
        
        // Return the array of claims made by the individual
        return result;
    }


    function compareString(string memory a, string memory b) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    /**
        @dev Internal function to check if a claim type exists for an individual in a specific health contract.
        @param key1 The key representing the individual.
        @param key2 The key representing the health contract ID.
        @param value The value representing the claim type to check for.
        @return A boolean indicating whether or not the claim type exists.
    */
    function checkClaimType(string memory key1, uint32 key2, string memory value) internal view returns (bool) {
        // Retrieve the array of values at key2
        string[] storage claimValues = individualByClaim[key1][key2];
        // Loop through the array
        for (uint i = 0; i < claimValues.length; i++) {
        // Check if the value exists
            if (keccak256(bytes(claimValues[i])) == keccak256(bytes(value))) {
                return true;
            }
        }
        return false;
    }

    function checkHealthContractMapping(string memory individual, uint32 healthContractId) public view returns (bool) {
        return individualByClaim[individual][healthContractId].length > 0;
    }
}
