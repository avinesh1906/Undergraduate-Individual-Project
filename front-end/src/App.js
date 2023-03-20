import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import UploadContract from './pages/health_contract/upload_contract';
import ViewContracts from './pages/health_contract/view_contracts';
import ChooseHealthContract from './pages/health_contract/sign_contract';
import ViewSignedContract from './pages/health_contract/view_selected_contract';
import SubmitClaim from './pages/claim/submit_claim';
import RequestClaim from './pages/claim/request_claim';
import { Web3Provider } from './Web3Context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Home from './pages/home/home';

function App() {
  return (
    <Web3Provider>
      <UserContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginForm />}/>
            <Route path="/uploadcontract" element={<UploadContract />} />
            <Route path="/viewcontracts" element={<ViewContracts />} />
            <Route path="/choosecontract" element={<ChooseHealthContract />} />
            <Route path="/view_signed_contract" element={<ViewSignedContract />} />
            <Route path="/submit_claim" element={<SubmitClaim />} />
            <Route path="/request_claim" element={<RequestClaim />} />
          </Routes>
        </Router>
      </UserContextProvider>
    </Web3Provider>
  );
}

export default App;
