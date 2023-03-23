import React, { useContext } from 'react';
import { useNavigate, Link  } from "react-router-dom";
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
    loggedMemberType
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
    await disconnectWallet();
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
              {loggedMemberType === 'insurance' && (
                <>
                  <Link to="/view_all" className="nav-link" aria-current="page">Home</Link>
                  <Link to="/view_health_contracts" className="nav-link"> View Health Contracts</Link>
                  <Link to="/upload_health_contract" className="nav-link"> Upload Health Contract</Link>
                </>
              )}
              {loggedMemberType === 'individual' && (
                <>
                  <Link to="/view_claim" className="nav-link" aria-current="page">Claim</Link>
                  <Link to="/view_signed_contract" className="nav-link" aria-current="page">Signed Contract</Link>
                  <Link to="/sign_health_contract" className="nav-link">Health Contract</Link>
                  <Link to="/submit_claim" className="nav-link">Submit Claim</Link>
                </>
              )}
              {loggedMemberType === 'health_organization' && (
                <>
                  <Link to="/request_claim" className="nav-link">Request Claim</Link>
                </>
              )}
            </Nav>
            <div className="nav-user-container">
              <Nav className="me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
                <Nav.Link style={{ 'textAlign': 'center' }}>
                  Logged as
                  <br/>
                  <span> {username}</span>
                </Nav.Link>
                <Nav.Link>
                  <button className="btn btn-outline-success" onClick={handleLogout}>Sign Out</button>
                </Nav.Link>
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