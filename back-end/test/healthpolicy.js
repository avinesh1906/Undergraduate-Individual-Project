var HealthPolicy = artifacts.require('./HealthPolicy.sol');

contract('HealthPolicy', (accounts) => {
    let instance;
  
    beforeEach(async () => {
      instance = await HealthPolicy.new();
    });
  
    it('should set the insurance company address', async () => {
      // Set the insurance company address using account 0
      await instance.setInsuranceCompanyAddress({ from: accounts[0] });
    
      // Retrieve the insurance company address from the contract
      const insuranceCompanyAddress = await instance.getInsuranceCompanyAddress();
    
      // Check if the retrieved insurance company address matches the address used to set it
      assert.equal(insuranceCompanyAddress, accounts[0], 'Insurance company address does not match');
    });
    
  
    it("should upload a health insurance policy", async () => {
        await instance.setInsuranceCompanyAddress({ from: accounts[0] });
        const coverageType = "Diamond";
        const coverageLimit = 1000000;
        const premium = 500;
    
        // Upload the policy
        await instance.uploadPolicy(coverageType, premium, coverageLimit, coverageLimit, coverageLimit, false, { from: accounts[0] });
    
        // Check if policy was uploaded
        const policy = await instance.getHealthContract(1);
        assert.equal(parseInt(policy.dental), coverageLimit, "Coverage limit does not match");
        assert.equal(parseInt(policy.eyeCare), coverageLimit, "Coverage limit does not match");
        assert.equal(parseInt(policy.generalCare), coverageLimit, "Coverage limit does not match");
        assert.equal(policy.coverageType, coverageType, "Coverage type does not match");
        assert.equal(parseInt(policy.premium), premium, "Premium does not match");
    });
  
    it('should not upload a policy if coverage already exists', async () => {
      await instance.setInsuranceCompanyAddress({ from: accounts[0] });
      const coverageType = 'Diamond';
      const coverageLimit = 100;
      const premium = 10;
  
      await instance.uploadPolicy(coverageType, premium, coverageLimit, coverageLimit, coverageLimit, false, { from: accounts[0] });
      
      try {
        await instance.uploadPolicy(coverageType, premium, coverageLimit, coverageLimit, coverageLimit, false, { from: accounts[0] });
        assert.fail('Expected to throw');
      } catch (error) {
        assert.include(error.message, 'Coverage already exits');
      }
    });
  
    it('should not upload a policy if not executed by insurance company', async () => {
      const coverageType = 'Diamond';
      const coverageLimit = 100;
      const premium = 10;
      try {
        await instance.uploadPolicy(coverageType, premium, coverageLimit, coverageLimit, coverageLimit, false, { from: accounts[5] });
        assert.fail('Expected to throw');
      } catch (error) {
        assert.include(error.message, 'Only the insurance can execute this function.');
      }
    });
  });