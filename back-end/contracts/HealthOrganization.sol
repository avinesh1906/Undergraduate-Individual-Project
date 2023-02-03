// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract healthorganization {
    // fields
    address healthorganizationAddress;
    string healthorganizationName = "Health and Quality of Life Organization";
    string email = "hio@gmail.com";
    bytes32 password = hashPassword("password");

     constructor() {
        healthorganizationAddress = msg.sender; 
    }


    // functions
    function hashPassword(string memory _password) private pure returns (bytes32) {
            return keccak256(abi.encodePacked(_password));
    }

    function getHealthOrganization() public view returns (string memory, string memory){
        return (
            healthorganizationName,
            email
        );
    }

}