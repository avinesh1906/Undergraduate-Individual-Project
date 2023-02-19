import './App.css';
import Register from './pages/register/Register';
import LoginForm from './pages/login/login';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';


function App() {
  return (
      <>
      <Navbar />
      <LoginForm />
      <Footer />
      </>
  );
}

export default App;
