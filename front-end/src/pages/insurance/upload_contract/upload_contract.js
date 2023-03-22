import { ethers } from "ethers";
import React, { useState, useContext } from 'react';
import { Web3Context } from '../../../Web3Context';
import HealthPolicyContract from '../../../contracts/HealthPolicy.json'
import contractAddresses from '../../../config';
import './styles.css';
import picture from '../../../images/upload_contract/logo.png'

const HealthPolicyAddress = contractAddresses.HealthPolicy;

const UploadContract = () => {
    const [coverageType, setCoverageType] = useState('');
    const [coverageLimit, setCoverageLimit] = useState('');
    const [premium, setPremium] = useState('');
    const { provider, signer } = useContext(Web3Context);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      uploadHealthContract();
    };
    
    async function uploadHealthContract() {
        const eventSignature = ethers.utils.id("NewPolicy(uint256");
        const healthContract = new ethers.Contract(HealthPolicyAddress, HealthPolicyContract.abi, signer);
        const tx  = await healthContract.uploadPolicy(coverageType, coverageLimit, premium);
        const receipt  = await  provider.waitForTransaction(tx.hash);
        if (receipt.status === 1) {
            console.log('Transaction successful');
            // check the logs for the LogInsuredPersonRegistered event
            receipt.logs.forEach(log => {
            if (log.topics[0] === eventSignature) {
                const event = healthContract.interface.parseLog(log);
                console.log(event.args);
            }
            });
        } else {
            console.log('Transaction failed');
        }
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
                  <label htmlFor="name-61fc" className="u-label u-text-body-alt-color u-label-1">Coverage Type</label>
                  <input type="text" id="name-61fc" name="coverage_type" className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-1" required spellCheck={false} placeholder="Enter your coverage type (e.g. Diamond)" />
                </div>
                <div className="u-form-group u-label-top u-form-group-2">
                  <label htmlFor="phone-0bf6" className="u-label u-text-body-alt-color u-label-2">Coverage Limit</label>
                  <input type="text" pattern="\+?\d{0,3}[\s\(\-]?([0-9]{2,3})[\s\)\-]?([\s\-]?)([0-9]{3})[\s\-]?([0-9]{2})[\s\-]?([0-9]{2})" placeholder="Enter your coverage limit (e.g. 10 000)" id="phone-0bf6" name="coverage_limit" className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-2" required />
                </div>
                <div className="u-form-group u-label-top">
                  <label htmlFor="message-61fc" className="u-label u-text-body-alt-color u-label-3">Premium</label>
                  <input placeholder="Enter your premium percentage (e.g. 10)" rows="4" cols="50" id="message-61fc" name="premium" className="u-border-white u-input u-input-rectangle u-text-grey-70 u-input-3" required spellCheck={false} type="text" />
                </div>
                <div className="u-align-left u-form-group u-form-submit u-label-top">
                  <input type="submit" value="submit" className="u-form-control-hidden" />
                  <button href="#" className="u-border-none u-btn u-btn-submit u-button-style u-custom-font u-font-montserrat u-hover-palette-4-dark-2 u-btn-1">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
};

export default UploadContract;