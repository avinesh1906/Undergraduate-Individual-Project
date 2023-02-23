import { ethers } from "ethers";
import React, { useState, useContext } from 'react';
import { Web3Context } from '../../Web3Context';
import HealthPolicyContract from '../../contracts/HealthPolicy.json'
import contractAddresses from '../../config';

const HealthPolicyAddress = contractAddresses.HealthPolicy;

const UploadContract = () => {
    const [coverageType, setCoverageType] = useState('');
    const [coverageLimit, setCoverageLimit] = useState('');
    const [premium, setPremium] = useState('');
    const { provider, signer } = useContext(Web3Context);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      uploadHealthContract();
    };
    
    async function uploadHealthContract() {
        const eventSignature = ethers.utils.id("NewPolicy(uint256");
        const healthContract = new ethers.Contract(HealthPolicyAddress, HealthPolicyContract.abi, signer);
        const tx  = await healthContract.uploadPolicy(coverageType, coverageLimit, premium);
        const receipt  = await  provider.waitForTransaction(tx.hash);
        if (receipt.status === 1) {
            console.log('Transaction successful');
            // check the logs for the LogInsuredPersonRegistered event
            receipt.logs.forEach(log => {
            if (log.topics[0] === eventSignature) {
                const event = healthContract.interface.parseLog(log);
                console.log(event.args);
            }
            });
        } else {
            console.log('Transaction failed');
        }
    }

    return (
      <div>
        <h2>Upload Health Policy</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="coverageType">Coverage Type:</label>
          <input
            id="coverageType"
            type="text"
            value={coverageType}
            onChange={(e) => setCoverageType(e.target.value)}
          />
  
          <label htmlFor="coverageLimit">Coverage Limit:</label>
          <input
            id="coverageLimit"
            type="number"
            value={coverageLimit}
            onChange={(e) => setCoverageLimit(e.target.value)}
          />
  
          <label htmlFor="premium">Premium:</label>
          <input
            id="premium"
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
          />
  
          <button type="submit">Submit</button>
        </form>
      </div>
    );
};

export default UploadContract;