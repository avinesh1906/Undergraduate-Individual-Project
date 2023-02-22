var HealthOrganization = artifacts.require('./HealthOrganization.sol');

contract("HealthOrganization", async (accounts) => {
  let healthOrganization;

  beforeEach(async () => {
    healthOrganization = await HealthOrganization.new();
  });

  it("should register health organization", async () => {
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";

    await healthOrganization.registerHealthOrganization(name, email, password);
    let result = await healthOrganization.getHealthOrganization();

    assert.equal(result[0], name, "The registered name does not match the expected name");
    assert.equal(result[1], email, "The registered email does not match the expected email");
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
  it("should authenticate health organization", async () => {
    const name = "Health Org";
    const email = "healthorg@email.com";
    const password = "secret";
  
    await healthOrganization.registerHealthOrganization(name, email, password);
  
    const isRegistered = await healthOrganization.isHealthOrganizationRegistered();
    assert.equal(isRegistered, true, "Health organization should be registered");
  
    const isAuthenticated = await healthOrganization.authenticate(password);
    assert.equal(isAuthenticated, true, "Authentication should succeed with correct password");
  
    const wrongPassword = "wrongsecret";
    const isNotAuthenticated = await healthOrganization.authenticate(wrongPassword);
    assert.equal(isNotAuthenticated, false, "Authentication should fail with incorrect password");
  });
});
