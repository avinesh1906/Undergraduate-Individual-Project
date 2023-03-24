import { ethers } from "ethers";
import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from '../../../Web3Context';
import ClaimContract from '../../../contracts/ClaimContract.json'
import contractAddresses from '../../../config';
import IndividualContract from '../../../contracts/individual.json';
import { useNavigate  } from "react-router-dom";
import "./styles.css";
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg'
import signedContract from '../../../images/view_contract/signedContract.png'
import { UserContext } from '../../../UserContext';

const ClaimContractAddress = contractAddresses.ClaimContract;
const IndividualContractAddress = contractAddresses.Individual;

const ViewSignedContract = () => {
  const { signer } = useContext(Web3Context);
  const [contract, setContract] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedContact, setIsSignedContact] = useState(false);

  const navigate  = useNavigate();
  const {username} = useContext(UserContext);
  useEffect(() => {
    const loadContract = async () => {
      setIsLoading(true);
      try {
        const contract = new ethers.Contract(
          ClaimContractAddress,
          ClaimContract.abi,
          signer
        );
        const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
        const individualByContractID =  individualContract.getHealthContract(username);
        const signedContract = await contract.getHealthContract(individualByContractID);
        setIsSignedContact(true);
        setContract(signedContract);
      } catch (error) {
        setIsSignedContact(false);
        console.log(error);
      }
      setIsLoading(false);
    };
    loadContract();
  }, [signer, username]);
  
  const signContract = () => {
    navigate("/sign_health_contract");
  }
  
  return (
    <>
      <div style={{ display: isLoading ? "none" : "block" }}>
        {isSignedContact ? (
          <div className="u-body u-xl-mode" data-lang="en">
            <section className="u-align-center u-clearfix u-section-8" id="carousel_4c41">
              <div className="u-clearfix u-sheet u-sheet-1">
                <h2 className="u-text u-text-black u-text-default u-text-1" spellCheck="false">Signed Health Contract<br /></h2>
                <div className="u-align-center u-container-style u-gradient u-group u-radius-50 u-shape-round u-group-1">
                  <div className="u-container-layout u-valign-top u-container-layout-1">
                    <img className="u-image u-image-default u-image-1" alt="" data-image-width="432" data-image-height="386" src={signedContract} />
                    <p className="u-text u-text-grey-80 u-text-2" spellCheck="false">{contract.coverageType}</p>
                    <div className="u-border-11 u-border-white u-line u-line-horizontal u-line-1"></div>
                    <p className="u-text u-text-black u-text-3" spellCheck="false">with a coverage Limit of Rs <span style={{ fontWeight: 700 }}>{contract.coverageLimit.toLocaleString()}</span><br /></p>
                    <p className="u-text u-text-4" spellCheck="false">and a premium of <span style={{ fontWeight: 700 }}>{contract.premium}</span>%<br /></p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ):(
          <div className="u-body u-xl-mode" data-lang="en">
            <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                <div className="u-clearfix u-sheet u-sheet-1">
                    <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Claim History<br /></h2>
                    <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any submitted claims.</p>
                    <button onClick={signContract} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">Sign health contract</button>
                    <p className="u-text u-text-3">Image from <button  className="u-active-none u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" target="_blank">Freepik</button><br /></p>    
                    <img className="u-image u-image-contain u-image-default u-image-2" src={notFound} alt="" data-image-width="1298" data-image-height="598" />
                </div>
            </section>
          </div>
        )}
      </div>
      <div className="loader-div-view-health-contracts">
        <div style={{ display: isLoading ? "block" : "none" }}>  
          <Loader/>
        </div>
      </div>
    </>

  );
};
  
export default ViewSignedContract;
