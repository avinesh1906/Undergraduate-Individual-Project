const ClaimContract = artifacts.require("./ClaimContract.sol");
const HealthPolicy = artifacts.require("./HealthPolicy.sol");

contract("ClaimContract", async accounts => {
  let contract;
  let healthOrganizationAddress;
  let individualAddress;
  let healthContractId;

  beforeEach(async () => {
    contract = await ClaimContract.new();
    healthOrganizationAddress = accounts[0];
    individualAddress = accounts[1];
    

    await contract.setInsuranceCompanyAddress(accounts[2]);
    const coverageType = "Diamond";
    const coverageLimit = 1000;
    const premium = 10;
    // Upload the policy
    await contract.uploadPolicy(coverageType, coverageLimit, premium, { from: accounts[2] });
    const policy = await contract.getHealthContract(1,  { from: accounts[2] });
    healthContractId = parseInt(policy.healthcontractID);
    await contract.setHealthOrganizationAddress(healthOrganizationAddress);
  });

  it("should submit a claim by the health organization", async () => {
    await contract.submitClaim(individualAddress, 100, healthContractId, { from: healthOrganizationAddress });

    const claim = await contract.claims(0);
    assert.equal(claim.requester, healthOrganizationAddress);
    assert.equal(claim.claimAmount.toNumber(), 100);
    assert.equal(claim.status.toNumber(), 0);
  });

  it("should request a claim by the individual", async () => {
    await contract.requestClaim(100, healthContractId, { from: individualAddress });

    const claim = await contract.claims(0);
    assert.equal(claim.requester, individualAddress);
    assert.equal(claim.claimAmount.toNumber(), 100);
    assert.equal(claim.status.toNumber(), 0);
  });

  it("should approve a claim", async () => {
    await contract.submitClaim(individualAddress, 50, healthContractId, { from: healthOrganizationAddress });

    await contract.approveClaim(0, { from: individualAddress });
    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 1);
  });
  it("should deny a claim", async () => {
    // Submit the claim
    await contract.submitClaim(individualAddress, 1500, healthContractId, { from: healthOrganizationAddress });

    // Approve the claim
    await contract.approveClaim(0, { from: individualAddress });

    // Check if the claim has been denied
    const claim = await contract.claims(0);
    assert.equal(claim.status.toNumber(), 2);
  });

  it("should return all claims", async () => {
    await contract.submitClaim(individualAddress, 100, healthContractId, { from: healthOrganizationAddress });
    await contract.submitClaim(accounts[3], 200, healthContractId, { from: healthOrganizationAddress });

    const claims = await contract.getAllClaims({from: accounts[2]});
    assert.equal(claims.length, 2);
  });

  it("should return the health organization's claims", async () => {
    await contract.submitClaim(individualAddress, 100, healthContractId, { from: healthOrganizationAddress });
    await contract.submitClaim(accounts[4], 200, healthContractId, { from: healthOrganizationAddress });

    const claims = await contract.getOrganizationClaims({ from: healthOrganizationAddress });
    assert.equal(claims.length, 2);
  });

  it("should return the individual's claims", async () => {
    await contract.submitClaim(individualAddress, 100, healthContractId, { from: healthOrganizationAddress });
    await contract.requestClaim(300, healthContractId, { from: accounts[5] });

    const claims = await contract.getIndividualClaims({ from: accounts[5] });
    assert.equal(claims.length, 1);
    assert.equal(claims[0].claimAmount, 300);
  });
});
