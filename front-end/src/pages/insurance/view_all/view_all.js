import { ethers } from "ethers";
import { Web3Context } from '../../../Web3Context';
import React, { useState, useContext, useEffect } from 'react';
import ClaimContract from '../../../contracts/ClaimContract.json';
import contractAddresses from "../../../config";
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg'
import './styles.css';

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
                                        <th className="u-table-cell" spellCheck="false">Claimaint</th>
                                        <th className="u-table-cell">Requester</th>
                                        <th className="u-table-cell">Health Contract<br/></th>
                                        <th className="u-table-cell">Status</th>
                                        <th className="u-table-cell">Claim Amount<br/></th>
                                    </tr>
                                    </thead>
                                    <tbody className="u-align-center u-table-body">
                                        {claims.length > 0 &&
                                            claims.map((claim, index) => (
                                                <tr key={index}>
                                                    <td className="u-black u-first-column u-table-cell u-table-cell-7">1</td>
                                                    <td className="u-table-cell">Josh Anderson,<br/>josh-info@gmail.com</td>
                                                    <td className="u-table-cell">avineshculloo@gmail.com</td>
                                                    <td className="u-table-cell">Silver</td>
                                                    <td className="u-table-cell">Submitted</td>
                                                    <td className="u-table-cell">Rs 10, 000<br/></td>
                                                </tr>
                                                )
                                            )
                                        }
                                        <tr>
                                            <td className="u-black u-first-column u-table-cell u-table-cell-13">2</td>
                                            <td className="u-palette-5-light-1 u-table-cell u-table-cell-14">Lina Hudson,<br/>lina-h@gmail.com</td>
                                            <td className="u-palette-5-light-1 u-table-cell u-table-cell-15">keshavculloo@gmail.com</td>
                                            <td className="u-palette-5-light-1 u-table-cell u-table-cell-16">Bronze</td>
                                            <td className="u-palette-5-light-1 u-table-cell u-table-cell-17">Approved</td>
                                            <td className="u-palette-5-light-1 u-table-cell u-table-cell-18">Rs 36, 000<br/></td>
                                        </tr>
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

export default ViewAllClaims;