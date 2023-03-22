import { ethers } from "ethers";
import React, { useState, useContext } from 'react';
import { Web3Context } from '../../../Web3Context';
import HealthPolicyContract from '../../../contracts/HealthPolicy.json'
import contractAddresses from '../../../config';
import './styles.css';
import picture from '../../../images/upload_contract/logo.png'
import Loader from "../../../components/loader/loader";

const HealthPolicyAddress = contractAddresses.HealthPolicy;

const UploadContract = () => {
    const [coverageType, setCoverageType] = useState('');
    const [coverageLimit, setCoverageLimit] = useState('');
    const [premium, setPremium] = useState('');
    const { provider, signer } = useContext(Web3Context);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
      const errors = {};
      if (!coverageType){
        errors.coverageType ='Coverage Type is required';
      }

      if (!coverageLimit){
        errors.coverageLimit = 'Coverage Limit is required';
      } else if (!/^\d+$/.test(coverageLimit)) {
        errors.coverageLimit = 'Coverage Limit must be an integer';
      }  

      if (!premium){
        errors.premium ='Premium is required';
      }else if (!/^\d+$/.test(premium)) {
        errors.premium = 'Premium must be an integer';
      } 

      setErrors(errors);
      return errors;
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      const errors = validate();
      if (Object.keys(errors).length === 0) {
        uploadHealthContract();
      }
    };
    
    async function uploadHealthContract() {
      setIsLoading(true);
      const eventSignature = ethers.utils.id("NewPolicy(uint256");
      const healthContract = new ethers.Contract(HealthPolicyAddress, HealthPolicyContract.abi, signer);
      try {
        const tx  = await healthContract.uploadPolicy(coverageType, coverageLimit, premium);
        const receipt  = await  provider.waitForTransaction(tx.hash);
        if (receipt.status === 1) {
            console.log('Transaction successful');
            // check the logs for the LogInsuredPersonRegistered event
            receipt.logs.forEach(log => {
              const event = healthContract.interface.parseLog(log);
              console.log(event.args);
            if (log.topics[0] === eventSignature) {
                const event = healthContract.interface.parseLog(log);
                console.log(event.args);
            }
            });
        } else {
            console.log('Transaction failed');
        }
      } catch(error){
        const newErrorMessage = "Coverage Type already exists.";
        setErrors(prevState => ({
          ...prevState,
          coverageExist: newErrorMessage
        }));
      }
      
      setIsLoading(false);
    }

    return (
      <div className="u-body u-xl-mode" data-lang="en">
        <section className="u-align-left u-clearfix u-image u-section-3" id="carousel_3338" data-image-width="1469" data-image-height="800">
          <div className="u-clearfix u-sheet u-sheet-1">
            <h2 className="u-custom-font u-font-montserrat u-text u-text-default u-text-1" spellCheck={false}> Upload Health Contract<br />
            </h2>
            <img className="u-image u-image-default u-image-1" src={picture} alt="" data-image-width="800" data-image-height="747" />
            <div className="u-form u-gradient u-radius-9 u-form-1">
              <form onSubmit={handleSubmit} className="u-clearfix u-form-spacing-10 u-form-vertical u-inner-form" source="email" name="form" style={{ padding: '30px' }}>
                <div className="u-form-group u-form-name u-label-top">
                  <label htmlFor="coverageType" className="u-label u-text-body-alt-color u-label-1">Coverage Type</label>
                  <input 
                    type="text" 
                    id="coverageType" 
                    name="coverage_type" 
                    className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-1"  
                    placeholder="Enter your coverage type (e.g. Diamond)" 
                    value={coverageType}
                    onChange={(e) => setCoverageType(e.target.value)}
                  />
                  {errors.coverageType && <label className="u-label" style={{"color": "red"}}>{errors.coverageType}</label>}
                  {errors.coverageExist  && <label className="u-label" style={{"color": "#A84448"}}>{errors.coverageExist }</label>}

                </div>
                <div className="u-form-group u-label-top u-form-group-2">
                  <label htmlFor="coverageLimit" className="u-label u-text-body-alt-color u-label-2">Coverage Limit</label>
                  <input 
                    type="number" 
                    placeholder="Enter your coverage limit (e.g. 10 000)" 
                    id="coverageLimit" 
                    name="coverage_limit" 
                    className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-2" 
                    required 
                    value={coverageLimit}
                    onChange={(e) => setCoverageLimit(e.target.value)}
                    min={0}
                  />
                  {errors.coverageLimit && <label className="u-label" style={{"color": "red"}}>{errors.coverageLimit}</label>}
                </div>
                <div className="u-form-group u-label-top">
                  <label htmlFor="premium" className="u-label u-text-body-alt-color u-label-3">Premium</label>
                  <input 
                    placeholder="Enter your premium percentage (e.g. 10)" 
                    id="premium" 
                    name="premium" 
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-3" 
                    required
                    type="number"
                    min={0}
                  />
                  {errors.premium && <label className="u-label" style={{"color": "red"}}>{errors.premium}</label>}
                </div>
                <div 
                  className="u-align-left u-form-group u-form-submit u-label-top"
                  style={{ display: isLoading ? "none" : "block" }}
                >
                  <input type="submit" value="submit" className="u-form-control-hidden" />
                  <button href="#" className="u-border-none u-btn u-btn-submit u-button-style u-custom-font u-font-montserrat u-hover-palette-4-dark-2 u-btn-1">
                    Submit
                  </button>
                </div>
                <div 
                  className="loader-div" 
                  style={{ display: isLoading ? "block" : "none" }}
                >  
                  <Loader/>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
};

export default UploadContract;