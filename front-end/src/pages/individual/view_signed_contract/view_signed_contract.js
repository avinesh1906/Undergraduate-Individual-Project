import { ethers } from "ethers";
import React, { useState, useContext, useEffect, useCallback } from 'react';
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
  const [contracts, setContracts] = useState([]);
  const [contractIDs, setContractIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedContact, setIsSignedContact] = useState(false);

  const navigate  = useNavigate();
  const {username} = useContext(UserContext);
    
  const loadContract = useCallback(async () => {
    const contract = new ethers.Contract(
      ClaimContractAddress,
      ClaimContract.abi,
      signer
    );
    const contracts = await contract.getAllHealthContracts()
    setContracts(contracts);
    console.log(contracts);
  }, [signer]);
  
  useEffect(() => {
    const loadContractIDs = async () => {
      setIsLoading(true);
      try {
        const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
        setContractIDs(await individualContract.getHealthContracts(username));
        await loadContract();
        setIsSignedContact(true);
      } catch (error) {
        setIsSignedContact(false);
        console.log(error);
      }
      setIsLoading(false);
    }
    loadContractIDs();
  }, [loadContract, signer, username]);
  
  const signContract = () => {
    navigate("/individual/sign_health_contract");
  }
  
  return (
    <>
      <div style={{ display: isLoading ? "none" : "block" }}>
        {isSignedContact ? (
          contractIDs.length > 1 ? (
            <>
            <div className="u-body u-xl-mode" data-lang="en">
              <section className="u-align-center u-clearfix u-grey-15 u-section-7" id="carousel_e3db">
                  <div className="u-clearfix u-sheet u-sheet-1">
                      <h1 className="u-custom-font u-font-montserrat u-text u-text-1" spellCheck={false}>
                          Signed Health Contract<br />
                      </h1>
                      <div className="u-clearfix u-expanded-width u-gutter-30 u-layout-wrap u-layout-wrap-1">
                          <div className="u-gutter-0 u-layout">
                              <div className="u-layout-row">
                                {contractIDs.map((id, index) => (
                                    contracts.map((contract) => (
                                        contract.healthcontractID === id ? (
                                          <div key={index} className={`u-align-center u-container-style u-layout-cell u-left-cell u-modified-color-${((index % 3) + 1)}-base u-radius-10 u-shape-round u-size-20 u-size-20-md u-layout-cell-1`}>
                                          <div className="u-container-layout u-container-layout-1">
                                              <div className="u-align-center u-container-style u-group u-radius-10 u-shape-round u-white u-group-1">
                                                  <div className="u-container-layout u-valign-middle u-container-layout-2">
                                                      <h4 className="u-text u-text-palette-1-base u-text-3">
                                                      <span style={{ fontSize: '2.25rem' }}>{contract.coverageType}</span>
                                                      </h4>
                                                  </div>
                                              </div>
                                              <p className="u-text u-text-4" spellCheck={false}>
                                                  <span style={{ fontWeight: 700 }}>{contract.premium}</span>% Premium<br />
                                              </p>
                                              <p className="u-text u-text-5" spellCheck={false}>
                                                  Rs{" "}<span style={{ fontWeight: 700 }}>{contract.generalCare.toLocaleString()}</span> for general care
                                              </p>
                                              <p className="u-text u-text-5" spellCheck={false}>
                                                  Rs{" "}<span style={{ fontWeight: 700 }}>{contract.dental.toLocaleString()}</span> for dental care
                                              </p>
                                              <p className="u-text u-text-5" spellCheck={false}>
                                                  Rs{" "}<span style={{ fontWeight: 700 }}>{contract.eyeCare.toLocaleString()}</span> for eye care
                                              </p>
                                              {contract.approval ? (
                                                  <p className="u-text u-text-5" spellCheck={false}>
                                                      <span style={{ fontWeight: 700 }}>Automatic{" "}</span> Approval
                                                  </p>
                                                  ) : (
                                                  <p className="u-text u-text-5" spellCheck={false}>
                                                      <span style={{ fontWeight: 700 }}>Insurance Admin{" "}</span> Approval
                                                  </p>
                                              )}
                                          </div>
                                          </div>
                                        ) : null
                                    ))
                                ))}
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
              </div>
            </>
          ):(
            contractIDs.map((id, index) => (
              contracts.map((contract) => (
                  contract.healthcontractID === id ? (
                    <div key={index} className="u-body u-xl-mode" data-lang="en">
                    <section className="u-align-center u-clearfix u-section-8" id="carousel_4c41">
                      <div className="u-clearfix u-sheet u-sheet-1">
                        <h2 className="u-text u-text-black u-text-default u-text-1" spellCheck="false">Signed Health Contract<br /></h2>
                        <div className="u-align-center u-container-style u-gradient u-group u-radius-50 u-shape-round u-group-1">
                          <div className="u-container-layout u-valign-top u-container-layout-1">
                            <img className="u-image u-image-default u-image-1" alt="" data-image-width="432" data-image-height="386" src={signedContract} />
                            <p className="u-text u-text-grey-80 u-text-2" spellCheck="false">{contract.coverageType}</p>
                            <div className="u-border-11 u-border-white u-line u-line-horizontal u-line-1"></div>
                            <p className="u-text u-text-black u-text-3" spellCheck="false">with a general care coverage Limit of Rs <span style={{ fontWeight: 700 }}>{contract.generalCare.toLocaleString()}</span><br /></p>
                            <p className="u-text u-text-black u-text-3" spellCheck="false">a dental care coverage Limit of Rs <span style={{ fontWeight: 700 }}>{contract.dental.toLocaleString()}</span><br /></p>
                            <p className="u-text u-text-black u-text-3" spellCheck="false">and an eye care coverage Limit of Rs <span style={{ fontWeight: 700 }}>{contract.eyeCare.toLocaleString()}</span><br /></p>
                            <p className="u-text u-text-4" spellCheck="false">In adition, with a premium of <span style={{ fontWeight: 700 }}>{contract.premium}</span>%<br /></p>
                            {contract.approval ? (
                                <p className="u-text u-text-4" spellCheck="false"><span style={{ fontWeight: 700 }}>{contract.premium}Automatic</span>{" "}approval<br /></p>
                                ) : (
                                <p className="u-text u-text-4" spellCheck={false}>
                                    <span style={{ fontWeight: 700 }}>Insurance Admin{" "}</span> Approval
                                </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                    </div>
                ) : null
              ))
            ))
          )
        ):(
          <div className="u-body u-xl-mode" data-lang="en">
            <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                <div className="u-clearfix u-sheet u-sheet-1">
                    <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Signed Health Contract<br /></h2>
                    <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any signed health contract.</p>
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
