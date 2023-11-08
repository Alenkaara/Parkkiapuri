import React, { useState, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';
import electricCar from './images/electric_car.png';
import './Home.css';

function Home() {
  let navigate = useNavigate();

  const [ hallDetails, setHallDetails ] = useState({});
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

  const handleParkingHallClick = async (parkingHall) => {
    try {
      const results = await axios.get(
        `https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-locations.json`
      );

      const hallInfo = results.data.result.find((hall) => hall.sijainti === parkingHall);
      setHallDetails(hallInfo);
      setActiveParkingHall(parkingHall);
      getParkingInfo(parkingHall);
    } catch (error) {
      console.error(error);
    }
  };

  const getReservations = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const response = await axios.get(
        `https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-reservation.json?userid=${userid}`
      );
      setReservations(response.data.result);
      localStorage.setItem("User_userid", response.data.result[0].User_userid);
      localStorage.setItem("endTime", response.data.result[0].endTime);
      localStorage.setItem("id", response.data.result[0].id);
      localStorage.setItem("parkki", response.data.result[0].parkki);
      localStorage.setItem("rekisteri", response.data.result[0].rekisteri);
      localStorage.setItem("sijainti", response.data.result[0].sijainti);
      localStorage.setItem("startTime", response.data.result[0].startTime);
      console.log(response.data.result);
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
    localStorage.clear(); // Tyhjentää localstoragen
    setIsLoggedIn(false);
    navigate("/", { replace: true });
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

  const getInfo = async () => {
    try {
      const results = await axios.get('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-locations.json');
  
      setInfo(results.data.result);
    } catch (error) {
      console.error(error);
    }
  };
  
  const getParkingInfo = async (parkingHallName) => {
    try {
      setParkingInfo([]);
  
      const encodedParkingHallName = encodeURIComponent(parkingHallName);
      const apiUrl = `https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-slots.json?id=${encodedParkingHallName}`;
  
      const response = await axios.get(apiUrl);
  
      if (response.data && response.data.result) {
        const parkingInfo = response.data.result.map((slot) => ({
          id: slot.idParkit,
          rekisteri: slot.rekisteri,
          vapaa: slot.vapaa,
          varattu: slot.varattu,
          tolppa: slot.tolppa,
          etaisyys: slot.etaisyys
        }));
        setParkingInfo(parkingInfo);
        setActiveParkingHall(parkingHallName);
        console.log(response.data.result);
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching parking info:', error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className='home-topBar'>
          <div className='home-loginInformation'>
            {localStorage.getItem("rekisteri") && (
              <Link to="/edituser" className='home-res-btn'>Kirjauduttu sisään käyttäjällä: {email}</Link>
            )}
          </div>
          {localStorage.getItem("id") ? (
            <div className='home-resInformation'>
              <span>Aktiiviset varaukset: Autopaikka {localStorage.getItem("id")}</span>
            </div>
          ) : (
            <div className='home-resInformationNull'>
              Ei varauksia.
            </div>
          )}
          <Link to="/reservation" className='home-res-btn'>Tee paikkavaraus</Link>
          <button onClick={handleLogout} className='home-buttonLogout'>Kirjaudu ulos</button>
        </div>
      ) : (
        <>
          { value => (<div>Login status: { value.jwt != null ? "Logged in": "Not logged in" }</div>) }
          <Link to="/login" className='home-login-btn'>Kirjaudu sisään</Link>
          <Link to="/signup" className='home-signup-btn'>Luo käyttäjä</Link>
        </>
      )}
      <div className="home-container">
        <img className="home-background-img"></img>

        <div className="home-wrapper">

          <div className='home-parking-halls'>
            {info.map((i, index) => {
              return (
                <div
                  key={index}
                  className={`home-parking-hall ${i.sijainti === activeParkingHall ? "active" : ""}`}
                  onClick={() => handleParkingHallClick(i.sijainti)}
                >
                  <div>{i.sijainti}</div>
                  <div>Vapaita paikkoja: {i.varattu} / {i.all}</div>
                </div>
              );
            })}
          </div>

          <div className="home-parking-hall-details">
            {activeParkingHall && hallDetails.sijainti === activeParkingHall && (
              <div>
                <img src={hallDetails.image} alt="Parking Hall" />
                <div className="home-parking-hall-location">Osoite: {hallDetails.osoite}</div>
                <div className="home-parking-hall-phone">Puhelin: {hallDetails.puhelin}</div>
              </div>
            )}
          </div>

          <div className="home-parking-spots" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {parkingInfo.map((spot, index) => (
              <div
                key={index}
                className={`home-parking-spot ${spot.vapaa ? 'available' : 'full'}`}
                style={{
                  width: '50px',
                  height: '65px',
                  margin: '7px',
                  border: '2px solid #466b69',
                  borderRadius: '5px',
                  backgroundColor: spot.vapaa ? '#4CAF50' : 'red',
                  color: 'white',
                  textAlign: 'center',
                  cursor: spot.vapaa ? 'pointer' : 'not-allowed',
                  flex: '0 0 calc(33.33% - 20px)' /* 33.33% width with margins */
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{spot.id} {spot.tolppa == '1' && (<span> 🗲 </span>)} </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;