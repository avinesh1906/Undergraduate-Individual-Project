import { ethers } from "ethers";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { Web3Context } from "../../../Web3Context";
import HealthPolicyContract from "../../../contracts/HealthPolicy.json";
import IndividualContract from '../../../contracts/individual.json';
import contractAddresses from "../../../config";
import './styles.css';
import Loader from "../../../components/loader/loader";
import notFound from '../../../images/view_contract/notFound.jpg'
import { useNavigate } from "react-router-dom";

const HealthPolicyAddress = contractAddresses.HealthPolicy;
const IndividualContractAddress = contractAddresses.Individual;

const ChooseHealthContract = () => {
  const { signer } = useContext(Web3Context);
  const [healthContracts, setHealthContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const navigate = useNavigate();
  
  const loadContracts = useCallback(async () => {
        try {
            const contract = new ethers.Contract(
                HealthPolicyAddress,
                HealthPolicyContract.abi,
                signer
            );
            const allContracts = await contract.getAllHealthContracts();
            setHealthContracts(allContracts);
        } catch (error) {
            console.log(error);
        }  
    }, [signer]);

    useEffect(() => {
        const checkIfSigned = async () => {
            setIsLoading(true);
            try {
                const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
                await individualContract.getHealthContract();
                loadContracts();
                setIsSigned(true);
            } catch (error) {
                setIsSigned(false);  
            } 
            setIsLoading(false);
        }
        checkIfSigned();
    }, [signer, loadContracts]);


  const selectContract = (contractId) => {
    console.log(contractId);
    setSelectedContract(contractId);
  };

  const viewSelectedContract = () => {
    navigate("/view_selected_contract");
  };

  const submit = async () => {
    setIsSubmitLoading(true);

    try {
        const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
        await individualContract.signHealthContract(selectedContract);
        // Do something after the contract is signed, like redirecting to a dashboard
        console.log("Signed");
        navigate("/view_selected_contract");
    } catch (error) {
        console.log(error);
    }
    setIsSubmitLoading(false);
  };

  return (
    <>  
        <div style={{ display: isLoading ? "none" : "block" }}>
        {isSigned ? (
            <div className="u-body u-xl-mode" data-lang="en">
                <section className="u-align-center u-clearfix u-section-5" id="sec-f685">
                    <div className="u-clearfix u-sheet u-sheet-1">
                        <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">A contract has already been signed<br /></h2>
                        <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">If you have already signed a contract for your health insurance, you do not need to select or sign another one.
                        </p>
                        <button onClick={viewSelectedContract} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">View Selected Contract</button>
                        <p  style={{ display: "none" }} className="u-text u-text-3">Image from <button  className="u-active-none u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" target="_blank">Freepik</button><br /></p>    
                        <img  style={{ display: "none" }} className="u-image u-image-contain u-image-default u-image-2" src={notFound} alt="" data-image-width="1298" data-image-height="598" />
                    </div>
                </section>
             </div>
        ):(
            <>
                {healthContracts.length > 0 ? (
                    <div className="u-body u-xl-mode" data-lang="en">
                        <section className="u-align-center u-clearfix u-grey-15 u-section-7" id="carousel_e3db">
                            <div className="u-clearfix u-sheet u-sheet-1">
                                <h1 className="u-custom-font u-font-montserrat u-text u-text-1" spellCheck={false}>
                                    Health Contract<br />
                                </h1>
                                <p className="u-text u-text-2" spellCheck={false}>
                                    Protect your health with a plan that fits your lifestyle and budget. Our range of health contracts offers comprehensive coverage options to meet your needs. Choose the right plan and take control of your well-being today
                                </p>
                                <div className="u-clearfix u-expanded-width u-gutter-30 u-layout-wrap u-layout-wrap-1">
                                    <div className="u-gutter-0 u-layout">
                                        <div className="u-layout-row">
                                            {healthContracts.length > 0 &&
                                            healthContracts.map((contract, index) => (
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
                                                            Rs{" "}<span style={{ fontWeight: 700 }}>{contract.coverageLimit.toLocaleString()}</span> Coverage Limit
                                                        </p>
                                                        <button 
                                                            className="u-active-palette-1-base u-border-2 u-border-active-white u-border-hover-white u-border-white u-btn u-btn-round u-button-style u-hover-palette-1-base u-radius-10 u-text-active-white u-text-hover-white u-white u-btn-1"
                                                            onClick={() => {
                                                                if (selectedContractId === contract.healthcontractID) {
                                                                    submit();
                                                                } else {
                                                                    selectContract(contract.healthcontractID);
                                                                    setSelectedContractId(contract.healthcontractID);
                                                                }
                                                            }}
                                                            style={{
                                                                display: isSubmitLoading ? "none" : "block"
                                                            }}
                                                        >
                                                            {selectedContractId === contract.healthcontractID ? "Sign" : "Select"}
                                                        </button>
                                                        <div className="loader-div" style={{ display: isSubmitLoading ? "block" : "none" }}>  
                                                            <Loader/>
                                                        </div>
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
                                <h2 className="u-custom-font u-text u-text-palette-1-base u-text-1" spellCheck="false">No Health Contract Available<br /></h2>
                                <p className="u-text u-text-palette-1-dark-1 u-text-2" spellCheck="false">We searched high and low but couldn’t find any uploaded health contracts. We recommend that you contact the insurance company directly to sign your contract.
                                </p>
                                <button style={{ display: "none" }} className="u-active-palette-1-base u-border-none u-btn u-button-style u-hover-palette-1-base u-palette-1-light-1 u-text-active-white u-text-body-alt-color u-text-hover-white u-btn-1">Upload health contract</button>
                                <p className="u-text u-text-3">Image from <button  className="u-active-none u-border-2 u-border-no-left u-border-no-right u-border-no-top u-border-palette-2-base u-btn u-button-link u-button-style u-hover-none u-none u-text-body-color u-btn-2" target="_blank">Freepik</button><br /></p>    
                                <img className="u-image u-image-contain u-image-default u-image-2" src={notFound} alt="" data-image-width="1298" data-image-height="598" />
                            </div>
                        </section>
                    </div>
                )}
            </>
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

export default ChooseHealthContract;
