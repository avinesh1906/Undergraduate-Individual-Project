import React, { useState, useContext } from 'react';
import { Web3Context } from '../../Web3Context';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // change state based on user's authentication status
  const { address, connectWeb3 } = useContext(Web3Context);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleLogin = () => {
    // handle login action
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // handle logout action
    setIsLoggedIn(false);
  };

  const handleConnectWallet = async  () => {
    // handle connect wallet action
    try {
      // connect to wallet here
      // await connectWeb3();
      // if (address != null) { setIsWalletConnected (!isWalletConnected); }
      setIsWalletConnected(true);
      console.log("Account:", address);
    } catch (error) {
      console.log('Error connecting to wallet:', error);
      // handle error here
    }
  }

  const handleDisconnectWallet = async () => {
    setIsWalletConnected(false);
  }

  return (
    <nav>
      <div className="logo">
        <img src="logo.png" alt="Logo" />
        <span>DApp Name</span>
      </div>
      <div className="right">
        {!isLoggedIn && !isWalletConnected && <button onClick={handleConnectWallet}>Connect to Wallet</button>}
        {isWalletConnected && !isLoggedIn && (
          <>
            <button onClick={handleDisconnectWallet}>Disconnect from Wallet</button>
            <button onClick={handleLogin}>Log In</button>
          </>
        )}
        {isWalletConnected && isLoggedIn && <button onClick={handleLogout}>Log Out</button>}
      </div>
    </nav>
  );
};

export default Navbar;