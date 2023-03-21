import React, { createContext, useState, useEffect, useContext } from 'react';
import { Web3Context } from './Web3Context';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('isLoggedIn') === 'true' || false
  );
  const [isWalletConnected, setIsWalletConnected] = useState(
    sessionStorage.getItem('isWalletConnected') === 'true' || false
  );
  const [username, setUsername] = useState(
    sessionStorage.getItem('username') || ''
  );
  const { connectWeb3, disconnectWeb3 } = useContext(Web3Context);

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
    sessionStorage.setItem('isWalletConnected', isWalletConnected);
    sessionStorage.setItem('username', username);
  }, [isLoggedIn, isWalletConnected, username]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const connectWallet = async () => {
    // handle connect wallet action
    try {
        // connect to wallet here
        await connectWeb3();
        setIsWalletConnected(true);
      } catch (error) {
        console.log('Error connecting to wallet:', error);
        // handle error here
      }
  };

  const disconnectWallet = async () => {
    await disconnectWeb3();
    setIsWalletConnected(false);
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, isWalletConnected, username, login, logout, connectWallet, disconnectWallet, setUsername }}
    >
      {children}
    </UserContext.Provider>
  );
};


