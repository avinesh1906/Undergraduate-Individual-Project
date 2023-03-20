import React, { createContext, useState, useEffect, useContext } from 'react';
import { Web3Context } from './Web3Context';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true' || false
  );
  const [isWalletConnected, setIsWalletConnected] = useState(
    localStorage.getItem('isWalletConnected') === 'true' || false
  );
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
  );
  const { connectWeb3 } = useContext(Web3Context);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('isWalletConnected', isWalletConnected);
    localStorage.setItem('username', username);
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


