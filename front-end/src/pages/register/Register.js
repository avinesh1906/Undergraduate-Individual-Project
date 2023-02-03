import React, { useState } from 'react';
// import { Contract, Signer } from 'ethers';
// import artifact from 'C:\Users\avine\OneDrive - Middlesex University\Documents\MDX\Year 3\CST3990 Undergraduate Individual Project\code\back-end\build\contracts\individual.json';

const {ethers} = require("ethers");
// const provider = new ethers.providers.InfuraProvider('goerli', '4da996a80bb64ba594118689db3208a7');
// const signer = provider.getSigner();

// const contractAddress = artifact.networks['5777'].address;
// const contract = new Contract(contractAddress, artifact.abi, provider);

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // async function registerIndividual(firstName, lastName, username, email, password) {
  //   const result = await contract.registerUser(firstName, lastName, username,email, password);
  //   console.log(result);
  // }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission
    // registerIndividual(firstName, lastName, username, email, password)
    setFirstName("");
  };

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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Register;
