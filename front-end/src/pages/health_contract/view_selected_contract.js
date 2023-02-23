import { ethers } from "ethers";
import React, { useState, useContext } from 'react';
import { Web3Context } from '../../Web3Context';
import HealthPolicyContract from '../../contracts/HealthPolicy.json'
import contractAddresses from '../../config';
import IndividualContract from '../../contracts/individual.json';

const HealthPolicyAddress = contractAddresses.HealthPolicy;
const IndividualContractAddress = contractAddresses.Individual;

const ViewSignedContract = () => {
  const { signer } = useContext(Web3Context);
  const [contract, setContract] = useState();
  
  const loadContract = async () => {
    try {
      const contract = new ethers.Contract(
        HealthPolicyAddress,
        HealthPolicyContract.abi,
        signer
      );
    	const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
			const individualByContractID =  individualContract.getHealthContract();
      const signedContract = await contract.getHealthContract(individualByContractID);

      setContract(signedContract);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <button onClick={loadContract}>Load Contract</button>
      {contract &&
        <div>
          <p>Coverage Type: {contract.coverageType}</p>
          <p>Coverage Limit: {contract.coverageLimit}</p>
          <p>Premium: {contract.premium}</p>
        </div>
      }
    </div>
  );
};
  
export default ViewSignedContract;
