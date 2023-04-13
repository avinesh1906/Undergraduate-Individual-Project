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
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const web3Address = await web3Signer.getAddress();

        console.log('Connected to MetaMask with address:', web3Address);
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAddress(web3Address);
      } catch (err) {
        console.log(err);
        window.alert('Failed to connect to MetaMask');
      }
    } else {
      window.alert('Please install MetaMask to use this app');
    }
  };

  const disconnectWeb3 = async () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
  };

  useEffect(() => {
    if (provider && signer && address) {
      console.log('Using cached provider, signer, and address:', provider, signer, address);
    } else {
      connectWeb3();
    }
  }, [provider, signer, address]);

  // Reconnect to the web3 provider on page reload
  useEffect(() => {
    const handlePageReload = () => {
      if (provider && signer && address) {
        window.location.reload();
      }
    };
    window.addEventListener('beforeunload', handlePageReload);
    return () => window.removeEventListener('beforeunload', handlePageReload);
  }, [provider, signer, address]);

  const contextValue = useMemo(() => {
    return { provider, signer, address, connectWeb3, disconnectWeb3 };
  }, [provider, signer, address]);

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};
