import React, { useState, useContext } from 'react';
import { Web3Context } from '../../Web3Context';
import { useNavigate  } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../images/logo.png';
import './styles.css';
import { UserContext } from '../../UserContext';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // change state based on user's authentication status
  const {connectWeb3} = useContext(Web3Context);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const navigate  = useNavigate();
  const { username } = useContext(UserContext);
  const handleLogin = () => {
    // handle login action
    setIsLoggedIn(true);
    navigate("/login");
  };

  const handleLogout = () => {
    // handle logout action
    setIsLoggedIn(false);
  };

  const handleConnectWallet = async  () => {
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

  const handleDisconnectWallet = async () => {
    setIsWalletConnected(false);
  }

  return (
      <Navbar expand="lg" bg="body-tertiary">
      <div className="container-fluid">
        <Navbar.Brand href="#">
          <img src={logo} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
          MediSure
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
            <Nav.Link href="#" className="nav-link active" aria-current="page">Home</Nav.Link>
            <Nav.Link href="#" className="nav-link">Health Contract</Nav.Link>
            <Nav.Link href="#" className="nav-link">Claim</Nav.Link>
          </Nav>
          
          {!isLoggedIn && !isWalletConnected && (
            <div className="connect-to-wallet">
            <button 
              id="connect-button"
              onClick={handleConnectWallet}
              className="btn btn-outline-primary"
            >
              Connect to wallet
            </button>
            </div>
          )}
          {isWalletConnected && !isLoggedIn && (
          <>
            <div className="disconnect-from-wallet">
              <button 
                id="disconnect-button"
                onClick={handleDisconnectWallet}
                className="btn btn-warning"

              >
                Disconnect from Wallet
              </button>
              </div>
              <div className="sign-in">
              <button 
                id="signin-button"
                onClick={handleLogin}
                className="btn btn-success"
              >
                Sign In
              </button>
              </div>
          </>
        )}
        {isWalletConnected && isLoggedIn && (
          <div className="nav-user-container">
            <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
              <Nav.Item>
                Logged as
                <span> {username}</span>
              </Nav.Item>
              <Nav.Item>
                <button className="btn btn-outline-success" onClick={handleLogout}>Sign Out</button>
              </Nav.Item>
            </Nav>
          </div>
        )}
          
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;