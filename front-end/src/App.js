import './App.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
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
        </Routes>
        <Footer />
      </Router>
    </Web3Provider>
  );
}


export default App;
