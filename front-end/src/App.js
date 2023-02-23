import './App.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import UploadContract from './pages/health_contract/upload_contract';
import ViewContracts from './pages/health_contract/view_contracts';
import ChooseHealthContract from './pages/health_contract/sign_contract';
import { Web3Provider } from './Web3Context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/uploadcontract" element={<UploadContract />} />
          <Route path="/viewcontracts" element={<ViewContracts />} />
          <Route path="/choosecontract" element={<ChooseHealthContract />} />
        </Routes>
        <Footer />
      </Router>
    </Web3Provider>
  );
}


export default App;
