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
}