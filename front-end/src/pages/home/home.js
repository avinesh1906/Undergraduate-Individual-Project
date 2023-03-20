import React, {useContext} from 'react';
import './styles.css';
import HomePageLogo from '../../images/homepage.jpg';
import { UserContext } from '../../UserContext';
import { useNavigate  } from "react-router-dom";

const Home = () => {  
  const navigate  = useNavigate();
  const {
    isWalletConnected,
    connectWallet
  } = useContext(UserContext);

  const navigateToSignUp = () => {
    navigate("/login");
  };

  return (
    <div className="u-body u-xl-mode">
      <section className="u-align-center u-clearfix u-palette-5-light-2 u-section-1" id="carousel_6872">
        <div className="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-sm u-valign-middle-xs u-sheet-1">
          <div className="u-expanded-width u-gradient u-shape u-shape-rectangle u-shape-1"></div>
          <div className="u-clearfix u-layout-wrap u-layout-wrap-1">
            <div className="u-layout">
              <div className="u-layout-row">
                <div className="u-container-style u-layout-cell u-left-cell u-size-24 u-white u-layout-cell-1">
                  <div className="u-container-layout u-container-layout-1">
                    <p className="u-align-left u-text u-text-1" spellCheck="false">Experience the power of blockchain technology with our medical insurance dApp. </p>
                    <h3 className="u-custom-font u-font-oswald u-text u-text-palette-3-light-1 u-text-2" spellCheck="false">MediSure</h3>
                    <div className="u-gradient u-shape u-shape-rectangle u-shape-2"></div>
                    <p className="u-align-justify u-text u-text-3"> Our innovative solution provides a secure and transparent system for managing your healthcare claims and data,&nbsp; giving you peace of mind and better healthcare outcomes. <br />
                      <br />Join us today and experience the future of medical insurance!
                    </p>
                    {isWalletConnected ? (
                      <button onClick={navigateToSignUp} className="u-btn u-button-style u-grey-10 u-btn-1">SIGN UP</button>
                    ) : (
                      <button onClick={connectWallet} className="u-btn u-button-style u-grey-10 u-btn-1">Connect to wallet</button>
                    )}
                  </div>
                </div>
                <div className="u-container-style u-layout-cell u-right-cell u-size-36 u-white u-layout-cell-2">
                  <div className="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xl u-valign-top-xs u-container-layout-2">
                    <img className="u-expanded-width u-image u-image-contain u-image-1" src={HomePageLogo} data-image-width="1200" data-image-height="1200" alt="MediSure" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
