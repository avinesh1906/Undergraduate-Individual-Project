var HealthOrganization = artifacts.require('./HealthOrganization.sol');

contract("HealthOrganization", async (accounts) => {
  let healthOrganization;

  beforeEach(async () => {
    healthOrganization = await HealthOrganization.new();
  });

  // The following test case checks if the registerHealthOrganization function registers the health organization correctly
  it("should register health organization", async () => {
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";
    
    await healthOrganization.registerHealthOrganization(name, email, password);
    let result = await healthOrganization.getHealthOrganization();
    
    assert.equal(result[0], name, "The registered name does not match the expected name");
    assert.equal(result[1], email, "The registered email does not match the expected email");
  });

  // The following test case checks whether the isHealthOrganizationRegistered function returns the boolean value correctly
  it("should check if health organization is registered", async () => {
    const isRegistered = await healthOrganization.isHealthOrganizationRegistered();
       
    assert.equal(isRegistered, false, "Health organization should not be registered before the registration process");
    
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";
    
    await healthOrganization.registerHealthOrganization(name, email, password);
    
    const isNowRegistered = await healthOrganization.isHealthOrganizationRegistered();
    
    assert.equal(isNowRegistered, true, "Health organization should be registered after the registration process");
    
  });

  it("should emit LogRegisterdHO event", async () => {
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";

    const tx = await healthOrganization.registerHealthOrganization(name, email, password);

    const event = tx.logs.find(log => log.event === "LogRegisterdHO");

    assert.exists(event, "LogRegisterdHO event should be emitted");
    assert.equal(event.args.name, name, "The emitted event name does not match the expected name");
  });

  it("should check if health organization is registered", async () => {
    const isRegistered = await healthOrganization.isHealthOrganizationRegistered();
  
    assert.equal(isRegistered, false, "Health organization should not be registered before the registration process");
  
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";
  
    await healthOrganization.registerHealthOrganization(name, email, password);
  
    const isNowRegistered = await healthOrganization.isHealthOrganizationRegistered();
  
    assert.equal(isNowRegistered, true, "Health organization should be registered after the registration process");
  });

  describe("authenticate", () => {
    it("should authenticate health organization", async () => {
      const name = "Health Org";
      const email = "healthorg@email.com";
      const password = "secret";
    
      await healthOrganization.registerHealthOrganization(name, email, password);
    
      const isAuthenticated = await healthOrganization.authenticate(email, password);
      assert.isTrue(isAuthenticated[0], "The password was not authenticated correctly");
      assert.equal(isAuthenticated[1], name, "The health organization name is incorrect");
    });
    it("should return false if the password is incorrect", async () => {
      const name = "Health Org";
      const email = "healthorg@email.com";
      const password = "secret";
    
      await healthOrganization.registerHealthOrganization(name, email, password);
    
      const isAuthenticated = await healthOrganization.authenticate(email, "wrong_password");
      assert.isFalse(isAuthenticated[0], "The password was authenticated correctly when it should not have been");
      assert.equal(isAuthenticated[1], "", "The insurance name should be an empty string");
    });
    it("should return false if the email is incorrect", async () => {
      const name = "Health Org";
      const email = "healthorg@email.com";
      const password = "secret";
    
      await healthOrganization.registerHealthOrganization(name, email, password);
    
      const isAuthenticated = await healthOrganization.authenticate("email", password);
      assert.isFalse(isAuthenticated[0], "The email was authenticated correctly when it should not have been");
      assert.equal(isAuthenticated[1], "", "The insurance name should be an empty string");
    });
  });
  
});
