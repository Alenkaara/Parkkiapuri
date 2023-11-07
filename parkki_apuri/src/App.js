import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Reservation from './components/Reservation';
import EditUser from './components/EditUser';
import Startpage from './components/Startpage';
import InfoPage from './components/infoPage';
import parkkilogomuokattu from './components/images/parkkilogomuokattu.png';

// Footer funktio on sivun alaosassa oleva palkki, mikä voi sisältää haluttavaa sisältöä, yleensä tietoa ja linkkejä.
function Footer() {
  const linkStyle = {
    textDecoration: 'none',
    color: '#fff',
  };

  return (
    <footer
      style={{
        background: '#30494a',
        color: '#fff',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p>
          <Link to="/infopage" style={linkStyle}>
            Parkkiapuri
          </Link>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

function ParkingApp () {

  return (
    <BrowserRouter>
      <div>
        <Link to="/home"><img className="home-image" src={parkkilogomuokattu} /></Link>
        <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/edituser" element={<EditUser />} />
        <Route path="/infopage" element={<InfoPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default ParkingApp;