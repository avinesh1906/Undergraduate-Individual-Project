import { ethers } from 'ethers';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import contractAddresses from '../../../config';
import IndividualContract from '../../../contracts/individual.json';
import { Web3Context } from '../../../Web3Context';
import ClaimContract from '../../../contracts/ClaimContract.json';
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg';
import './styles.css';
import picture from '../../../images/submit_claim/picture.jpg';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../../UserContext';

const IndividualContractAddress = contractAddresses.Individual;
const ClaimContractAddress = contractAddresses.ClaimContract;

const SubmitClaim = () => {
  const [individuals, setIndividuals] = useState([]);
  const [healthServices, setHealthServices] = useState('');
  const [individualHealthContracts, setIndividualHealthContracts] = useState([]);
  const [healthContract, setHealthContract] = useState('');
  const [selectedIndividual, setSelectedIndividual] = useState('');
  const [claimAmount, setClaimAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  let { signer } = useContext(Web3Context);
  const {username} = useContext(UserContext);
  const [claimExists, isClaimExists] = useState(false);
  const [claims, setClaims] = useState([]);
  const [allHealthContract, setHealthContracts] = useState([]);


  const navigate = useNavigate();

  const getHealthContract = useCallback(async () => {
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    setHealthContracts(await claimContract.getAllHealthContracts());
  }, [signer]);
  

  useEffect(() => {
    const loadIndividualList = async () => {
      setIsLoading(true);
      try {
        const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
        const individuals = await individualContract.getAllIndividuals();
        setIndividuals(individuals);
        await getHealthContract();
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    } 
    loadIndividualList();
  }, [getHealthContract, signer]);

  const handleIndividualSelect = async (individual) => {
    setSelectedIndividual(individual);
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    setClaims(await claimContract.getIndividualClaims(individual));
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    setIndividualHealthContracts(await individualContract.getHealthContracts(individual));
  };

  const handleHealthServiceSelect = (healthService) => {
    setHealthServices(healthService);
    claims.forEach((claim) =>{
      if (claim.claimType === healthService && String(claim["healthContract"]["healthcontractID"]) === String(healthContract)){
        isClaimExists(true);
      } else {
        isClaimExists(false);
      }
    });
  };

  const handleHealthContracteSelect = (healthContract) => {
    setHealthContract(healthContract);
  };

  const submitTheClaim = async () => {
    setIsSubmitLoading(true);
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    await claimContract.submitClaim(username, selectedIndividual, claimAmount, healthContract, healthServices);
    setIsSubmitLoading(false);
    navigate("/hio/view_claims");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitTheClaim();
  };

  return (
    <>
      <div style={{ display: isLoading ? "none" : "block" }}>
        {individuals.length === 0 ? (
          <div className="u-body u-xl-mode" data-lang="en">
              <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                  <div className="u-clearfix u-sheet u-sheet-1">
                      <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Registerd Individual<br /></h2>
                      <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any registered individual.
                      </p>
                      <button style={{ display: "none" }} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">No individual</button>
                      <p className="u-text u-text-3">Image from <button  className="u-active-none u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" target="_blank">Freepik</button><br /></p>    
                      <img className="u-image u-image-contain u-image-default u-image-2" src={notFound} alt="" data-image-width="1298" data-image-height="598" />
                  </div>
              </section>
          </div>
        ):(
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
                        <label htmlFor="individual" className="u-label u-text-palette-4-dark-3 u-label-1">Choose the individual</label>
                        <div className="u-form-select-wrapper">
                          <select 
                            id="individual" 
                            name="select" 
                            value={selectedIndividual || ''} 
                            onChange={(e) => handleIndividualSelect(e.target.value)} 
                            className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" 
                            required="required"
                          >
                            <option value="" disabled defaultValue>Select an individual</option>
                            {individuals.map(individual => (
                              <option key={individual.username} value={individual.username} data-calc="individual">
                                {individual.first_name} {individual.last_name}
                              </option>
                            ))}
                          </select>
                          <svg className="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style={{fill: "currentColor"}} xmlSpace="preserve">
                            <polygon className="st0" points="8,12 2,4 14,4 "></polygon>
                          </svg>
                        </div>
                      </div>
                      {selectedIndividual && (
                        individualHealthContracts.length === 0 ? (
                          <>
                            <div className="u-form-group u-form-select u-form-group-2">
                              <label htmlFor="individual" style={{color: "red"}} className="u-label u-text-palette-4-dark-3 u-label-1">Individual does not have any signed health contract</label>
                            </div>
                          </>
                        ):(
                        <>
                          <div className="u-form-group u-form-select u-form-group-2">
                          <label htmlFor="healthContract" className="u-label u-text-palette-4-dark-3 u-label-1">Choose the individual's signed contract</label>
                          <div className="u-form-select-wrapper">
                            <select id="healthContract" name="select" value={healthContract || ''} onChange={(e) => handleHealthContracteSelect(e.target.value)}  className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" required="required">
                            <option value="" disabled defaultValue>Select a signed health contract</option>
                            {individualHealthContracts.map(healthContractID => (
                              allHealthContract.map((singleContract) => (
                                singleContract.healthcontractID === healthContractID ? (
                                  <option key={healthContractID} value={healthContractID} data-calc="healthContract" >{singleContract.coverageType}</option>
                                ) : null
                              ))
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
                              Cannot submit this claim again
                            </label>
                        ):(
                          <>
                            <section
                              onClick={handleSubmit}
                              className="u-border-2 u-border-grey-75 u-btn u-btn-round u-btn-submit u-button-style u-hover-palette-1-dark-1 u-palette-1-light-2 u-radius-6 u-text-active-palette-1-dark-2 u-btn-1"
                            >
                              Submit
                            </section>
                          </>
                        )}
                          </div>
                          <div className="loader-div">
                            <div style={{ display: isSubmitLoading ? "block" : "none" }}>  
                                <Loader/>
                            </div>
                          </div>
                        </>
                        )
                      )}
                    </form>
                  </div>
                </div>
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
}

export default SubmitClaim;
