import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import { Web3Context } from "../../Web3Context";
import HealthPolicyContract from "../../contracts/HealthPolicy.json";
import IndividualContract from '../../contracts/individual.json';
import contractAddresses from "../../config";

const HealthPolicyAddress = contractAddresses.HealthPolicy;
const IndividualContractAddress = contractAddresses.Individual;

const ChooseHealthContract = () => {
  const { signer } = useContext(Web3Context);
  const [healthContracts, setHealthContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  const loadContracts = async () => {
    try {
      const contract = new ethers.Contract(
        HealthPolicyAddress,
        HealthPolicyContract.abi,
        signer
      );

      const allContracts = await contract.getAllHealthContracts();
      setHealthContracts(allContracts);
    } catch (error) {
      console.log(error);
    }
  };

  const selectContract = (contractId) => {
    console.log(contractId);
    setSelectedContract(contractId);
  };

  const submit = async () => {
    try {
    	const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);

      await individualContract.signHealthContract(selectedContract);

      // Do something after the contract is signed, like redirecting to a dashboard
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={loadContracts}>Load Contracts</button>
      {healthContracts.length > 0 &&
        healthContracts.map((contract, index) => (
          <div key={index}>
            <p>Coverage Type: {contract.coverageType}</p>
            <p>Coverage Limit: {contract.coverageLimit}</p>
            <p>Premium: {contract.premium}</p>
            <button onClick={() => selectContract(contract.healthcontractID)}>Select</button>
          </div>
        ))}
      {selectedContract && (
        <button onClick={submit}>Sign Contract</button>
      )}
    </div>
  );
};

export default ChooseHealthContract;
