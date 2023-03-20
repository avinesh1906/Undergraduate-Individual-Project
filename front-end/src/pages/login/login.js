import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import IndividualContract from '../../contracts/individual.json';
import HealthOrganizationContract from '../../contracts/HealthOrganization.json';
import InsuranceContract from '../../contracts/insuranceprovider.json';
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';
import { UserContext } from '../../UserContext';
import { useNavigate  } from "react-router-dom";
import './styles.css';
import login from '../../images/login.png'
const IndividualContractAddress = contractAddresses.Individual;
const HealthOrganizationContractAddress = contractAddresses.HealthOrganization;
const InsuranceProviderAddress = contractAddresses.InsuranceProvider;


const LoginForm = () => {
  const [memberType, setMemberType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signer } = useContext(Web3Context);
  const { username, setUsername } = useContext(UserContext);
  const navigate  = useNavigate();

  async function verifyIndividual(){
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    const response = await individualContract.authenticate(username, password);
    console.log(response);
  }

  async function verifyHealthOrganization(){
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const response = await healthOrganizationContract.authenticate(password);
    console.log(response);
  }

  async function verifyInsurance(){
    const healthOrganizationContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const response = await healthOrganizationContract.authenticate(password);
    console.log(response);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login based on member type
    if (memberType === 'individual') {
      console.log('Individual login:', {
        username,
        password,
      });
      verifyIndividual();
    } else if (memberType === 'health_organization') {
      console.log('Organization login:', {
        email,
        password,
      });
      verifyHealthOrganization();
    } else {
      console.log('Insurance login:', {
        email,
        password,
      });
      verifyInsurance();
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
      <div className="u-body u-xl-mode">
        <section className="u-align-center u-clearfix u-section-login" id="sec-05d1">
          <div className="u-clearfix u-sheet u-sheet-1">
            <div className="u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">
              <div className="u-layout">
                <div className="u-layout-row">
                  <div className="u-align-center u-container-style u-layout-cell u-size-30 u-layout-cell-1">
                    <div className="u-container-layout u-valign-middle u-container-layout-1">
                      <img className="u-image u-image-contain u-image-default u-image-1" src={login} alt="" data-image-width="473" data-image-height="464" />
                    </div>
                  </div>
                  <div className="u-align-center u-container-style u-layout-cell u-palette-1-base u-radius-50 u-shape-round u-size-30 u-layout-cell-2">
                    <div className="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-xl u-container-layout-2">
                      <div className="u-form u-login-control u-radius-50 u-white u-form-1">
                        <form action="#" className="u-clearfix u-form-custom-backend u-form-spacing-29 u-form-vertical u-inner-form" source="custom" name="form" style={{padding: "30px"}} method="post">
                          <div className="u-form-group u-form-select u-form-group-2">
                            <label htmlFor="select-ca74" className="u-label">Member Type</label>
                            <div className="u-form-select-wrapper">
                              <select id="select-ca74" name="select" className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" required="required">
                                <option value="individual" data-calc="individual" defaultValue="selected">Individual</option>
                                <option value="health_organization" data-calc="health_organization">Health Organization</option>
                                <option value="insurance" data-calc="insurance">Insurance</option>
                              </select>
                              <svg className="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style={{fill: "currentColor"}} xmlSpace="preserve"><polygon className="st0" points="8,12 2,4 14,4 "></polygon></svg>
                            </div>
                          </div>
                          <div className="u-form-group u-form-name">
                            <label htmlFor="username-a30d" className="u-label">Username *</label>
                            <input type="text" placeholder="Enter your Username" id="username-a30d" name="username" className="u-input u-input-rectangle u-input-2" required="" />
                          </div>
                          <div className="u-form-group u-form-password">
                            <label htmlFor="password-a30d" className="u-label">Password *</label>
                            <input type="text" placeholder="Enter your Password" id="password-a30d" name="password" className="u-input u-input-rectangle u-input-3" required="" />
                          </div>
                          <div className="u-align-left u-form-group u-form-submit">
                            <button href="#" className="u-border-none u-btn u-btn-submit u-button-style u-palette-3-base u-btn-2">Login</button>
                            <input type="submit" value="submit" className="u-form-control-hidden" />
                          </div>
                          <input type="hidden" value="" name="recaptchaResponse" />
                        </form>
                      </div>
                      <button onClick={navigateToRegister} className="u-border-active-palette-2-base u-border-hover-palette-1-base u-border-none u-btn u-button-style u-login-control u-login-create-account u-none u-text-hover-white u-text-palette-3-base u-btn-4">
                        Don't have an account?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default LoginForm;