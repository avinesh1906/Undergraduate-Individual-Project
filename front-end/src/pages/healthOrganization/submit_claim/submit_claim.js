import { ethers } from 'ethers';
import React, { useState, useContext } from 'react';
import contractAddresses from '../../../config';
import IndividualContract from '../../../contracts/individual.json';
import { Web3Context } from '../../../Web3Context';
import ClaimContract from '../../../contracts/ClaimContract.json';

const IndividualContractAddress = contractAddresses.Individual;
const ClaimContractAddress = contractAddresses.ClaimContract;

const SubmitClaim = () => {
  const [individuals, setIndividuals] = useState([]);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [claimAmount, setClaimAmount] = useState(0);
  let { signer } = useContext(Web3Context);


    const loadIndividualList = async () => {
      try {
        const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
        const individuals = await individualContract.getAllIndividuals();
        setIndividuals(individuals);
      } catch (error) {
        console.log(error);
      }
    };

  const handleIndividualSelect = (individual) => {
    setSelectedIndividual(individual);
  };

  const submitTheClaim = async () => {
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    await claimContract.submitClaim(selectedIndividual.individualAddress, claimAmount, selectedIndividual.healthContractId);

  }

  const handleSubmit = (event) => {
    event.preventDefault();

    submitTheClaim();
  };

  return (
    <div>
      <button onClick={loadIndividualList}>Load Individuals</button>
      <h1>Health Organization</h1>
      <h2>Individuals</h2>
      <ul>
        {individuals.map(individual => (
          <li key={individual.id} onClick={() => handleIndividualSelect(individual)}>
            {individual.first_name} {individual.last_name}
          </li>
        ))}
      </ul>
      {selectedIndividual && (
        <div>
          <h3>Selected Individual</h3>
          <p>{selectedIndividual.first_name} {selectedIndividual.last_name}</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="claimAmount">Claim Amount:</label>
            <input type="number" id="claimAmount" value={claimAmount} onChange={(event) => setClaimAmount(event.target.value)} />
            <button type="submit">Submit Claim</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SubmitClaim;
