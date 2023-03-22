import { ethers } from "ethers";
import React, { useState, useContext, useEffect} from 'react';
import { Web3Context } from '../../../Web3Context';
import HealthPolicyContract from '../../../contracts/HealthPolicy.json'
import contractAddresses from '../../../config';
import Loader from "../../../components/loader/loader";

const HealthPolicyAddress = contractAddresses.HealthPolicy;

const ViewContracts = () => {
    const { signer } = useContext(Web3Context);
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const loadContracts = async () => {
            setIsLoading(true);
            try {
                const contract = new ethers.Contract(
                HealthPolicyAddress,
                HealthPolicyContract.abi,
                signer
                );
        
                const allContracts = await contract.getAllHealthContracts();
                setContracts(allContracts);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        loadContracts();
    }, [signer]);

    
  
    return (
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
                            style={{ display: isLoading ? "none" : "flex" }}
                            >
                                {contracts.length > 0 &&
                                    contracts.map((contract, index) => (
                                    <div
                                    key={index}
                                    className={`u-align-center u-container-style u-layout-cell u-palette-${((index % 3) + 1)}-base u-size-20 u-size-20-md u-layout-cell-2`}
                                    >
                                    <div className="u-container-layout u-container-layout-2">
                                        <h3 className="u-align-center-xl u-align-center-xs u-text u-text-3">
                                        {contract.coverageType}
                                        </h3>
                                        <h4 className="u-align-center-xl u-align-center-xs u-text u-text-4">
                                        Rs{" "}{contract.coverageLimit.toLocaleString()}
                                        <br />
                                        </h4>
                                        <p className="u-align-center-xl u-align-center-xs u-text u-text-5" spellCheck={false}>
                                        Affordable coverage at{" "}
                                        <span style={{ fontWeight: 700 }}>{contract.premium}</span>% premium.
                                        </p>
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <div className="loader-div" style={{ display: isLoading ? "block" : "none" }}>  
                              <Loader/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
  
export default ViewContracts;
