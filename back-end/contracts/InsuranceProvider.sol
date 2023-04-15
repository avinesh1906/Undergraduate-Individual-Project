// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract InsuranceProvider {
    // fields
    address insuranceProviderAddress;
    string insuranceName;
    string email;
    bytes32 password;

    // Events
    event NewProvider(string provider_name, string username);

    // functions
    function getInsuranceProvider() public view returns (string memory, string memory){
        return (
            insuranceName,
            email
        );
    }

    // Function to register a single provider
    function registerProvider(string memory _name, string memory _email, string memory _password) public {
        insuranceProviderAddress= msg.sender;
        insuranceName= _name;
        email= _email;
        password= hashPassword(_password);

        // Emit a NewProvider event
        emit NewProvider(_name, _email);
    }

    // Function uses the keccak256 hash function to compute the hash of the password
    function hashPassword(string memory _password) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_password));
    }

    // Function to verify if there is an alreadyr registered insurance
    function isInsuranceRegistered() public view returns (bool) {
        // If the insurance provider address is equal to the zero address, 
        // it means that no insurance provider is registered and the function returns false.
        return insuranceProviderAddress != address(0);
    }

    // This function authenticates an insurance provider based on the email and password entered by the user.
    function authenticate(string memory _email, string memory _password) public view returns (bool, string memory) {
        if (compareEmail(_email) && hashPassword(_password) == password){
            return (true, insuranceName);
        }
        return (false, "");
    }
    
    // Compare the email
    function compareEmail(string memory inputEmail ) public view returns (bool) {
        // uses the keccak256 to compare string
        return keccak256(abi.encodePacked(inputEmail)) == keccak256(abi.encodePacked(email));
    }
}