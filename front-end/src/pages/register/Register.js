import { ethers } from 'ethers';
import React, { useState, useContext, useEffect } from 'react';
import IndividualContract from '../../contracts/individual.json';
import HealthOrganizationContract from '../../contracts/HealthOrganization.json';
import InsuranceContract from '../../contracts/insuranceprovider.json';
import ClaimContract from '../../contracts/ClaimContract.json'
import contractAddresses from '../../config';
import { Web3Context } from '../../Web3Context';
import { UserContext } from '../../UserContext';
import { useNavigate  } from "react-router-dom";
import register from '../../images/register.png';
import './styles.css';
import Loader from '../../components/loader/loader';

const IndividualContractAddress = contractAddresses.Individual;
const HealthOrganizationContractAddress = contractAddresses.HealthOrganization;
const InsuranceProviderAddress = contractAddresses.InsuranceProvider;
const ClaimContractAddress = contractAddresses.ClaimContract;


const Register = () => {
  const [memberType, setMemberType] = useState('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [usernameToBeAdded, setUsernameToBeAdded] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [insName, setInsName] = useState('');
  const { provider, signer } = useContext(Web3Context);
  const navigate  = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showInsuranceInput, setShowInsuranceInput] = useState(false);
  const [showHealthOrganizationInput, setShowHealthOrganizationInput] = useState(false);

  useEffect(() => {
    setErrors({});
  }, [memberType]);

  const {
    isWalletConnected,
    connectWallet,
    setUsername, login, setLoggedMemberType
  } = useContext(UserContext);

  const validate = () => {
    const errors = {};
    if (memberType === 'individual'){
      // First Name validation
      if (!firstName) {
        errors.firstName = 'First Name is required';
      } else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(firstName)) {
        errors.firstName = 'Please enter a valid first name';
      }

      // Last Name validation
      if (!lastName) {
        errors.lastName = 'Last Name is required';
      } else if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(lastName)) {
        errors.lastName = 'Please enter a valid last name';
      }

      // Username validation
      if (!usernameToBeAdded) {
        errors.usernameToBeAdded = 'Username is required';
      } else if (!/^[a-zA-Z0-9]+$/.test(usernameToBeAdded)) {
        errors.usernameToBeAdded = 'Username can only contain letters and numbers';
      }
    }
  
    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address (e.g. johndoe@example.com)';
    }
  
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=[\]{}|\\:;"'<>,.?/~`]).{8,}/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character';
    }

    // Organization Name validation
    if (memberType === 'health_organization' && showHealthOrganizationInput && !orgName) {
      errors.orgName = 'Organization Name is required';
    } else if (orgName && !/^[a-zA-Z0-9\s\-#&]+$/i.test(orgName)) {
      errors.orgName = 'Organization Name can only contain letters, numbers, spaces, hyphens, hash symbols (#), and ampersands (&)';
    }

    // Institution Name validation
    // Institution Name validation
    if (memberType === 'insurance' && showInsuranceInput && !insName) {
      errors.insName = 'Institution Name is required';
    } else if (insName && !/^[a-zA-Z0-9\s\-#&]+$/i.test(insName)) {
      errors.insName = 'Institution Name can only contain letters, numbers, spaces, hyphens, hash symbols (#), and ampersands (&)';
    }

    setErrors(errors);
    return errors;
  };


  const navigateToLogin = () => {
    navigate("/login");
  };
  async function registerIndividual() {
    setIsLoading(true);
    // Get the event signature
    const eventSignature = ethers.utils.id("LogInsuredPersonRegistered(uint32,string)");
    const individualContract = new ethers.Contract(IndividualContractAddress, IndividualContract.abi, signer);
    try {
      const tx  = await individualContract.registerIndividual(firstName, lastName, usernameToBeAdded, email, password);
      const receipt  = await  provider.waitForTransaction(tx.hash);
      if (receipt.status === 1) {
        // check the logs for the LogInsuredPersonRegistered event
        receipt.logs.forEach(log => {
          if (log.topics[0] === eventSignature) {
            const event = individualContract.interface.parseLog(log);
            setUsername(event.args[1]);
            setLoggedMemberType(memberType);
            login();
            navigate("/individual/view_claims");
          } else {
            console.log('Transaction failed');
          }
        });
      } else {
        console.log('Transaction failed');
      }
    } catch (error) {
      const newErrorMessage = "Username already exists.";
      setErrors(prevState => ({
        ...prevState,
        username: newErrorMessage
      }));
    }
    
    setIsLoading(false);

  }

  async function connectInsuranceAddress(){
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    const tx2  = await claimContract.setInsuranceCompanyAddress();
    const receipt2  = await  provider.waitForTransaction(tx2.hash);
    if (receipt2.status === 1) {
      console.log('Transaction successful');
      // check the logs for the HealthOrganizationAddressSetup event
      receipt2.logs.forEach(log => {
      const event = claimContract.interface.parseLog(log);
      console.log(event.args);
      });
    } else {
      console.log('Transaction failed');
    }
  }

  async function connectHealthInsurance(){
    const claimContract = new ethers.Contract(ClaimContractAddress, ClaimContract.abi, signer);
    const tx  = await claimContract.setHealthOrganizationAddress();
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the HealthOrganizationAddressSetup event
      receipt.logs.forEach(log => {
      const event = claimContract.interface.parseLog(log);
      console.log(event.args);
      });
    } else {
      console.log('Transaction failed');
    }
  }

  async function registerHealthOrganization() {
    setIsLoading(true);
    // Get the event signature
    const eventSignature = ethers.utils.id("LogRegisterdHO(string)");
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const tx  = await healthOrganizationContract.registerHealthOrganization(orgName,email, password);
    const receipt  = await  provider.waitForTransaction(tx.hash);
    if (receipt.status === 1) {
      console.log('Transaction successful');
      // check the logs for the LogInsuredPersonRegistered event
      receipt.logs.forEach(async log => {
        if (log.topics[0] === eventSignature) {
          const event = healthOrganizationContract.interface.parseLog(log);
          await connectHealthInsurance();
          setUsername(event.args[0]);
          setLoggedMemberType(memberType);
          login();
          navigate("");
        } else {
          console.log('Transaction failed');
        }
      });
    } else {
      console.log('Transaction failed');
    }
    setIsLoading(false);
  }

  async function registerInsurance() {
    setIsLoading(true);
    // Get the event signature
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    try {
      const tx  = await insuranceContract.registerProvider(insName,email, password);
      const receipt  = await  provider.waitForTransaction(tx.hash);
      if (receipt.status === 1) {
        // check the logs for the NewProvider event
        receipt.logs.forEach(async log => {
          const event = insuranceContract.interface.parseLog(log);
          await connectInsuranceAddress();
          setUsername(event.args[0]);
          setLoggedMemberType(memberType);
          login();
          navigate("/insurance/view_claims");
        });
      } else {
        console.log('Transaction failed');
      }
    } catch(error){
      console.log("Username already exists")
    }
    
    
    setIsLoading(false);
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
    setIsLoading(true);
    const healthOrganizationContract = new ethers.Contract(HealthOrganizationContractAddress, HealthOrganizationContract.abi, signer);
    const response  = await healthOrganizationContract.isHealthOrganizationRegistered();
    setShowHealthOrganizationInput(!response);   
    setIsLoading(false);
  }

  async function isInsuranceRegistered(){
    setIsLoading(true);
    const insuranceContract = new ethers.Contract(InsuranceProviderAddress, InsuranceContract.abi, signer);
    const response  = await insuranceContract.isInsuranceRegistered();
    setShowInsuranceInput(!response);   
    setIsLoading(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      // Add logic to handle form submission
      // handle form submission based on member type
      if (memberType === 'individual') {
        registerIndividual();
      } else if (memberType === 'health_organization') {
        registerHealthOrganization();
      } else if (memberType === 'insurance') {
        registerInsurance();
      }
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
                              {errors.firstName && <label className="u-label" style={{"color": "red"}}>{errors.firstName}</label>}
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
                              {errors.lastName  && <label className="u-label" style={{"color": "red"}}>{errors.lastName }</label>}
                            </div>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="username" className="u-label">Username *</label>
                              <input 
                                type="text" placeholder="Enter your Username" 
                                id="username" onChange={(e) => setUsernameToBeAdded(e.target.value)}
                                value={usernameToBeAdded} name="username" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                              {errors.usernameToBeAdded && <label className="u-label" style={{"color": "red"}}>{errors.usernameToBeAdded  }</label>}
                              {errors.username  && <label className="u-label" style={{"color": "red"}}>{errors.username }</label>}
                            </div>
                          </>
                        )}
                        {(memberType === 'health_organization' && !showHealthOrganizationInput) && (
                          <>  
                            <div className="no-more-registration"
                              style={{ 
                              display: isLoading ? "none" : "block", 
                              color: "red" 
                            }}
                            >
                              Already registered Health Organization
                            </div>
                            <div className="loader-div" 
                            style={{ display: isLoading ? "block" : "none" }}
                            >  
                              <Loader/>
                            </div>
                          </>
                        )}
                        {(memberType === 'insurance' && !showInsuranceInput) && (
                          <>  
                            <div className="no-more-registration"
                              style={{ 
                                display: isLoading ? "none" : "block", 
                                color: "red" 
                              }}
                            >
                              Already registered Insurance
                            </div>
                            <div className="loader-div" 
                            style={{ display: isLoading ? "block" : "none" }}
                            >  
                              <Loader/>
                            </div>
                          </>
                        )}
                        {(memberType === 'health_organization' && showHealthOrganizationInput) && (
                          <>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="name" className="u-label">Name *</label>
                              <input 
                                type="text" placeholder="Enter the organization name" 
                                id="name"
                                onChange={(e) =>
                                   setOrgName(e.target.value)
                                }
                                value={orgName} 
                                name="name" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                              {errors.orgName && <label className="u-label" style={{"color": "red"}}>{errors.orgName}</label>}
                            </div>
                          </>
                        )}
                        { (memberType === 'insurance' && showInsuranceInput) && (
                          <>
                            <div className="u-form-group u-form-name">
                              <label htmlFor="name" className="u-label">Name *</label>
                              <input 
                                type="text" placeholder="Enter the insurance name" 
                                id="name"
                                onChange={(e) =>
                                  setInsName(e.target.value) 
                                }
                                value={insName} 
                                name="name" 
                                className="u-input u-input-rectangle u-input-2" 
                                required="" 
                              />
                              {errors.insName && <label className="u-label" style={{"color": "red"}}>{errors.insName}</label>}
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
                              {errors.email && <label className="u-label" style={{"color": "red"}}>{errors.email}</label>}
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
                              {errors.password && <label className="u-label" style={{"color": "red"}}>{errors.password}</label>}
                            </div>
                            <div 
                              className="u-align-left u-form-group u-form-submit"
                              style={{ display: isLoading ? "none" : "block" }}
                            >
                              <button href="#" className="u-border-none u-btn u-btn-submit u-button-style u-palette-3-base u-btn-2">Register</button>
                              <input type="submit" value="submit" className="u-form-control-hidden" />
                            </div>
                            <div className="loader-div" style={{ display: isLoading ? "block" : "none" }}>  
                              <Loader/>
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
