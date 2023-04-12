import { ethers } from "ethers";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { Web3Context } from "../../../Web3Context";
import IndividualContract from '../../../contracts/individual.json';
import contractAddresses from "../../../config";
import ClaimContract from '../../../contracts/ClaimContract.json';
import './styles.css';
import { UserContext } from '../../../UserContext';
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg';
import { useNavigate } from "react-router-dom";
import picture from '../../../images/submit_claim/picture.jpg';

const ClaimContractAddress = contractAddresses.ClaimContract;
const IndividualContractAddress = contractAddresses.Individual;

const RequestClaim = () => {
  const { signer, provider } = useContext(Web3Context);
  const [claimAmount, setClaimAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasContract, setHasContract] = useState(false);
  const {username} = useContext(UserContext);
  const [healthServices, setHealthServices] = useState([]);
  const [claims, setClaims] = useState([]);
  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [healthContract, setHealthContract] = useState([]);
  const [individualHealthContracts, setIndividualHealthContracts] = useState([]);
  const [claimExists, isClaimExists] = useState(false);

    
  const loadIndividualClaims = useCallback(async () => {
    setIsLoading(true);
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    setClaims(await claimContract.getIndividualClaims(username));
  }, [signer, username]);

  const loadHealthContractID = useCallback(async () => {
    setIsLoading(true);
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    try {
      setIndividualHealthContracts(await individualContract.getHealthContracts(username));
      setHasContract(true);
      loadIndividualClaims();
    } catch (error) {
      setHasContract(false);
    }
  }, [signer, username, loadIndividualClaims]);

  useEffect(() => {
    const hasIndividualHealthContract = async () => {
      setIsLoading(true);
      loadHealthContractID();
      
      setIsLoading(false);
    } 
    hasIndividualHealthContract();
  }, [signer, username, loadHealthContractID]);

  const getHealthContract = async (contractID) => {
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    return claimContract.getHealthContract(contractID);
  }

  const handleHealthContracteSelect = (healthContract) => {
    setHealthContract(healthContract);
  };

  const handleRequestClaim = async () => {
    setIsSubmitLoading(true);
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    const indiviualHealthContractID = await individualContract.getHealthContract(username);

    const eventSignature = ethers.utils.id("returnClaimID(uint)");		
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    const tx  = await claimContract.requestClaim(username, claimAmount, indiviualHealthContractID);
    const receipt  = await provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        const event = claimContract.interface.parseLog(log);
        console.log(event.args);
        if (log.topics[0] === eventSignature) {
          const event = claimContract.interface.parseLog(log);
          console.log(event.args);
          
        }
        console.log('Transaction successful');
      });
    } else {
      console.log('Transaction failed');
    }
    setIsSubmitLoading(false);

  }

  const handleHealthServiceSelect = (healthService) => {
    setHealthServices(healthService);
    claims.forEach((claim) =>{
      if (claim.claimType === healthServices && claim.healthContract.healthcontractID === healthContract){
        isClaimExists(true);
      } else {
        isClaimExists(false);
      }
    });
  };
  
	
  const signHealthContract = () => {
    navigate("/individual/sign_health_contract");
  }

  return (
    <>
      <div style={{ display: isLoading ? "none" : "block" }}>
        <>
          {hasContract ? (
            <div className="u-body u-xl-mode" data-lang="en">
            <section className="u-clearfix u-valign-middle-xs u-section-10" id="sec-b1ce">
              <div className="u-expanded-height u-palette-1-base u-shape u-shape-rectangle u-shape-1"></div>
              <img src={picture} alt="" className="u-image u-image-default u-image-1" data-image-width="1200" data-image-height="800" />
              <div className="u-align-center u-container-style u-gradient u-group u-group-1">
                <div className="u-container-layout u-container-layout-1">
                  <h2 className="u-text u-text-1" spellCheck="false">SUBMIT A CLAIM<br /></h2>
                  <div className="u-align-left u-border-2 u-border-palette-4-light-3 u-form u-form-1">
                    <form className="u-clearfix u-form-spacing-28 u-form-vertical u-inner-form" style={{ padding: '10px' }} source="email" name="form">
                      <div className="u-form-group u-form-select u-form-group-2">
                      <label htmlFor="healthContract" className="u-label u-text-palette-4-dark-3 u-label-1">Choose the individual's signed contract</label>
                      <div className="u-form-select-wrapper">
                        <select id="healthContract" name="select" value={healthContract || ''} onChange={(e) => handleHealthContracteSelect(e.target.value)}  className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" required="required">
                        <option value="" disabled defaultValue>Select a signed health contract</option>
                          {individualHealthContracts.map(async healthContractID => (
                            <option key={healthContractID} value={healthContractID} data-calc="healthContract" >{await getHealthContract(healthContractID)}</option>
                          ))}
                        </select>
                        <svg className="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style={{fill: "currentColor"}} xmlSpace="preserve"><polygon className="st0" points="8,12 2,4 14,4 "></polygon></svg>
                        </div>
                      </div>
                      <div className="u-form-group u-form-select u-form-group-2">
                        <label htmlFor="healthService" className="u-label u-text-palette-4-dark-3 u-label-1">Health Service</label>
                        <div className="u-form-select-wrapper">
                          <select id="healthService" name="select" value={healthServices || ''} onChange={(e) => handleHealthServiceSelect(e.target.value)}  className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" required="required">
                            <option value="" disabled defaultValue>Choose the health service</option>
                            <option value="generalCare" data-calc="healthService" >General Care</option>
                            <option value="dental" data-calc="healthService" >Dental Care</option>
                            <option value="eyeCare" data-calc="healthService" >Eye Care</option>
                          </select>
                          <svg className="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style={{fill: "currentColor"}} xmlSpace="preserve"><polygon className="st0" points="8,12 2,4 14,4 "></polygon></svg>
                        </div>
                      </div>
                      <div className="u-form-group u-label-top u-form-group-2">
                        <label
                          htmlFor="claimAmt"
                          className="u-label u-text-palette-4-dark-3 u-label-2"
                        >
                          Claim Amount
                        </label>
                        <input
                          type="number"
                          id="claimAmt"
                          value={claimAmount}
                          onChange={(event) => setClaimAmount(event.target.value)}
                          className="u-input u-input-rectangle"
                          spellCheck="false"
                        />
                      </div>
                      <div 
                        className="u-align-left u-form-group u-form-submit u-label-top"
                        style={{ display: isSubmitLoading ? "none" : "block" }}
                      >
                        {claimExists ? (
                            <label
                              className="u-label u-text-palette-4-dark-3 u-label-2"
                            >
                              Claim already submitted for this health contract and health service 
                            </label>
                        ):(
                          <>
                            <a
                              href="/hio/submit_claim"
                              onClick={handleRequestClaim}
                              className="u-border-2 u-border-grey-75 u-btn u-btn-round u-btn-submit u-button-style u-hover-palette-1-dark-1 u-palette-1-light-2 u-radius-6 u-text-active-palette-1-dark-2 u-btn-1"
                            >
                              Submit
                            </a>
                            <input
                              type="submit"
                              value="submit"
                              className="u-form-control-hidden"
                              wfd-invisible="true"
                            />
                          </>
                        )}
                      </div>
                      <div className="loader-div-view-health-contracts">
                        <div style={{ display: isSubmitLoading ? "block" : "none" }}>  
                            <Loader/>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>     
          ):(
            <div className="u-body u-xl-mode" data-lang="en">
                <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                    <div className="u-clearfix u-sheet u-sheet-1">
                        <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Health Contract Signed<br /></h2>
                        <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any signed health contracts.
                        </p>
                        <button onClick={signHealthContract} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">Sign health contract</button>
                        <p className="u-text u-text-3">Image from <button  className="u-active-none u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" target="_blank">Freepik</button><br /></p>    
                        <img className="u-image u-image-contain u-image-default u-image-2" src={notFound} alt="" data-image-width="1298" data-image-height="598" />
                    </div>
                </section>
            </div>
          )}
        </>
      </div>
      <div className="loader-div-view-health-contracts">
        <div style={{ display: isLoading ? "block" : "none" }}>  
            <Loader/>
        </div>
      </div>
    </>
  );     
};

export default RequestClaim;