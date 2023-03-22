var HealthPolicy = artifacts.require('./HealthPolicy.sol');

contract('HealthPolicy', (accounts) => {
    let instance;
  
    beforeEach(async () => {
      instance = await HealthPolicy.new();
    });
  
    it('should set the insurance company address', async () => {
      await instance.setInsuranceCompanyAddress({ from: accounts[0] });
      const insuranceCompanyAddress = await instance.getInsuranceCompanyAddress();
      assert.equal(insuranceCompanyAddress, accounts[0], 'Insurance company address does not match');
    });
  
    it("should upload a health insurance policy", async () => {
        await instance.setInsuranceCompanyAddress({ from: accounts[0] });
        const coverageType = "Diamond";
        const coverageLimit = 1000000;
        const premium = 500;
    
        // Upload the policy
        await instance.uploadPolicy(coverageType, coverageLimit, premium, { from: accounts[0] });
    
        // Check if policy was uploaded
        const policy = await instance.getHealthContract(1);
        assert.equal(parseInt(policy.coverageLimit), coverageLimit, "Coverage limit does not match");
        assert.equal(policy.coverageType, coverageType, "Coverage type does not match");
        assert.equal(parseInt(policy.premium), premium, "Premium does not match");
    });
  
    it('should not upload a policy if coverage already exists', async () => {
      await instance.setInsuranceCompanyAddress({ from: accounts[0] });
      const coverageType = 'Diamond';
      const coverageLimit = 100;
      const premium = 10;
  
      await instance.uploadPolicy(coverageType, coverageLimit, premium, { from: accounts[0] });
      try {
        await instance.uploadPolicy(coverageType, coverageLimit, premium, { from: accounts[0] });
      } catch (error) {
        assert.equal(error.message, 'VM Exception while processing transaction: revert Coverage already exits', 'Unexpected error message');
      }
    });
  
    it('should not upload a policy if not executed by insurance company', async () => {
      try {
        await instance.uploadPolicy('Gold', 100, 10, { from: accounts[1] });
      } catch (error) {
        assert.equal(error.message, 'VM Exception while processing transaction: revert Only the insurance can execute this function.', 'Unexpected error message');
      }
    });
  });