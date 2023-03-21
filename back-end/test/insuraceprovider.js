const InsuranceProvider = artifacts.require("./InsuranceProvider.sol");

contract("InsuranceProvider", () => {
    let insuranceProvider;

    beforeEach(async () => {
        insuranceProvider = await InsuranceProvider.new();
    });

    describe("registerProvider", () => {
        it("should register a provider", async () => {
            const name = "Test Insurance";
            const email = "test@insurance.com";
            const password = "secret";

            const tx = await insuranceProvider.registerProvider(name, email, password);

            const provider = await insuranceProvider.getInsuranceProvider();

            assert.equal(provider[0], name, "The provider name was not stored correctly");
            assert.equal(provider[1], email, "The provider email was not stored correctly");

            const isRegistered = await insuranceProvider.isInsuranceRegistered();
            assert.isTrue(isRegistered, "The provider was not registered");

            const event = tx.logs.find(log => log.event === "NewProvider");
            assert.exists(event, "NewProvider event was not emitted");
            assert.equal(event.args.provider_name, name, "The provider_name event argument was not correct");
            assert.equal(event.args.username, email, "The username event argument was not correct");
        });
    });
    describe("isInsuranceRegistered", () => {
        it("should return false if the provider is not registered", async () => {
            const isRegistered = await insuranceProvider.isInsuranceRegistered();
            assert.isFalse(isRegistered, "The provider is registered when it should not be");
        });
    
        it("should return true if the provider is registered", async () => {
            const name = "Test Insurance";
            const email = "test@insurance.com";
            const password = "secret";
    
            await insuranceProvider.registerProvider(name, email, password);
    
            const isRegistered = await insuranceProvider.isInsuranceRegistered();
            assert.isTrue(isRegistered, "The provider is not registered when it should be");
        });
    });
    
    describe("authenticate", () => {
        it("should return true if the password is correct", async () => {
            const name = "Test Insurance";
            const email = "test@insurance.com";
            const password = "secret";
    
            await insuranceProvider.registerProvider(name, email, password);
    
            const isAuthenticated = await insuranceProvider.authenticate(email, password);
            assert.isTrue(isAuthenticated[0], "The password was not authenticated correctly");
            assert.equal(isAuthenticated[1], name, "The insurance name is incorrect");
        });
        it("should return false if the password is incorrect", async () => {
            const name = "Test Insurance";
            const email = "test@insurance.com";
            const password = "secret";
    
            await insuranceProvider.registerProvider(name, email, password);
    
            const isAuthenticated = await insuranceProvider.authenticate(email, "wrong_password");
            assert.isFalse(isAuthenticated[0], "The email was authenticated correctly when it should not have been");
            assert.equal(isAuthenticated[1], "", "The insurance name should be an empty string");
        });
        it("should return false if the email is incorrect", async () => {
            const name = "Test Insurance";
            const email = "test@insurance.com";
            const password = "secret";
    
            await insuranceProvider.registerProvider(name, email, password);
    
            const isAuthenticated = await insuranceProvider.authenticate("wrong_email", password);
            assert.isFalse(isAuthenticated[0], "The password was authenticated correctly when it should not have been");
            assert.equal(isAuthenticated[1], "", "The insurance name should be an empty string");
        });
    });    
});

