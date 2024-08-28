import { ethers } from "ethers";
import React, { useState, useContext, useEffect} from 'react';
import { Web3Context } from '../../../Web3Context';
import ClaimContract from '../../../contracts/ClaimContract.json'
import contractAddresses from '../../../config';
import Loader from "../../../components/loader/loader";
import './styles.css';
import notFound from '../../../images/view_contract/notFound.jpg'
import { useNavigate } from "react-router-dom";

const ClaimContractAddress = contractAddresses.ClaimContract;

const ViewContracts = () => {
    const { signer } = useContext(Web3Context);
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const loadContracts = async () => {
            setIsLoading(true);
            try {
                const contract = new ethers.Contract(
                ClaimContractAddress,
                ClaimContract.abi,
                signer
                );
        
                const allContracts = await contract.getAllHealthContracts();
                console.log(allContracts);
                setContracts(allContracts);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        loadContracts();
    }, [signer]);

    const uploadContract = () => {
        navigate("/insurance/upload_health_contract");
    }
    
    return (
        <>
            <div style={{ display: isLoading ? "none" : "block" }}> 
                {contracts.length > 0 ? (
                    <div className="u-body u-xl-mode" data-lang="en">
                        <section className="u-align-center u-clearfix u-section-4" id="sec-ec4d">
                            <div className="u-clearfix u-sheet u-sheet-1">
                                <h2 className="u-text u-text-1" spellCheck={false}>
                                    Health Contracts<br />
                                </h2>
                                <p className="u-large-text u-text u-text-variant u-text-2" spellCheck={false}>
                                    Experience the convenience of viewing the health insurance contracts all in one place, with secure access that's reserved exclusively for our valued insurance admin and staff members.
                                </p>
                                <div className="u-clearfix u-expanded-width u-gutter-50 u-layout-wrap u-layout-wrap-1">
                                    <div className="u-gutter-0 u-layout">
                                        <div 
                                        className="u-layout-row"
                                        >
                                            {contracts.length > 0 &&
                                                contracts.map((contract, index) => (
                                                <div
                                                key={index}
                                                className={`u-align-center u-container-style u-layout-cell u-modified-color-${((index % 3) + 1)}-base u-size-20 u-size-20-md u-layout-cell-2`}
                                                >
                                                <div className="u-container-layout u-container-layout-2">
                                                    <h3 className="u-align-center-xl u-align-center-xs u-text u-text-3" style={{"color": "#191825"}} >
                                                    {contract.coverageType}
                                                    </h3>
                                                    <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4" style={{"color": "#37306B"}} >
                                                    General Care at Rs{" "}{contract.generalCare.toLocaleString()}
                                                    <br />
                                                    </h4>
                                                    <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4" style={{"color": "#37306B"}} >
                                                    Dental Care at Rs{" "}{contract.dental.toLocaleString()}
                                                    <br />
                                                    </h4>
                                                    <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4" style={{"color": "#37306B"}} >
                                                    Eye Care at Rs{" "}{contract.eyeCare.toLocaleString()}
                                                    <br />
                                                    </h4>
                                                    {contract.approval ? (
                                                        <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4" style={{"color": "#37306B"}} >
                                                            Automatic Approval
                                                            <br />
                                                        </h4>
                                                        ) : (
                                                        <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4" style={{"color": "#37306B"}} >
                                                            Insurance Admin Approval
                                                            <br />
                                                        </h4>
                                                    )}
                                                    <p className="u-align-center-xl u-align-center-xs u-text u-text-5" spellCheck={false} style={{"color": "#146C94"}}>
                                                    Affordable coverage at{" "}
                                                    <span style={{ fontWeight: 700 }}>{contract.premium}</span>% premium.
                                                    </p>
                                                </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="u-body u-xl-mode" data-lang="en">
                        <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                            <div className="u-clearfix u-sheet u-sheet-1">
                                <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Health Contract<br /></h2>
                                <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any health contract. <br />Let’s begin by uploading a health contract.<br /></p>
                                <button onClick={uploadContract} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">Upload health contract</button>
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
  
export default ViewContracts;
