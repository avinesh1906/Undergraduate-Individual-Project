import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Create a new context to store the provider, signer, and address variables
export const Web3Context = createContext();


// Create a provider component that will wrap the App component
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(sessionStorage.getItem('provider') || null);
  const [signer, setSigner] = useState(sessionStorage.getItem('signer') || null);
  const [address, setAddress] = useState(sessionStorage.getItem('address') || null);

  useEffect(() => {
    sessionStorage.setItem('provider', provider);
    sessionStorage.setItem('signer', signer);
    sessionStorage.setItem('address', address);
  }, [provider, signer, address]);

	// Connect to the Web3 provider and update the context state
	const connectWeb3 = async () => {
		// provider = new ethers.providers.Web3Provider(window.ethereum);
    // Prompt user for account connections
    // await provider.send("eth_requestAccounts", []);
		const web3Provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545');
    const web3Signer = web3Provider.getSigner();
		const web3Address = await web3Signer.getAddress();

		setProvider(web3Provider);
		setSigner(web3Signer);
		setAddress(web3Address);
	};

	return (
    <Web3Context.Provider value={{ provider, signer, address, connectWeb3 }}>
      {children}
    </Web3Context.Provider>
  );
	
};