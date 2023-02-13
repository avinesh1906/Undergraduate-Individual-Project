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
});

