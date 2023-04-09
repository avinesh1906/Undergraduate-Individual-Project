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

const ClaimContractAddress = contractAddresses.ClaimContract;
const IndividualContractAddress = contractAddresses.Individual;

const RequestClaim = () => {
  const { signer, provider } = useContext(Web3Context);
  const [claimAmount, setClaimAmount] = useState("");
  const [coverageLimit, setCoverageLimit] = useState("");
	const [premium, setPremium] = useState("");
	const [coverageType, setCoverageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasContract, setHasContract] = useState(false);
  const {username} = useContext(UserContext);
  const navigate = useNavigate();
  const [hasClaim, setHasClaim] = useState(false);

  const loadHealthContractID = useCallback(async () => {
    setIsLoading(true);
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    try {
      const indiviualHealthContractID = await individualContract.getHealthContract(username);
      const claimContract = new ethers.Contract(
        ClaimContractAddress,
        ClaimContract.abi,
        signer
      );
      const healthContractById = await claimContract.getHealthContract(indiviualHealthContractID);
      console.log(healthContractById);
      setCoverageLimit(healthContractById[1]);
      setPremium(healthContractById[2]);
      setCoverageType(healthContractById[3]);
      setHasContract(true);
    } catch (error) {
      setHasContract(false);
    }
  }, [signer, username]);

  useEffect(() => {
    const hasIndividualClaim = async () => {
      setIsLoading(true);
      const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
      const hasClaim  = await claimContract.hasIndividualClaim(username);
      setHasClaim(hasClaim);
      console.log(hasClaim);
      loadHealthContractID();
      setIsLoading(false);
    } 
    hasIndividualClaim();
  }, [signer, username, loadHealthContractID]);

	
  const handleRequestClaim = async () => {
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
  }
	
  const signHealthContract = () => {
    navigate("/sign_health_contract");
  }

  return (
    <>
      <div style={{ display: isLoading ? "none" : "block" }}>
        <>
          {hasContract ? (
            <div className="u-body u-xl-mode" data-lang="en">
            <section className="u-clearfix u-grey-5 u-section-9" id="sec-5990">
              <div className="u-clearfix u-sheet u-sheet-1">
                <div className="u-clearfix u-expanded-width u-gutter-0 u-layout-wrap u-layout-wrap-1">
                  <div className="u-layout" style={{}}>
                    <div className="u-layout-row" style={{}}>
                      <div className="u-container-style u-layout-cell u-radius-7 u-shape-round u-size-30 u-layout-cell-1">
                        <div className="u-border-2 u-border-grey-75 u-container-layout u-container-layout-1">
                          <h5 className="u-custom-font u-font-montserrat u-text u-text-default u-text-1">
                            24/7 Service
                            <br />
                          </h5>
                          <h3 className="u-custom-font u-font-montserrat u-text u-text-default u-text-palette-1-dark-1 u-text-2" spellCheck="false">
                            Signed Health Contract
                            <br />
                          </h3>
                          <p className="u-text u-text-default u-text-3" spellCheck="false">
                            Please find your signed health contract attached below for your reference
                          </p>
                          <ul className="u-text u-text-4" spellCheck="false">
                            <li>{coverageType}</li>
                            <li>Rs{" "}{coverageLimit.toLocaleString()} Coverage Limit</li>
                            <li>{premium}% Premium</li>
                          </ul>
                        </div>
                      </div>
                      <div className="u-container-style u-layout-cell u-shape-rectangle u-size-30 u-layout-cell-2">
                        <div className="u-container-layout u-container-layout-2">
                          <h3 className="u-custom-font u-font-montserrat u-text u-text-default u-text-palette-1-dark-1 u-text-5" spellCheck="false">
                            Request A Claim
                            <br />
                          </h3>
                          <div className="u-container-style u-expanded-width-sm u-expanded-width-xs u-group u-radius-20 u-shape-round u-white u-group-1">
                            <div className="u-container-layout u-container-layout-3">
                              <div className="u-form u-form-1">
                                <div
                                  className="u-clearfix u-form-spacing-10 u-form-vertical u-inner-form"
                                  style={{ padding: "10px" }}
                                >
                                  <div className="u-form-group u-form-name">
                                    <label htmlFor="name-61fc" className="u-label u-label-1">
                                      Claim Amount
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="Enter your claim amount"
                                      id="name-61fc"
                                      min={0}
                                      name="name"
                                      className="u-border-grey-10 u-input u-input-rectangle"
                                      required=""
                                      spellCheck="false"
                                      value={claimAmount}
                                      onChange={(e) => setClaimAmount(e.target.value)}
                                    />
                                  </div>
                                  <div className="u-align-right u-form-group u-form-submit">
                                    <button onClick={handleRequestClaim} className="u-border-none u-btn u-btn-submit u-button-style u-hover-palette-1-dark-1 u-palette-1-light-1 u-btn-1">
                                      Submit
                                    </button>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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