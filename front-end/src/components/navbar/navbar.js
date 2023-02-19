import React, { useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // change state based on user's authentication status

  const handleLogin = () => {
    // handle login action
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // handle logout action
    setIsLoggedIn(false);
  };

  return (
    <nav>
      <div className="logo">
        <img src="logo.png" alt="Logo" />
        <span>DApp Name</span>
      </div>
      <div className="right">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
          ) : (
          <button onClick={handleLogin}>Login</button>
        )}
        {isLoggedIn && <button>Connect to Wallet</button>}
      </div>
    </nav>
  );
};

export default Navbar;