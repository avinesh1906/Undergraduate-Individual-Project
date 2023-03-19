import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import IndividualContract from '../../contracts/individual.json';
import HealthOrganizationContract from '../../contracts/HealthOrganization.json';
import InsuranceContract from '../../contracts/insuranceprovider.json';
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';
import { UserContext } from '../../UserContext';

const IndividualContractAddress = contractAddresses.Individual;
const HealthOrganizationContractAddress = contractAddresses.HealthOrganization;
const InsuranceProviderAddress = contractAddresses.InsuranceProvider;


const LoginForm = () => {
  const [memberType, setMemberType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signer } = useContext(Web3Context);
  const { username, setUsername } = useContext(UserContext);

  async function verifyIndividual(){
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    const response = await individualContract.authenticate(username, password);
    console.log(response);
  }

  async function verifyHealthOrganization(){
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const response = await healthOrganizationContract.authenticate(password);
    console.log(response);
  }

  async function verifyInsurance(){
    const healthOrganizationContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const response = await healthOrganizationContract.authenticate(password);
    console.log(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login based on member type
    if (memberType === 'individual') {
      console.log('Individual login:', {
        username,
        password,
      });
      verifyIndividual();
    } else if (memberType === 'health_organization') {
      console.log('Organization login:', {
        email,
        password,
      });
      verifyHealthOrganization();
    } else {
      console.log('Insurance login:', {
        email,
        password,
      });
      verifyInsurance();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="memberType">Member Type:</label>
        <select
          id="memberType"
          value={memberType}
          onChange={(e) => setMemberType(e.target.value)}
        >
          <option value="">Select Member Type</option>
          <option value="individual">Individual</option>
          <option value="health_organization">Health Organization</option>
          <option value="insurance">Insurance</option>
        </select>
      </div>
      {memberType === 'individual' && (
        <>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        </>
      )}
      {(memberType === 'health_organization' || memberType === 'insurance') && (
        <>
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
        </>
      )}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;