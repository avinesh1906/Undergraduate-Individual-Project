import { ethers } from 'ethers';
import React, { useState } from 'react';
import IndividualContract from '../../contracts/individual.json';

const IndividualContractAddress = '0x628cA7926793a8b147657c212F84D924D4467C5d';
let address, signer, provider;

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isConnected, toggleConnected] = useState(0);

  function setAddress(ethaddy) {
    address = ethaddy;
    if (address != null) {  toggleConnected ( !isConnected ); }
    console.log("Account:", address);
  }

  async function connectWallet() {
    // provider = new ethers.providers.Web3Provider(window.ethereum);
    // Prompt user for account connections
    // await provider.send("eth_requestAccounts", []);
    provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
    signer = provider.getSigner();
    setAddress( await signer.getAddress() );
    let balance = await signer.getBalance();
    console.log(await ethers.utils.formatEther(balance));
  }
  
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission
    if (!isConnected) {connectWallet()}
      else {registerIndividual()}
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">{(isConnected) ? 'Submit Form' : 'CONNECT WALLET'}</button>
    </form>
  );
};

export default Register;
