// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract insuranceprovider {
    // fields
    address insuranceProviderAddress;
    string insuranceName;
    string email;
    bytes32 password;
    address healthContractAddress;

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

    function hashPassword(string memory _password) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_password));
    }

    function isInsuranceRegistered() public view returns (bool) {
        return insuranceProviderAddress != address(0);
    }
}