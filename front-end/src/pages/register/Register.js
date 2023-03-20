import { ethers } from 'ethers';
import React, { useState, useContext } from 'react';
import IndividualContract from '../../contracts/individual.json';
import HealthOrganizationContract from '../../contracts/HealthOrganization.json';
import InsuranceContract from '../../contracts/insuranceprovider.json';
import HealthPolicyContract from '../../contracts/HealthPolicy.json'
import ClaimContract from '../../contracts/ClaimContract.json';
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';
import { UserContext } from '../../UserContext';
import { useNavigate  } from "react-router-dom";
import register from '../../images/register.png';
import './styles.css';

const IndividualContractAddress = contractAddresses.Individual;
const HealthOrganizationContractAddress = contractAddresses.HealthOrganization;
const InsuranceProviderAddress = contractAddresses.InsuranceProvider;
const HealthPolicyAddress = contractAddresses.HealthPolicy;
const ClaimContractAddress = contractAddresses.ClaimContract;


const Register = () => {
  const [memberType, setMemberType] = useState('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [insName, setInsName] = useState('');
  const { provider, signer } = useContext(Web3Context);
  const navigate  = useNavigate();

  const [showInsuranceInput, setShowInsuranceInput] = useState(false);
  const [showHealthOrganizationInput, setShowHealthOrganizationInput] = useState(false);

  const {
    isWalletConnected,
    connectWallet,
  } = useContext(UserContext);

  const navigateToLogin = () => {
    navigate("/login");
  };

  async function getIndividual(individualContract) {
    const response = await individualContract.getIndividual(0);
    console.log(response);
  }

  async function getHealthOrganization(healthOrganizationContract) {
    const response = await healthOrganizationContract.getHealthOrganization();
    console.log(response);
  }

  async function getInsurance(insuranceContract) {
    const response = await insuranceContract.getInsuranceProvider();
    console.log(response);
  }

  async function registerIndividual() {
    // Get the event signature
    const eventSignature = ethers.utils.id("LogInsuredPersonRegistered(uint32,string)");
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    const tx  = await individualContract.registerIndividual(firstName, lastName, username, email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = individualContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
    } else {
      console.log('Transaction failed');
    }

    getIndividual(individualContract);
  }

  async function connectInsuranceAddress(){
    const eventSignature = ethers.utils.id("InsuranceAddressSetup(address");
    const healthContract = new ethers.Contract(HealthPolicyAddress, HealthPolicyContract.abi, signer);
    const tx  = await healthContract.setInsuranceCompanyAddress();
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the InsuranceAddressSetup event
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

  async function connectHealthInsurance(){
    const eventSignature = ethers.utils.id("HealthOrganizationAddressSetup(address");
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    const tx  = await claimContract.setHealthOrganizationAddress();
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the HealthOrganizationAddressSetup event
      receipt.logs.forEach(log => {
      if (log.topics[0] === eventSignature) {
          const event = claimContract.interface.parseLog(log);
          console.log(event.args);
      }
      });
    } else {
      console.log('Transaction failed');
    }
  }

  async function registerHealthOrganization() {
    // Get the event signature
    const eventSignature = ethers.utils.id("LogRegisterdHO(string)");
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const tx  = await healthOrganizationContract.registerHealthOrganization(orgName,email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = healthOrganizationContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
      connectHealthInsurance();
    } else {
      console.log('Transaction failed');
    }

    getHealthOrganization(healthOrganizationContract);
  }

  async function registerInsurance() {
    // Get the event signature
    const eventSignature = ethers.utils.id("NewProvider(string, string)");
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const tx  = await insuranceContract.registerProvider(insName,email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(log => {
        if (log.topics[0] === eventSignature) {
          const event = insuranceContract.interface.parseLog(log);
          console.log(event.args);
        }
      });
      connectInsuranceAddress()
    } else {
      console.log('Transaction failed');
    }

    getInsurance(insuranceContract);
  }

  function handleChange(e) {
    handleMemberSelect(e.target.value);
    setMemberType(e.target.value);
  }


  async function handleMemberSelect(value){
    if (value === "health_organization"){
      isHealthOrganizationRegistered();
    } else if (value === "insurance"){
      isInsuranceRegistered();
    }
  }

  async function isHealthOrganizationRegistered(){
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const response  = await healthOrganizationContract.isHealthOrganizationRegistered();
    setShowHealthOrganizationInput(!response);   
  }

  async function isInsuranceRegistered(){
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const response  = await insuranceContract.isInsuranceRegistered();
    setShowInsuranceInput(!response);   
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission
    // handle form submission based on member type
    if (memberType === 'individual') {
      console.log('Individual member details:', {
        firstName,
        lastName,
        username,
        email,
        password,
      });
      registerIndividual();
    } else if (memberType === 'health_organization') {
      console.log('Health organization member details:', {
        orgName,
        email,
        password,
      });
      registerHealthOrganization();
    } else if (memberType === 'insurance') {
      console.log('Insurance member details:', {
        insName,
        email,
        password,
      });
      registerInsurance();
    }
  }
  return (
<div className="u-body u-xl-mode">
      <section className="u-align-center u-clearfix u-section-login" id="sec-05d1">
        <div className="u-clearfix u-sheet u-sheet-1">
          <div className="u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">
            <div className="u-layout">
              <div className="u-layout-row">
                <div className="u-align-center u-container-style u-layout-cell u-size-30 u-layout-cell-1">
                  <div className="u-container-layout u-valign-middle u-container-layout-1">
                    <img className="u-image u-image-contain u-image-default u-image-1" src={register} 
                    alt="login" data-image-width="473" data-image-height="464" />
                  </div>
                </div>
                <div className="u-align-center u-container-style u-layout-cell u-palette-1-base u-radius-50 u-shape-round u-size-30 u-layout-cell-2">
                  <div className="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-xl u-container-layout-2">
                  {isWalletConnected ? (
                    <>
                      <div className="u-form u-login-control u-radius-50 u-white u-form-1">
                      <form onSubmit={handleSubmit} className="u-clearfix u-form-custom-backend u-form-spacing-29 u-form-vertical u-inner-form" name="form" style={{padding: "30px"}}>
                        <div className="u-form-group u-form-select u-form-group-2">
                          <label htmlFor="memberType" className="u-label">Member Type</label>
                          <div className="u-form-select-wrapper">
                            <select id="memberType" name="select" value={memberType} onChange={handleChange} className="u-border-1 u-border-grey-30 u-input u-input-rectangle u-white" required="required">
                              <option value="individual" data-calc="individual" defaultValue="selected">Individual</option>
                              <option value="health_organization" data-calc="health_organization">Health Organization</option>
                              <option value="insurance" data-calc="insurance">Insurance</option>
                            </select>
                            <svg className="u-caret u-caret-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" style={{fill: "currentColor"}} xmlSpace="preserve"><polygon className="st0" points="8,12 2,4 14,4 "></polygon></svg>
                          </div>
                        </div>
                        {memberType === 'individual' && (
                          <>
                          <div className="u-form-group u-form-name">
                              <label htmlFor="firstName" className="u-label">First Name *</label>
                              <input 
                                type="text" placeholder="Enter your first name" 
                                id="firstName" onChange={(e) => setFirstName(e.target.value)}
                                value={firstName} name="firstName" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                            </div>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="lastName" className="u-label">Last Name *</label>
                              <input 
                                type="text" placeholder="Enter your last name" 
                                id="lastName" onChange={(e) => setLastName(e.target.value)}
                                value={lastName} name="lastName" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                            </div>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="username" className="u-label">Username *</label>
                              <input 
                                type="text" placeholder="Enter your Username" 
                                id="username" onChange={(e) => setUsername(e.target.value)}
                                value={username} name="username" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                            </div>
                          </>
                        )}
                        {(memberType === 'health_organization' && !showHealthOrganizationInput) && (
                          <>  
                            <div className="no-more-registration">
                              Already registered Health Organization
                            </div>
                          </>
                        )}
                        {(memberType === 'insurance' && !showInsuranceInput) && (
                          <>  
                            <div className="no-more-registration">
                              Already registered Insurance
                            </div>
                          </>
                        )}
                        {((memberType === 'health_organization' && showHealthOrganizationInput) || (memberType === 'insurance' && showInsuranceInput)) && (
                          <>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="name" className="u-label">Name *</label>
                              <input 
                                type="text" placeholder="Enter your Name" 
                                id="name"
                                onChange={(e) =>
                                  memberType === 'health_organization'
                                    ? setOrgName(e.target.value)
                                    : setInsName(e.target.value)
                                }
                                value={orgName || insName} 
                                name="name" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                            </div>
                          </>
                        )}
                        {((memberType === 'health_organization' && showHealthOrganizationInput) || memberType === 'individual' || (memberType === 'insurance' && showInsuranceInput)) && (
                          <>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="email" className="u-label">Email *</label>
                              <input 
                                type="email" placeholder="Enter your Email" 
                                id="email" onChange={(e) => setEmail(e.target.value)}
                                value={email} name="email" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                            </div>
                            <div className="u-form-group u-form-password">
                              <label htmlFor="password" className="u-label">Password *</label>
                              <input 
                                type="password" 
                                placeholder="Enter your Password" id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name="password" className="u-input u-input-rectangle u-input-3" 
                                required="" 
                              />
                            </div>
                            <div className="u-align-left u-form-group u-form-submit">
                            <button href="#" className="u-border-none u-btn u-btn-submit u-button-style u-palette-3-base u-btn-2">Login</button>
                            <input type="submit" value="submit" className="u-form-control-hidden" />
                          </div>
                          </>
                        )}
                      </form>
                    </div>
                    <button onClick={navigateToLogin} className="u-border-active-palette-2-base u-border-hover-palette-1-base u-border-none u-btn u-button-style u-login-control u-login-create-account u-none u-text-hover-white u-text-palette-3-base u-btn-4">
                      Sign In?
                    </button>
                  </>
                  ) : (
                    <button className="btn-connect-to-wallet" onClick={connectWallet}>
                      Connect to wallet
                    </button>
                  )}
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

export default Register;
