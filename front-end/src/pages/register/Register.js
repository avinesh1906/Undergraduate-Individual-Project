import { ethers } from 'ethers';
import React, { useState, useContext } from 'react';
import IndividualContract from '../../contracts/individual.json';
import HealthOrganizationContract from '../../contracts/HealthOrganization.json';
import InsuranceContract from '../../contracts/insuranceprovider.json';
import HealthPolicyContract from '../../contracts/HealthPolicy.json'
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';

const IndividualContractAddress = contractAddresses.Individual;
const HealthOrganizationContractAddress = contractAddresses.HealthOrganization;
const InsuranceProviderAddress = contractAddresses.InsuranceProvider;
const HealthPolicyAddress = contractAddresses.HealthPolicy;

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

  const [showInsuranceInput, setShowInsuranceInput] = useState(false);
  const [showHealthOrganizationInput, setShowHealthOrganizationInput] = useState(false);

  async function getIndividual(individualContract) {
    const response = await individualContract.getIndividual(0);
    console.log(response);
  }

  async function getHealthOrganization(healthOrganizationContract) {
    const response = await healthOrganizationContract.getHealthOrganization();
    console.log(response);
  }

  async function getInsurance(insuranceContract) {
    const response = await insuranceContract.getInsuranceProvider();
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

  async function connectInsuranceAddress(){
    const eventSignature = ethers.utils.id("InsuranceAddressSetup(address");
    const healthContract = new ethers.Contract(HealthPolicyAddress, HealthPolicyContract.abi, signer);
    const tx  = await healthContract.setInsuranceCompanyAddress();
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

  async function registerHealthOrganization() {
    // Get the event signature
    const eventSignature = ethers.utils.id("LogRegisterdHO(string)");
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const tx  = await healthOrganizationContract.registerHealthOrganization(orgName,email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = healthOrganizationContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
    } else {
      console.log('Transaction failed');
    }

    getHealthOrganization(healthOrganizationContract);
  }

  async function registerInsurance() {
    // Get the event signature
    const eventSignature = ethers.utils.id("NewProvider(string, string)");
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const tx  = await insuranceContract.registerProvider(insName,email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = insuranceContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
      connectInsuranceAddress()
    } else {
      console.log('Transaction failed');
    }

    getInsurance(insuranceContract);
  }

  function handleChange(e) {
    handleMemberSelect(e.target.value);
    setMemberType(e.target.value);
  }


  async function handleMemberSelect(value){
    if (value === "health_organization"){
      isHealthOrganizationRegistered();
    } else if (value === "insurance"){
      isInsuranceRegistered();
    }
  }

  async function isHealthOrganizationRegistered(){
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const response  = await healthOrganizationContract.isHealthOrganizationRegistered();
    setShowHealthOrganizationInput(!response);   
  }

  async function isInsuranceRegistered(){
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const response  = await insuranceContract.isInsuranceRegistered();
    setShowInsuranceInput(!response);   
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
          onChange={handleChange}
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
      {((memberType === 'health_organization' && showHealthOrganizationInput) || (memberType === 'insurance' && showInsuranceInput)) && (
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
      {((memberType === 'health_organization' && showHealthOrganizationInput) || memberType === 'individual' || (memberType === 'insurance' && showInsuranceInput)) && (
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
