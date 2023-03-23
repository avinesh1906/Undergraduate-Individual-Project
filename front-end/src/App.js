import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import UploadContract from './pages/insurance/upload_contract/upload_contract';
import ViewContracts from './pages/insurance/view_health_contracts/view_health_contracts';
import ChooseHealthContract from './pages/individual/sign_contract/sign_contract';
import ViewSignedContract from './pages/health_contract/view_selected_contract';
import SubmitClaim from './pages/claim/submit_claim';
import RequestClaim from './pages/claim/request_claim';
import { Web3Provider } from './Web3Context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Home from './pages/home/home';
import Individual from './pages/individual/individual';
import ViewAllClaims from './pages/insurance/view_all/view_all';

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
              <Route path="/upload_health_contract" element={<UploadContract />} />
              <Route path="/view_health_contracts" element={<ViewContracts />} />
              <Route path="/sign_health_contract" element={<ChooseHealthContract />} />
              <Route path="/view_signed_contract" element={<ViewSignedContract />} />
              <Route path="/submit_claim" element={<SubmitClaim />} />
              <Route path="/request_claim" element={<RequestClaim />} />
              <Route path="/individual" element={<Individual />} />
              <Route path="/view_all" element={<ViewAllClaims />} />
            </Routes>  
        </UserContextProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;
