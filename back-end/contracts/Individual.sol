// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Individual {
    uint32 individual_id = 0;

    // structure for a sinhgle insured person
    struct individual{
        address individualAddress;
        string first_name;
        string last_name;
        string username;
        string email;
        bytes32 password;
        uint32[] healthContractId;
    }

    // This mapping maps an individual ID to an individual struct, containing the individual's details
    mapping (uint32 => individual) public individuals;

    // This mapping maps an individual's username to their corresponding individual ID
    mapping (string => uint32) public individualsByUsername;

    // This mapping maps an individual's username to their corresponding individual struct
    mapping(string => individual) public usernameByIndividual;

    // This mapping maps an insurance username to an array of individual IDs who have a health contract with that insurance
    mapping (string => uint32[]) public healthContractsAssigned;

    // This mapping maps an individual's Ethereum address to their corresponding individual ID
    mapping (address => uint32) public addressByIndiviudalID;

    // This mapping maps a username to a boolean value indicating whether the username exists or not
    mapping (string => bool) public isUsernameExists;

    // Events
    event LogInsuredPersonRegistered(uint32, string username);
    event LogHealthContractAssigned(address, bool success, uint32);
    event LogIndividualAddress(address);

    // functions

    // Function to register a new provider
    function registerIndividual(string memory _firstname, string memory _lastname, string memory _username,
                                 string memory _email, string memory _password) public {
        // Check if username already exists
        require(!isUsernameExists[_username], "Username already exists");

        uint32 userId = individual_id++;
        individuals[userId].individualAddress = msg.sender;
        individuals[userId].first_name = _firstname;
        individuals[userId].last_name = _lastname;
        individuals[userId].username = _username;
        individuals[userId].email = _email;
        individuals[userId].password = hashPassword(_password);

        // Set the username as taken
        isUsernameExists[_username] = true;

        // Add username to mapping
        individualsByUsername[_username] = userId;

        // Add address to mapping
        addressByIndiviudalID[msg.sender] = userId;
       
        // Emit a individual event
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

    /**
    @dev This function allows the individual to sign a health contract.
    @param _username The username of the individual.
    @param _healthContractId The ID of the health contract to be signed.
    Emits LogHealthContractAssigned event when a health contract is successfully signed.
    */
    function signHealthContract(string memory _username, uint32 _healthContractId) public {
        // Check if the health contract has already been chosen by the individual
        require(!contains(healthContractsAssigned[_username], _healthContractId), "You have already chosen this health contract.");

        // If the individual has not chosen any health contracts before, initialize the array
        if (healthContractsAssigned[_username].length == 0) {
            healthContractsAssigned[_username] = new uint32[](0);
        }

        // Add the health contract ID to the list of chosen contracts for the individual
        healthContractsAssigned[_username].push(_healthContractId);

        // Add the health contract ID to the list of chosen contracts for the individual in the individuals mapping
        uint32 _individual_id = addressByIndiviudalID[msg.sender];
        individuals[_individual_id].healthContractId.push(_healthContractId);

        // Emit an event to notify the front end that a health contract has been successfully signed
        emit LogHealthContractAssigned(msg.sender, true, _healthContractId);
    }


    /**
    @dev Returns an array of uint32 representing the health contracts assigned to a specific individual by their username
    @param _username The username of the individual to retrieve the health contracts for
    @return An array of uint32 representing the health contracts assigned to the individual
    @notice This function can be called by anyone in a read-only fashion
    */
    function getHealthContracts(string memory _username) public view returns (uint32[] memory) {
        // Check if the individual has any health contracts assigned to them
        require(healthContractsAssigned[_username].length > 0, "No health contracts have been assigned to this individual.");
        // Return the array of health contracts assigned to the individual
        return healthContractsAssigned[_username];
    }
    

    // Returns true if the health contract has been signed by the given individual
    function isHealthContractSigned(string memory _username, uint32 _healthContractId) public view returns (bool) {
        // Ensure that at least one health contract has been assigned to the individual
        require(healthContractsAssigned[_username].length > 0, "No health contracts have been assigned to this individual.");
        // Check if the given health contract ID is present in the list of health contracts assigned to the individual
        return contains(healthContractsAssigned[_username], _healthContractId);
    }


    function contains(uint32[] storage arr, uint32 value) internal view returns (bool) {
        for (uint32 i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return true;
            }
        }
        return false;
    }
 
    function authenticate(string memory _username, string memory _password) public view returns (bool) {
        uint32 individualId = individualsByUsername[_username];
        if (!isUsernameExists[_username]) {
            // Username does not exist
            return false;
        }
        bytes32 hashedPassword = hashPassword(_password);
        return individuals[individualId].password == hashedPassword;
    }

    /**
    @dev Retrieves an array of all individual structs created in the smart contract.
    @return result An array of individual structs.
    */
    function getAllIndividuals() public view returns (individual[] memory) {
        // Create an array to store all individual structs.
        individual[] memory result = new individual[](individual_id);
        
        // Loop through the individuals mapping and add each individual struct to the result array.
        for (uint32 i = 0; i < individual_id; i++) {
            result[i] = individuals[i];
        }

        // Return the result array.
        return result;
    }

}