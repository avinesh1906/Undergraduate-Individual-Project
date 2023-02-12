// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./HealthPolicy.sol";

contract ClaimContract is HealthPolicy {
    // Enumeration for claim status
    enum ClaimStatus { Submitted, Approved, Denied }

    mapping (address => bool) public claimExists;

    // Variables to store the claims
    Claim[] public claims;

    // Variables to store the contract insurance company, individual and the health organization
    address public healthOrganizationAddress;

    // Struct to store the claim details
    struct Claim {
        uint id;
        address requester;
        HealthContract healthContract;
        ClaimStatus status;
        uint claimAmount;
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

    // Function to submit a claim by the health organization
    function submitClaim(address _individual, uint _claimAmount, uint256 _healthContractID) public onlyHealthOrganization {
        require(!claimExists[_individual], "This claim has already been submitted.");
        claimExists[_individual] = true;

        HealthContract memory _healthContract = getHealthContract(_healthContractID);

        // Create a new claim
        Claim memory newClaim = Claim({
            id: claims.length + 1,
            requester: msg.sender,
            healthContract: _healthContract,
            claimAmount: _claimAmount,
            status: ClaimStatus.Submitted
        });

        // Add the claim to the list of claims
        claims.push(newClaim);
        emit returnClaimID(newClaim.id);
    }

    // Function to request a claim by the individual
    function requestClaim(uint _claimAmount, uint256 _healthContractID) public onlyIndividual {
        require(!claimExists[msg.sender], "This individual has already requested a claim.");
        claimExists[msg.sender] = true;

        HealthContract memory _healthContract = getHealthContract(_healthContractID);
        // Create a new claim
        Claim memory newClaim = Claim({
            id: claims.length + 1,
            requester: msg.sender,
            healthContract: _healthContract,
            claimAmount: _claimAmount,
            status: ClaimStatus.Submitted
        });

        // Add the claim to the list of claims
        claims.push(newClaim);
        emit returnClaimID(newClaim.id);
    }
    
    // Function to approve a claim
    function approveClaim(uint _claimId) public view {
        // Get the claim from the list of claims
        Claim memory claim = claims[_claimId];

        // Check if the claim exists
        address claimRequester = claim.requester;
        require(claimExists[claimRequester], "This claim does not exist.");
       
        // Check if the claim has already been approved or denied
        require(claim.status == ClaimStatus.Submitted, "The claim has already been approved or denied.");

        uint claimLimit = claim.healthContract.premium * claim.healthContract.coverageLimit;

        // Approve the claim if the claim amount is within the coverage limit
        if (claim.claimAmount <= claimLimit) {
            claim.status = ClaimStatus.Approved;
        } else {
            claim.status = ClaimStatus.Denied;
        }
    }

    // Function to get all claims
    function getAllClaims() public onlyInsurance view returns (Claim[] memory){
        // Returns an array of all claims stored in the contract
        return claims;
    }

    // function for the health organization to get all claims related to him
    function getHealhtOrganizationClaim() public view onlyHealthOrganization returns (Claim[] memory) {
        uint256 index = 0;
        Claim[] memory returnClaim;
        for (uint i = 0; i < claims.length; i++){
            if (claims[i].requester == healthOrganizationAddress){
                returnClaim[index] = claims[i];
                index++;
            }
        }
        return returnClaim;
    }

    // function for the health organization to get all claims related to him
    function getIndividualClaim() public view onlyIndividual returns (Claim[] memory) {
        uint256 index = 0;
        Claim[] memory returnClaim;
        for (uint i = 0; i < claims.length; i++){
            if (claims[i].requester == msg.sender){
                returnClaim[index] = claims[i];
                index++;
            }
        }
        return returnClaim;
    }
}
