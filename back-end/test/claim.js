const ClaimContract = artifacts.require("./ClaimContract.sol");
const HealthPolicy = artifacts.require("./HealthPolicy.sol");

contract("ClaimContract", async accounts => {
  let contract;
  let healthOrganizationAddress;
  let individualAddress;
  let healthContractId;
  const username = 'healthOrg1';
  const individual = 'alice';
  const claimAmount = 1000;


  beforeEach(async () => {
    contract = await ClaimContract.new();
    healthOrganizationAddress = accounts[0];
    individualAddress = accounts[1];
    

    await contract.setInsuranceCompanyAddress({ from: accounts[2] });
    const coverageType = "Diamond";
    const premium = 10;
    // Upload the policy
    await contract.uploadPolicy(coverageType, premium, claimAmount, claimAmount, claimAmount, false, { from: accounts[2] });
    const policy = await contract.getHealthContract(1,  { from: accounts[2] });
    healthContractId = parseInt(policy.healthcontractID);
    await contract.setHealthOrganizationAddress({ from: healthOrganizationAddress});
  });

  it("should submit a single claim by the health organization", async () => {
    await contract.submitClaim(username, individual, claimAmount, healthContractId, "eyeCare",{ from: accounts[0] });

    // Check that the claim was added to the list of claims
    const claim = await contract.claims(0);
    assert.equal(claim.requester, username);
    assert.equal(claim.claimant, individual);
    assert.equal(claim.claimAmount.toNumber(), claimAmount);
    assert.equal(claim.status.toNumber(), 0);
  });

  it("should submit multiple claims of different type by the health organization", async () => {
    await contract.submitClaim(username, individual, claimAmount, healthContractId, "eyeCare",{ from: accounts[0] });
    await contract.submitClaim(username, individual, claimAmount, healthContractId, "dentalCare",{ from: accounts[0] });
    await contract.submitClaim(username, individual, claimAmount, healthContractId, "generalCare ",{ from: accounts[0] });

    // Check that the claim was added to the list of claims
    const claim = await contract.claims(0);
    assert.equal(claim.requester, username);
    assert.equal(claim.claimant, individual);
    assert.equal(claim.claimAmount.toNumber(), claimAmount);
    assert.equal(claim.status.toNumber(), 0);
    assert.equal(claim.healthContract.eyeCare, claimAmount);
    assert.equal(claim.healthContract.dental, claimAmount);
    assert.equal(claim.healthContract.generalCare, claimAmount);

  });

  it("should not submit a claim by the health organization", async () => {
    await contract.submitClaim(username, individual, claimAmount, healthContractId, "dentalCare",{ from: accounts[0] });

    try {
      await contract.submitClaim(username, individual, claimAmount, healthContractId, "dentalCare", { from: accounts[0] });
      assert.fail('Expected to throw');
    } catch (error) {
      assert.include(error.message, 'You have already submitted a claim for this claim type.');
    }
  });

  it("should request a claim by the individual", async () => {
    await contract.requestClaim(individual, claimAmount, healthContractId, "generalCare", { from: individualAddress });

    const claim = await contract.claims(0);
    assert.equal(claim.requester, individual);
    assert.equal(claim.claimant, individual);
    assert.equal(claim.claimAmount.toNumber(), claimAmount);
    assert.equal(claim.status.toNumber(), 0);
  });

  it("should not request a claim by the individual", async () => {
    await contract.requestClaim(individual, claimAmount, healthContractId, "generalCare", { from: individualAddress });
    try {
      await contract.requestClaim(individual, claimAmount, healthContractId, "generalCare", { from: individualAddress });
      assert.fail('Expected to throw');
    } catch (error) {
      assert.include(error.message, 'You have already submitted a claim for this claim type.');
    }
  });

  it("should approve a requested claim by the individual", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, true, { from: accounts[2] });
    await contract.requestClaim(individual, 5, 2, "generalCare", { from: individualAddress });

    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 1);
  });

  it("should approve an insurance request", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, false, { from: accounts[2] });
    await contract.requestClaim(individual, 5, 2, "generalCare", { from: individualAddress });
    await contract.adminApproval(0);
    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 1);
  });

  it("should disapprove an insurance request", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, false, { from: accounts[2] });
    await contract.requestClaim(individual, 5, 2, "generalCare", { from: individualAddress });
    await contract.adminDisapproval(0);
    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 2);
  });

  it("should approve a submitted claim by the HIO", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, true, { from: accounts[2] });
    await contract.submitClaim(username,individual, 6, 2, "generalCare", { from: accounts[0] });

    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 1);
  });

  it("should not approve a submitted claim by the HIO", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, true, { from: accounts[2] });
    await contract.submitClaim(username,individual, 10000, 2, "generalCare", { from: accounts[0] });

    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 2);
  });
  
  it("should not approve a requested claim by the individual", async () => {
    // Upload another policy
    await contract.uploadPolicy("coverageType", 10, claimAmount, claimAmount, claimAmount, true, { from: accounts[2] });
    await contract.requestClaim(individual, 100000, 2, "generalCare", { from: individualAddress });

    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 2);
  });

  it("should return all claims", async () => {
    await contract.submitClaim(username, individual, claimAmount, 2, { from: accounts[0] });
    await contract.requestClaim(individual, claimAmount, 3, { from: individualAddress });
    
    const claims = await contract.getAllClaims({from: accounts[2]});
    assert.equal(claims.length, 2);
  });

  it("should return the health organization's claims", async () => {
    await contract.submitClaim(username, individual, claimAmount, 4, { from: accounts[0] });
    await contract.requestClaim(individual, claimAmount, 5, { from: individualAddress });
    
    const claims = await contract.getOrganizationClaims(username, { from: healthOrganizationAddress });
    assert.equal(claims.length, 1);
  });

  it("should return the individual's claims", async () => {
    await contract.submitClaim(username, individual, claimAmount, 6, { from: accounts[0] });
    await contract.requestClaim(individual, claimAmount, 7, { from: individualAddress });

    const claims = await contract.getIndividualClaims(individual,{ from: individualAddress });
    assert.equal(claims.length, 2);
    assert.equal(claims[0].claimAmount, claimAmount);
  });

  it("should return error message when claim array is empty", async () => {
      let claimId = 1;

      try {
        // Attempt to approve an empty submitted claim array
        await contract.approveClaim(claimId, { from: accounts[6] });
        assert.fail();
      } catch (error) {
        assert.include(
          error.message,
          "Claims array is empty",
          "The correct error message was not thrown"
        );
      }
    });

  it("should not approve a claim that does not exist", async () => {
    await contract.submitClaim(username, individual, claimAmount, healthContractId, { from: accounts[0] });
    
    let claimId = 10;

    try {
      // Attempt to approve a non-existent claim
      await contract.approveClaim(claimId, { from: accounts[6] });
      assert.fail();
    } catch (error) {
      assert.include(
        error.message,
        "Claim with this id does not exist.",
        "The correct error message was not thrown"
      );
    }
  });
  
  it("should not approve a claim that has already been approved or denied", async () => {
    let claimId = 0;
    let claimAmount = 4;

    // Submit the claim
    await contract.submitClaim(username, individual, claimAmount, healthContractId, { from: accounts[0] });

    // Approve the claim
    await contract.approveClaim(claimId);

    try {
      // Attempt to approve the claim again
      await contract.approveClaim(claimId);
      assert.fail();
    } catch (error) {
      assert.include(
        error.message,
        "The claim has already been approved or denied.",
        "The correct error message was not thrown"
      );
    }
  });
});
