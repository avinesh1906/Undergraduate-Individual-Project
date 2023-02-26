import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import { Web3Context } from "../../Web3Context";
import IndividualContract from '../../contracts/individual.json';
import contractAddresses from "../../config";
import ClaimContract from '../../contracts/ClaimContract.json';
import HealthPolicyContract from "../../contracts/HealthPolicy.json";

const ClaimContractAddress = contractAddresses.ClaimContract;
const IndividualContractAddress = contractAddresses.Individual;
const HealthPolicyAddress = contractAddresses.HealthPolicy;


const RequestClaim = () => {
  const { signer, provider } = useContext(Web3Context);
  const [claimAmount, setClaimAmount] = useState("");
  const [coverageLimit, setCoverageLimit] = useState("");
	const [premium, setPremium] = useState("");
	const [coverageType, setCoverageType] = useState("");

	const handleRequestClaim = async () => {
		const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
		const indiviualHealthContractID = await individualContract.getHealthContract();

    const eventSignature = ethers.utils.id("returnClaimID(uint)");		
		const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    const tx  = await claimContract.requestClaim(claimAmount, indiviualHealthContractID);
    const receipt  = await provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = claimContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
    } else {
      console.log('Transaction failed');
    }
	}

	const loadHealthContractID = async () => {
		const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
		const indiviualHealthContractID = await individualContract.getHealthContract();
		const healthContract = new ethers.Contract(
			HealthPolicyAddress,
			HealthPolicyContract.abi,
			signer
		);
		const healthContractById = await healthContract.getHealthContract(indiviualHealthContractID);
		console.log(healthContractById);
		setCoverageLimit(healthContractById[1]);
		setPremium(healthContractById[2]);
		setCoverageType(healthContractById[3]);
		
	}

  return (
    <div>
      <h1>Request Claim</h1>
			<button onClick={loadHealthContractID}>Load Health Contract</button>
			<div>
					<p>Coverage Type: {coverageType}</p>
          <p>Coverage Limit: {coverageLimit}</p>
          <p>Premium: {premium}</p>
			</div>
			<br />
      <label>
        Claim Amount:
        <input
          type="text"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleRequestClaim}>Request Claim</button>
    </div>
  );     
};

export default RequestClaim;