import React, { useContext, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../images/logo.jpg';
import './styles.css';
import { UserContext } from '../../UserContext';

const NavigationBar = () => {
  const navigate  = useNavigate();
  const {
    isLoggedIn,
    isWalletConnected,
    username,
    logout,
    connectWallet,
    disconnectWallet,
  } = useContext(UserContext);

  const handleLogin = () => {
    // handle login action
    navigate("/login");
  };

  const handleRegister = () => {
    // handle login action
    navigate("/register");
  };

  const handleLogout = () => {
    // handle logout action
    logout();
  };

  const handleConnectWallet = async  () => {
    // handle connect wallet action
    await connectWallet();
  };

  const handleDisconnectWallet = async () => { 
    disconnectWallet();
  }

  const handleLogoClick = () => {
    navigate("/");
  }

  return (
      <Navbar expand="lg" bg="body-tertiary" className="sticky-top">
      <div className="container-fluid">
        <Navbar.Brand>
          <img src={logo} onClick={handleLogoClick} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
          MediSure
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          
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
              {window.location.pathname === '/login' && (
                <div className="sign-in">
                  <button 
                    id="signin-button"
                    onClick={handleRegister}
                    className="btn btn-success"
                  >
                    Register
                  </button>
                </div>
              )}
              {window.location.pathname === '/register' && (
                <div className="sign-in">
                  <button 
                    id="signin-button"
                    onClick={handleLogin}
                    className="btn btn-success"
                  >
                    Sign In
                  </button>
                </div>
              )}
              {window.location.pathname === '/' && (
                <div className="sign-in">
                  <button 
                    id="signin-button"
                    onClick={handleLogin}
                    className="btn btn-success"
                  >
                    Sign In
                  </button>
                </div>
              )}
          </>
        )}
        {isWalletConnected && isLoggedIn && (
          <>
            <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
                      <Nav.Link href="#" className="nav-link active" aria-current="page">Home</Nav.Link>
                      <Nav.Link href="#" className="nav-link">Health Contract</Nav.Link>
                      <Nav.Link href="#" className="nav-link">Claim</Nav.Link>
                    </Nav>
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
          </>      
        )}
          
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;