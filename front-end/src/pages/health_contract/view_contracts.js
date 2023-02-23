import { ethers } from "ethers";
import React, { useState, useContext} from 'react';
import { Web3Context } from '../../Web3Context';
import HealthPolicyContract from '../../contracts/HealthPolicy.json'
import contractAddresses from '../../config';

const HealthPolicyAddress = contractAddresses.HealthPolicy;

const ViewContracts = () => {
    const { signer } = useContext(Web3Context);
    const [contracts, setContracts] = useState([]);
  
    const loadContracts = async () => {
      try {
        const contract = new ethers.Contract(
          HealthPolicyAddress,
          HealthPolicyContract.abi,
          signer
        );
  
        const allContracts = await contract.getAllHealthContracts();
        setContracts(allContracts);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div>
        <button onClick={loadContracts}>Load Contracts</button>
        {contracts.length > 0 &&
          contracts.map((contract, index) => (
            <div key={index}>
              <p>Coverage Type: {contract.coverageType}</p>
              <p>Coverage Limit: {contract.coverageLimit}</p>
              <p>Premium: {contract.premium}</p>
            </div>
          ))}
      </div>
    );
};
  
export default ViewContracts;
