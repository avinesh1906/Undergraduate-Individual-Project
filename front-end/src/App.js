import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import UploadContract from './pages/insurance/upload_contract/upload_contract';
import ViewContracts from './pages/insurance/view_health_contracts/view_health_contracts';
import ChooseHealthContract from './pages/individual/sign_contract/sign_contract';
import ViewSignedContract from './pages/individual/view_signed_contract/view_signed_contract';
import RequestClaim from './pages/individual/request_claim/request_claim';
import { Web3Provider } from './Web3Context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Home from './pages/home/home';
import ViewAllClaims from './pages/insurance/view_all/view_all';
import ViewIndividualClaim from './pages/individual/view_claim/view_claim';
import ViewHIOClaims from './pages/healthOrganization/view_claim/view_claim';
import SubmitClaim from './pages/healthOrganization/submit_claim/submit_claim';

function App() {
  return (
    <Router>
      <Web3Provider>
        <UserContextProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LoginForm />}/>

              <Route path="/insurance/upload_health_contract" element={<UploadContract />} />
              <Route path="/insurance/view_health_contracts" element={<ViewContracts />} />
              <Route path="/insurance/view_claims" element={<ViewAllClaims />} />

              <Route path="/individual/sign_health_contract" element={<ChooseHealthContract />} />
              <Route path="/individual/view_signed_contract" element={<ViewSignedContract />} />
              <Route path="/individual/request_claim" element={<RequestClaim />} />
              <Route path="/individual/view_claims" element={<ViewIndividualClaim />} />

              <Route path="/hio/view_claims" element={<ViewHIOClaims />} />
              <Route path="/hio/submit_claim" element={<SubmitClaim />} />
            </Routes>  
        </UserContextProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;
