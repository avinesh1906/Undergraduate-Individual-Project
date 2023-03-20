import React, { createContext, useState, useContext } from 'react';
import { Web3Context } from './Web3Context';
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [username, setUsername] = useState('');
  const {connectWeb3} = useContext(Web3Context);

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


