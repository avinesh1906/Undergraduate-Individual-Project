// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract individual {
    uint32 individual_id = 0;

    // structure for a sinhgle insured person
    struct Individual{
        address individualAddress;
        string first_name;
        string last_name;
        string username;
        string email;
        bytes32 password;
        uint256 healthContractId;
    }
     // Mapping from usernames to provider addresses
    mapping (uint32 => Individual) public individuals;
    // Mappiing of the individual by username
    mapping (string => uint32) public individualsByUsername;
    mapping (address => uint256) public healthContractsAssigned;
    mapping (address => uint32) public addressByIndiviudalID;

    // Events
    event LogInsuredPersonRegistered(uint32, string username);
    event LogHealthContractAssigned(bool success);

    // functions

    // Function to register a new provider
    function registerIndividual(string memory _firstname, string memory _lastname, string memory _username, string memory _email, string memory _password) public {
        // Check if username already exists
        require(individualsByUsername[_username] == 0, "Username already exists");

        uint32 userId = individual_id++;
        individuals[userId].individualAddress = msg.sender;
        individuals[userId].first_name = _firstname;
        individuals[userId].last_name = _lastname;
        individuals[userId].username = _username;
        individuals[userId].email = _email;
        individuals[userId].password = hashPassword(_password);

        // Add username to mapping
        individualsByUsername[_username] = userId;
        // Add address to mapping
        addressByIndiviudalID[msg.sender] = userId;

        // Emit a NewProvider event
        emit LogInsuredPersonRegistered(userId, individuals[userId].username);
    }

    function getIndividual(uint32 _individual_id) public view returns (string memory, address, string memory){
        return (
            individuals[_individual_id].username,
            individuals[_individual_id].individualAddress,
            individuals[_individual_id].email
        );
    }

    function hashPassword(string memory _password) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_password));
    }

    function getIndividualId(string memory _username) public view returns (uint32) {
        return individualsByUsername[_username];
    }

    function chooseHealthContract(uint256 _healthContractId) public {
        require(healthContractsAssigned[msg.sender] == 0, "You have already chosen a health contract.");
        healthContractsAssigned[msg.sender] = _healthContractId;

        uint32 _individual_id = addressByIndiviudalID[msg.sender];
        individuals[_individual_id].healthContractId = _healthContractId;
        emit LogHealthContractAssigned(true);
    }
}