import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import parkkilogomuokattu from './parkkilogomuokattu.png';
import './Home.css';
import Login from './Login';
import SignUp from './SignUp';

function Home() {

  // Footer funktio on sivun alaosassa oleva palkki, mikä voi sisältää haluttavaa sisältöä, yleensä tietoa ja linkkejä.
  function Footer() {
      return (
      <footer style={{
          background: "#30494a",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20px"
      }}>
          <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center"
          }}>
          <p>Parkkiapuri &copy; {new Date().getFullYear()}</p>
          </div>
      </footer>
      );
  }

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ info, setInfo ] = useState([]);
  const [ parkingInfo, setParkingInfo ] = useState([]);
  const [ activeParkingHall, setActiveParkingHall ] = useState(null);
  const [ refreshInterval, setRefreshInterval ] = useState(null);
  const [ reservations, setReservations ] = useState([]);
  const rekisteri = localStorage.getItem("rekisteri");
  const email = localStorage.getItem("email");
  const id = localStorage.getItem("id");
  const etaisyys = localStorage.getItem("etaisyys");
  const varattu = localStorage.getItem("varattu");
  const sensor = localStorage.getItem("sensor");
  const Parkkitalo_id = localStorage.getItem("Parkkitalo_id");

  const getReservations = async () => {
    try {
      const response = await axios.get(
        "https://13.51.255.38:3000/res",
        {
          rekisteri: rekisteri
        }
      );
      setReservations(response.data);
      localStorage.setItem("id", response.data[0].id);
      localStorage.setItem("etaisyys", response.data[0].etaisyys);
      localStorage.setItem("varattu", response.data[0].varattu);
      localStorage.setItem("sensor", response.data[0].sensor);
      localStorage.setItem("Parkkitalo_id", response.data[0].Parkkitalo_id);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (isLoggedIn==true) {
      getReservations();
    }
  }, []);

  // Kirjautumisen yhteydessä tallentaa kirjautumistokenin paikallisesti, tässä se haetaan
  useEffect(() => {
    const token = localStorage.getItem('rekisteri');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rekisteri');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    setIsLoggedIn(false);
  };

  // Suoritetaan sivun latautumisen yhteydessä
  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (activeParkingHall) {
      getParkingInfo(activeParkingHall);
      setRefreshInterval(setInterval(() => {
        getParkingInfo(activeParkingHall);
      }, 60000)); // Määrittää minuutin ajastimen, jonka jälkeen haku tehdään uudestaan itsestään parkkipaikoista.
    }
    return () => {
      clearInterval(refreshInterval);
    }
  }, [activeParkingHall]);

  // Getinfo hakee parkkihallien nimet ja vapaat paikat tietokannasta rest apin kautta.
  const getInfo = async () => {
    try {
      const results = await axios.get('https://13.51.255.38:3000', {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + UserAuthContextValue.jwt  // Tämä voidaan ottaa käyttöön jos sivulla on kirjautuminen käytössä.
          }
      });

      setInfo(results.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Getparkinginfo hakee tiedot parkkipaikoista, boolean arvona on joko true (vihreä/vapaa) tai false (punainen/käytössä).
  const getParkingInfo = async (parkingHallName) => {
    try {
      setParkingInfo([]);

      const results = await axios.get(`https://13.51.255.38:3000/${parkingHallName}`, {
        headers: {
          'Content-Type': 'application/json',
          }
      });

      setParkingInfo(results.data);
      setActiveParkingHall(parkingHallName); // Asettaa aktiivisen parkkihallin
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div className="container">
      <div className="wrapper">
          <img className="image-div" src={parkkilogomuokattu} />
          <div className='topBar'>

          <div className='loginInformation'> {localStorage.getItem("rekisteri") &&
          <span>Kirjauduttu sisään käyttäjällä: {email}</span>} </div>
          {isLoggedIn ? (
          <div>
            {localStorage.getItem("id") ? (
            <div className='resInformation'>
              <span>Aktiivinen varaukset: Autopaikka {localStorage.getItem("id")} </span>
            </div>
          ) : (
            <div className='resInformationNull'>
              Ei varauksia.
            </div>
          )}
            <Link to="/reservation" className='res-btn'>Tee paikkavaraus</Link>
            <button onClick={handleLogout} className='buttonLogout'>Kirjaudu ulos</button>
          </div>
          ) : (
              <>
                { value => (<div>Login status: { value.jwt != null ? "Logged in": "Not logged in" }</div>) }
              <Link to="/login" className='login-btn'>Kirjaudu sisään</Link>
              <Link to="/signup" className='signup-btn'>Luo käyttäjä</Link>
              </>
          )}
          </div>
          <div className='parking-halls'>
          {info.map((i, index) => {
              return (
              <div
                  key={index}
                  className={`parking-hall ${i.sijainti === activeParkingHall ? "active" : ""}`}
                  onClick={() => getParkingInfo(i.sijainti)}
              >
                  <div>{i.sijainti}</div>
                  <div>Vapaita paikkoja: {i.vapaa}</div>
              </div>
              );
          })}
          </div>
          <div className="table-wrapper">
          <table className="parking-spots-table">
              <thead>
              <tr>
                  <th>Parkkipaikka</th>
                  <th>Saatavuus</th>
              </tr>
              </thead>
              <tbody>
              {parkingInfo.map((i, index) => {
                  return (
                  <tr key={index}>
                      <td>Autopaikka: {String(i.idParkit)}</td>
                      <td className={i.vapaa ? "available" : "full"}>
                      {i.vapaa ? "Saatavilla" : "Käytössä"}
                      </td>
                  </tr>
                  );
              })}
              </tbody>
          </table>
          </div>
          <Footer />
      </div>
      </div>
  );
}

export default Home;
