import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/registration');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="hero">
      <div className="hero-section">
        <h1>Welcome to NIELIT Buxar</h1>
        <p>National Institute of Electronics & Information Technology</p>
        <p className="subtitle-hindi">राष्ट्रीय इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी संस्थान</p>
        <p className="subtitle-desc">Empowering India's Digital Future Through Technology and Innovation</p>
        <div className="button-group">
          <button className="explore-btn" onClick={handleExplore}>Apply</button>
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
