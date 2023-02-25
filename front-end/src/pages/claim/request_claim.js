import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import { Web3Context } from "../../Web3Context";
import IndividualContract from '../../contracts/individual.json';
import contractAddresses from "../../config";
import ClaimContract from '../../contracts/ClaimContract.json';

const ClaimContractAddress = contractAddresses.ClaimContract;
const IndividualContractAddress = contractAddresses.Individual;


const RequestClaim = () => {
  const { signer, provider } = useContext(Web3Context);
  const [claimAmount, setClaimAmount] = useState("");
  const [healthContractID, setHealthContractID] = useState("");

	const handleRequestClaim = async () => {
    const eventSignature = ethers.utils.id("returnClaimID(uint)");

		const insuranceContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
		const indiviualHealthContractID = await insuranceContract.getHealthContract();

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

  return (
    <div>
      <h1>Request Claim</h1>
      <label>
        Claim Amount:
        <input
          type="text"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
        />
      </label>
      <br />
      <label>
        Health Contract ID:
        <input
          type="text"
          value={healthContractID}
          onChange={(e) => setHealthContractID(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleRequestClaim}>Request Claim</button>
    </div>
  );     
};

export default RequestClaim;