var Individual  = artifacts.require('./Individual.sol');

contract('Individual', async accounts => {
    let instance;

    beforeEach(async () => {
        instance = await Individual.new();
    });
    it("should register a provider successfully", async () => {
        let firstname = "Avinesh";
        let lastname = "culloo";
        let username = "avi1906";
        let email = "johndoe@example.com";
        let password = "password";
    
        let result = await instance.registerIndividual(firstname, lastname, username, email, password);
    
        // Verify the event was emitted with the correct data
        assert.equal(result.logs[0].event, "LogInsuredPersonRegistered");
        assert.equal(result.logs[0].args[0], 0);
        assert.equal(result.logs[0].args[1], username);
    
        // Verify the individual was registered successfully by checking their information
        let individual = await instance.individuals(0);
        assert.equal(individual.first_name, firstname);
        assert.equal(individual.last_name, lastname);
        assert.equal(individual.username, username);
        assert.equal(individual.email, email);
        assert.notEqual(individual.password, password);
      });

      it("should check if the username is available", async () => { 
        // First, add a new user with a unique username
        await instance.registerIndividual("John", "Doe", "johndoe", "johndoe@example.com", "secretpassword");
    
        // Then, try to add another user with the same username
        try {
          await instance.registerIndividual("Jane", "Doe", "johndoe", "janedoe@example.com", "secretpassword");
          assert.fail("Username should not be available");
        } catch (error) {
          // If the exception was thrown, it means the username was already taken
          assert.include(error.message, "Username already exists");
        }
      });
      it("Should return the correct individual details", async () => {
        // Register an individual
        await instance.registerIndividual("John", "Doe", "aviC", "johndoe@example.com", "password123");
    
        // Get the individual id
        let individualId = (await instance.getIndividualId("aviC"));
    
        // Call the getIndividual function
        let individual = await instance.getIndividual.call(individualId);
        // Assert the returned values
        assert.equal(individual[0], "aviC", "The username is not correct");
        assert.equal(individual[1], accounts[0], "The address is not correct");
        assert.equal(individual[2], "johndoe@example.com", "The email is not correct");
      });
    it("should authenticate a registered individual with the correct password", async () => {
      let username = "avi19061";
      let password = "password";
  
      // Register the individual
      await instance.registerIndividual("Avinesh", "culloo", username, "johndoe@example.com", password);
  
      // Authenticate the individual with the correct password
      let isAuthenticated = await instance.authenticate(username, password);
      assert.equal(isAuthenticated, true);
    });
  
    it("should not authenticate a registered individual with an incorrect password", async () => {
      let username = "avi19062";
      let password = "password";
  
      // Register the individual
      await instance.registerIndividual("Avinesh", "culloo", username, "johndoe@example.com", password);
  
      // Try to authenticate the individual with an incorrect password
      let isAuthenticated = await instance.authenticate(username, "wrongpassword");
      assert.equal(isAuthenticated, false);
    });
  
    it("should not authenticate an unregistered individual", async () => {
      let username = "avi19063";
      let password = "password";
  
      // Try to authenticate an unregistered individual
      let isAuthenticated = await instance.authenticate(username, password);
      assert.equal(isAuthenticated, false);
    });

    it("should return all registered individuals", async () => {
      // Register some individuals
      await instance.registerIndividual("John", "Doe", "johndoe123", "johndoe@example.com", "secretpassword");
      await instance.registerIndividual("Jane", "Doe", "janedoe321", "janedoe@example.com", "secretpassword");
    
      // Get all registered individuals
      let individuals = await instance.getAllIndividuals();
    
      // Assert that the correct number of individuals were returned
      // assert.equal(individuals.length, 2);
    
      // Assert that the individuals were returned in the correct order
      assert.equal(individuals[0].username, "johndoe123");
      assert.equal(individuals[1].username, "janedoe321");
    });
  describe('signHealthContract', () => {
    it('should assign a health contract to an individual', async () => {
      const username = 'alice';
      const healthContractId = 1;
    
      // Register a new individual
      await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password');
    
      // Sign a health contract for the individual
      await instance.signHealthContract(username, healthContractId, { from: accounts[0] });
    
      // Check that the health contract was assigned to the individual
      const healthContracts = await instance.getHealthContracts(username);
      assert(healthContracts.length === 1 && healthContracts[0].words[0] === healthContractId, 'Health contract was not assigned to the individual.')
    });

    it('should not assign a health contract that has already been assigned to the individual', async () => {
      const username = 'alice';
      const healthContractId = 1;

      // Register a new individual
      await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password', { from: accounts[0] });

      // Sign the same health contract twice for the individual
      await instance.signHealthContract(username, healthContractId, { from: accounts[0] });
      try {
        await instance.signHealthContract(username, healthContractId, { from: accounts[0] });
        assert.fail('Expected to throw');
      } catch (error) {
        assert.include(error.message, 'You have already chosen this health contract.');
      }
    });
    it('should check if a health contract has been signed by an individual', async () => {
      const username = 'alice';
      const healthContractId = 1;
    
      // Register a new individual
      await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password', { from: accounts[0] });
    
      // Sign a health contract for the individual
      await instance.signHealthContract(username, healthContractId, { from: accounts[0] });
    
      // Check if the health contract has been signed
      const isSigned = await instance.isHealthContractSigned(username, healthContractId);
      assert.isTrue(isSigned, 'Health contract has not been signed by the individual.');
    });
    
  });

  describe('getHealthContracts', () => {
    it('should return an empty array if no health contracts have been assigned to the individual', async () => {
      const username = 'alice';
    
      // Register a new individual
      await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password', { from: accounts[0] });
    
      // Check that an empty array is returned for an individual with no assigned health contracts
      try {
        await instance.getHealthContracts(username);
        assert.fail('Expected to throw');
      } catch (error) {
        assert.include(error.message, 'No health contracts have been assigned to this individual.');
      }
    });
    
    it('should return an array of health contracts assigned to the individual', async () => {
      const username = 'alice';
      const healthContractIds = [1, 2, 3];
    
      // Register a new individual
      await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password', { from: accounts[0] });
    
      // Sign multiple health contracts for the individual
      for (const healthContractId of healthContractIds) {
        await instance.signHealthContract(username, healthContractId, { from: accounts[0] });
      }
    
      // Check that all signed health contracts are returned for the individual
      const healthContracts = await instance.getHealthContracts(username);
      assert(healthContracts.length === 3 && healthContracts[0].words[0] === 1 && healthContracts[1].words[0] === 2 && healthContracts[2].words[0] === 3 , 'Health contract was not assigned to the individual.')
    });
    
    it('should revert if called by an individual with no assigned health contracts', async () => {
        const username = 'alice';
      
        // Register a new individual
        await instance.registerIndividual('Alice', 'Smith', username, 'alice@example.com', 'password', { from: accounts[0] });
      
        // Check that the function reverts if called by an individual with no assigned health contracts
        try {
          await instance.getHealthContracts(username, { from: accounts[1] });
        } catch (error) {
          expect(error.message).to.include('No health contracts have been assigned to this individual.');
        }
    });      
  });  
});