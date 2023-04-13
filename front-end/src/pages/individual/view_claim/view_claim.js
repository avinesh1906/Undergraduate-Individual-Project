import { ethers } from "ethers";
import { Web3Context } from '../../../Web3Context';
import React, { useState, useContext, useEffect } from 'react';
import ClaimContract from '../../../contracts/ClaimContract.json';
import contractAddresses from "../../../config";
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg'
import './styles.css';
import { UserContext } from "../../../UserContext";

const ClaimContractAddress = contractAddresses.ClaimContract;

const ViewIndividualClaim = () => {
    const {signer } = useContext(Web3Context);
    const [isLoading, setIsLoading] = useState(false);
    const [claims, setClaims] = useState([]);
    const {username} = useContext(UserContext);


    useEffect(() => {
        const retrieveAllClaims = async () =>{
            setIsLoading(true);
            const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
            const claims = await claimContract.getIndividualClaims(username);
            setClaims(claims);
            console.log(claims);
            setIsLoading(false);
        };
        retrieveAllClaims();
    }, [signer, username]);

    const determineStatus = (status) => {
        if (status === 0){
            return "Submitted";
        } else if (status === 1) {
            return "Approved";
        } else if (status === 2) {
            return "Denied";
        }
    }
    return (
    <>
        <div style={{ display: isLoading ? "none" : "block" }}> 
            {claims.length > 0 ? (
                <div className="u-body u-xl-mode" data-lang="en">
                    <section className="u-clearfix u-palette-5-light-2 u-section-6" id="sec-9b24">
                        <div className="u-clearfix u-sheet u-sheet-1">
                            <h1 className="u-align-center u-text u-text-default u-text-1" spellCheck="false">List of Claims<br/></h1>
                            <div className="u-expanded-width u-table u-table-responsive u-table-1">
                                <table className="u-table-entity">
                                    <colgroup>
                                    <col width="11.6%"/>
                                    <col width="22.5%"/>
                                    <col width="17%"/>
                                    <col width="17%"/>
                                    <col width="15%"/>
                                    <col width="16.90000000000001%"/>
                                    </colgroup>
                                    <thead className="u-align-center u-table-header u-table-header-1">
                                    <tr style={{ height: '29px' }}>
                                        <th className="u-table-cell"></th>
                                        <th className="u-table-cell">Requester</th>
                                        <th className="u-table-cell">Health Contract<br/></th>
                                        <th className="u-table-cell">Health Service<br/></th>
                                        <th className="u-table-cell">Status</th>
                                        <th className="u-table-cell">Claim Amount<br/></th>
                                    </tr>
                                    </thead>
                                    <tbody className="u-align-center u-table-body">
                                        {claims.length > 0 &&
                                            claims.map((claim, index) => (
                                                index % 2 === 0 ? (
                                                    <tr key={index}>
                                                        <td className="u-black u-first-column u-table-cell u-table-cell-7">{index + 1}</td>
                                                        <td className="u-table-cell">{claim["requester"]}</td>
                                                        <td className="u-table-cell">{claim["healthContract"]["coverageType"]}</td>
                                                        {claim["claimType"] === "generalCare" ? (
                                                        <td className="u-table-cell">General Care</td>
                                                        ) : claim["claimType"] === "dental" ? (
                                                        <td className="u-table-cell">Dental Care</td>
                                                        ) : claim["claimType"] === "eyeCare" ? (
                                                        <td className="u-table-cell">Eye Care</td>
                                                        ) : null}
                                                        <td className="u-table-cell">{determineStatus(claim["status"])}</td>
                                                        <td className="u-table-cell">Rs{" "} {claim["claimAmount"].toLocaleString()}<br/></td>
                                                    </tr>
                                                ) : (
                                                    <tr key={index}>
                                                    <td className="u-black u-first-column u-table-cell u-table-cell-13">{index + 1}</td>
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-15">{claim["requester"]}</td>
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-16">{claim["healthContract"]["coverageType"]}</td>
                                                    {claim["claimType"] === "generalCare" ? (
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-16">General Care</td>
                                                    ) : claim["claimType"] === "dental" ? (
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-16">Dental Care</td>
                                                    ) : claim["claimType"] === "eyeCare" ? (
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-16">Eye Care</td>
                                                    ) : null}
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-17">{determineStatus(claim["status"])}</td>
                                                    <td className="u-palette-5-light-1 u-table-cell u-table-cell-18">Rs{" "} {claim["claimAmount"].toLocaleString()}<br/></td>
                                                </tr>
                                                )

                                                )
                                            )
                                        }
                                    </tbody>
                                </table>
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
                            <button style={{ display: "none" }} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">Upload health contract</button>
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

export default ViewIndividualClaim;