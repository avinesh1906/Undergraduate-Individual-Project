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
    }
     // Mapping from usernames to provider addresses
    mapping (uint32 => Individual) public individuals;

    // Events
    event LogInsuredPersonRegistered(uint32, string username);

    // functions

    // Function to register a new provider
    function registerProvider(string memory _firstname, string memory _lastname, string memory _username, string memory _email, string memory _password) public returns (uint32){
        // Check if the username is not already taken
        // require(individuals[_username] == address(0), "Username is already taken");

        // Create a new provider
        // Individual memory newIndividual = Individual({
        //     individualAddress: msg.sender,
        //     first_name: _firstname,
        //     last_name: _lastname,
        //     username: _username,
        //     email: _email,
        //     password: hashPassword(_password)
        // });

        // // Add the new provider to the mapping and provider list
        // individuals[_username] = newIndividual.individualAddress;
        // individualList.push(newIndividual);
        uint32 userId = individual_id++;
        individuals[userId].first_name = _firstname;
        individuals[userId].last_name = _lastname;
        individuals[userId].username = _username;
        individuals[userId].email = _email;
        individuals[userId].password = hashPassword(_password);

        // Emit a NewProvider event
        emit LogInsuredPersonRegistered(userId, individuals[userId].username);
        return userId;
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
}