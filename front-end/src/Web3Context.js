import React, { createContext, useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';

// Create a new context to store the provider, signer, and address variables
export const Web3Context = createContext();

// Create a provider component that will wrap the App component
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  // Connect to the Web3 provider and update the context state
  const connectWeb3 = async () => {
    // check if MetaMask is installed
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Prompt user for account connections
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum); // create a new web3 provider object
        const web3Signer = web3Provider.getSigner(); // get the signer object from the provider
        const web3Address = await web3Signer.getAddress(); // get the current user's Ethereum address

        console.log('Connected to MetaMask with address:', web3Address); // log the address to the console
        setProvider(web3Provider); // set the provider state variable to the new provider object
        setSigner(web3Signer); // set the signer state variable to the new signer object
        setAddress(web3Address); // set the address state variable to the user's Ethereum address
      } catch (err) {
        console.log(err); // log any errors that occur
        window.alert('Failed to connect to MetaMask'); // show an alert if there is an error
      }
    } else {
      window.alert('Please install MetaMask to use this app'); // show an alert if MetaMask is not installed
    }
  };

  const disconnectWeb3 = async () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
  };

  // Check if provider, signer, and address are already cached in state. If they are, log a message to the console.
  // Otherwise, call the connectWeb3 function to connect to the Web3 provider.
  useEffect(() => {
    if (provider && signer && address) {
      console.log('Using cached provider, signer, and address:', provider, signer, address);
    } else {
      connectWeb3();
    }
  }, [provider, signer, address]);
  
  // Reconnect to the web3 provider on page reload
  // Add an event listener for the "beforeunload" event to reload the page if provider, signer, and address are already cached.
  useEffect(() => {
    const handlePageReload = () => {
      if (provider && signer && address) {
        window.location.reload();
      }
    };
    window.addEventListener('beforeunload', handlePageReload);
    return () => window.removeEventListener('beforeunload', handlePageReload);
  }, [provider, signer, address]);
  
  // Create a memoized context value object with the current values of provider, signer, address, connectWeb3, and disconnectWeb3.
  const contextValue = useMemo(() => {
    return { provider, signer, address, connectWeb3, disconnectWeb3 };
  }, [provider, signer, address]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};
