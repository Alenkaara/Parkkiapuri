import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Startpage.css';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';

const Startpage = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    // Navigate to the 'login' route when the "Sign In" button is clicked
    navigate('/login');
  };

  const handleCreateAccountClick = () => {
    // Navigate to the 'signup' route when the "Create Account" button is clicked
    navigate('/signup');
  };

  return (
    <div className="startpage-container">
      <div className="background-image"></div>
      <div className="logo-container">
        <img className="image-div" src={parkkilogomuokattu} />
      </div>
      <div className="startpage-content">
        <h1>Tervetuloa Parkki-apuriin</h1>
        <div className="button-container">
          <button className="signin-button" onClick={handleSignInClick}>
            Kirjaudu sisään
          </button>
          <button className="create-account-button" onClick={handleCreateAccountClick}>
            Luo käyttäjä
          </button>
        </div>
      </div>
    </div>
  );
};

export default Startpage;

//     background-image: url('https://wallpapers.com/images/high/seton-hall-university-car-garage-parking-yttxcieu8u2kr8rp.webp');

