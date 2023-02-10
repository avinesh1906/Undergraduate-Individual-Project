var Individual  = artifacts.require('./Individual.sol');

contract('Individual', async account => {
    let instance;

    beforeEach(async () => {
        instance = await Individual.deployed();
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
    
        // Verify the provider was registered successfully by checking their information
        let provider = await instance.individuals(0);
        assert.equal(provider.first_name, firstname);
        assert.equal(provider.last_name, lastname);
        assert.equal(provider.username, username);
        assert.equal(provider.email, email);
        assert.notEqual(provider.password, password);
      });

      it("should check if the username is available", async function() { 
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
        assert.equal(individual[2], "johndoe@example.com", "The email is not correct");
      });
});