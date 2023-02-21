import { ethers } from 'ethers';
import React, { useState, useContext } from 'react';
import IndividualContract from '../../contracts/individual.json';
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';

const IndividualContractAddress = contractAddresses.Individual;

const Register = () => {
  const [memberType, setMemberType] = useState('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [insName, setInsName] = useState('');
  const { provider, signer } = useContext(Web3Context);

  async function getIndividual(individualContract) {
    const response = await individualContract.getIndividual(0);
    console.log(response);
  }

  async function registerIndividual() {
    // Get the event signature
    const eventSignature = ethers.utils.id("LogInsuredPersonRegistered(uint32,string)");
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    const tx  = await individualContract.registerIndividual(firstName, lastName, username, email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = individualContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
    } else {
      console.log('Transaction failed');
    }

    getIndividual(individualContract);
  }

  async function registerHealthOrganization() {

  }

  async function registerInsurance() {

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission
    // handle form submission based on member type
    if (memberType === 'individual') {
      console.log('Individual member details:', {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      registerIndividual();
    } else if (memberType === 'health_organization') {
      console.log('Health organization member details:', {
        orgName,
        email,
        password,
      });
      registerHealthOrganization();
    } else if (memberType === 'insurance') {
      console.log('Insurance member details:', {
        insName,
        email,
        password,
      });
      registerInsurance();
    }
  }
  return (
<form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="memberType">Member Type:</label>
        <select
          id="memberType"
          value={memberType}
          onChange={(e) => setMemberType(e.target.value)}
        >
          <option value="individual">Individual</option>
          <option value="health_organization">Health Organization</option>
          <option value="insurance">Insurance</option>
        </select>
      </div>
      {memberType === 'individual' && (
        <>
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </>
      )}
      {(memberType === 'health_organization' || memberType === 'insurance') && (
        <>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={orgName || insName}
              onChange={(e) =>
                memberType === 'health_organization'
                  ? setOrgName(e.target.value)
                  : setInsName(e.target.value)
              }
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
