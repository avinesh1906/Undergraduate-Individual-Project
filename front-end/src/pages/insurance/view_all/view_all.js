import { ethers } from "ethers";
import { Web3Context } from '../../../Web3Context';
import React, { useState, useContext, useEffect } from 'react';
import ClaimContract from '../../../contracts/ClaimContract.json';
import contractAddresses from "../../../config";
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg'

const ClaimContractAddress = contractAddresses.ClaimContract;

const ViewAllClaims = () => {
    const {signer } = useContext(Web3Context);
    const [isLoading, setIsLoading] = useState(false);
    const [claims, setClaims] = useState([]);

    useEffect(() => {
        const retrieveAllClaims = async () =>{
            setIsLoading(true);
            const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
            const claims = await claimContract.getAllClaims();
            setClaims(claims);
            setIsLoading(false);
        };
        retrieveAllClaims();
    }, [signer]);

    return (
    <>
        <div style={{ display: isLoading ? "none" : "block" }}> 
            {claims.length > 0 ? (
                <div>
                    {claims.length > 0 &&
                        claims.map((claim, index) => (
                                <div key={index}>
                                    <p>Claim Status: {claim.status}</p>
                                </div>
                            )
                        )
                    }
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

export default ViewAllClaims;