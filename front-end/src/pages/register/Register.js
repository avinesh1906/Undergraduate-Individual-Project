import { ethers } from 'ethers';
import React, { useState } from 'react';
import Individual from '../../contracts/individual.json';

const IndividualContractAddress = '0x303436626f2EC900060006EEE8f59fbd74313DDf';
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
    alert("Connected: " + address);
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
  
  async function registerIndividual() {
    const individualContract = new ethers.Contract(IndividualContractAddress, Individual.abi, signer);
    // const reponse = await individualContract.registerProvider(firstName, lastName, password, email, password);
    const reponse = await individualContract.registerProvider("avi", "culloo", "Avi1906", "avi@gmail.com", "123");
    console.log(reponse);
    
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
