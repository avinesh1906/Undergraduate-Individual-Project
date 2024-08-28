// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract HealthOrganization {
    // fields
    address healthorganizationAddress;
    string name;
    string email;
    bytes32 password;

    // events
    event LogRegisterdHO(string name);

    // functions
    function hashPassword(string memory _password) private pure returns (bytes32) {
            return keccak256(abi.encodePacked(_password));
    }

    function getHealthOrganization() public view returns (string memory, string memory){
        return (
            name,
            email
        );
    }

    /**
        @dev This function registers a new health organization by assigning the address of the current caller as 
        the address of the organization.
        It sets the name, email and hashed password of the health organization.
        It emits a LogRegisterdHO event.
        @param _name The name of the health organization.
        @param _email The email of the health organization.
        @param _password The password of the health organization.
    */
    function registerHealthOrganization(string memory _name, string memory _email, string memory _password) public {
        healthorganizationAddress = msg.sender;
        name = _name;
        email = _email;
        password = hashPassword(_password);

        emit LogRegisterdHO(name);
    }

    function isHealthOrganizationRegistered() public view returns (bool) {
        return healthorganizationAddress != address(0);
    }

    function authenticate(string memory _email, string memory _password) public view returns (bool, string memory) {
        // Check if email is correct and password matches the hashed password
        if (compareEmail(_email) && hashPassword(_password) == password){
            // Return true and the name of the health organization
            return (true, name);
        }
        // Return false and an empty string
        return (false, "");
    }


    function compareEmail(string memory a ) public view returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(email));
    }
}