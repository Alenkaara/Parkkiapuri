import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';

export default function Reservation() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [availableSpots, setAvailableSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState('');
  const [reservationTime, setReservationTime] = useState(0);
  const [userReservations, setUserReservations] = useState([]);
  const [parkingSpot, setParkingSpot] = useState('');
  const [error, setError] = useState(null);

  // Hakee parkkisijainnit sivun ladatessa
  useEffect(() => {
    axios.get('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-locations.json')
      .then((response) => {
        setLocations(response.data.result);
      })
      .catch((error) => {
        setError('Error fetching parking locations: ' + error.message);
      });
  }, []);

  // Hakee parkkipaikat kun nappia painetaan sivulla
  useEffect(() => {
    if (selectedLocation) {
      axios.get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-slots.json?id=${selectedLocation}`)
        .then((response) => {
          setAvailableSpots(response.data.result);
        })
        .catch((error) => {
          setError('Error fetching available spots: ' + error.message);
        });
    }
  }, [selectedLocation]);

  // Hakee käyttäjän varaukset
  useEffect(() => {
    const userId = localStorage.getItem("userid");
    if (userId) {
      axios.get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-reservation.json?userid=${userId}`)
        .then((response) => {
          setUserReservations(response.data.result);
        })
        .catch((error) => {
          setError('Error fetching user reservations: ' + error.message);
        });
    }
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setSelectedSpot('');
  };

  const handleSpotClick = (spot) => {
    setParkingSpot(spot);
    setSelectedSpot(spot);
  };

  // Luo varauksen
  const makeReservation = () => {
    if (!parkingSpot || !reservationTime) {
      setError('Please select a parking spot and reservation time.');
      return;
    }
  
    const userId = localStorage.getItem("userid");
    const idParkit = parkingSpot;

      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 2);
      const formattedStartTime = startTime.toISOString().substr(11, 8);
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(reservationTime) + 2);
    const formattedEndTime = `${endTime.toISOString().substr(11, 8)}`;
  
    const rekisteri = localStorage.getItem("rekisteri");
    const sijainti = selectedLocation;
  
    axios.post('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/add-reservation.json', {
      userid: userId,
      idParkit: idParkit,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      rekisteri: rekisteri,
      sijainti: sijainti,
    })
      .then((response) => {
        if (response.data.result === 'successful') {
          // Onnistunut varaus
          updateUserReservations();
          setError(null);
          setParkingSpot('');
          setSelectedSpot('');
        } else {
          setError('Reservation failed. Spot might be already reserved.');
        }
      })
      .catch((error) => {
        setError('Error making reservation: ' + error.message);
      });
  };

  const updateUserReservations = () => {
    const userId = localStorage.getItem("userid");
    axios.get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-reservation.json?userid=${userId}`)
      .then((response) => {
        setUserReservations(response.data.result);
      })
      .catch((error) => {
        setError('Error updating user reservations: ' + error.message);
      });
  };

  const handleReservationDelete = (reservationId) => {
    axios.post('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/delete-reservation.json', {
      id: reservationId,
    })
      .then((response) => {
        if (response.data.result === 'successful') {
          console.log("Onnistuneesti poistettiin varaus")
          // Poistettu varaus onnistuneesti
          updateUserReservations();
          setError(null);
          window.location.reload();
        } else {
          setError('Error deleting reservation.');
          console.log("Varauksen poisto epäonnistui.")
        }
      })
      .catch((error) => {
        setError('Error deleting reservation: ' + error.message);
      });
  };

  const handleDecreaseHour = () => {
    setReservationTime((prevTime) => Math.max(prevTime - 1, 0));
  };
  
  const handleIncreaseHour = () => {
    setReservationTime((prevTime) => Math.min(prevTime + 1, 24));
  };

  return (
    <div className="reservation-container">
      <div className="reservation-top-right-button-container">
      </div>
      <img className="reservation-background-image" />
      <div className="reservation-location-container">
        <h2>Parkkihallit:</h2>
        <ul>
          {locations.map((location) => (
            <li key={location.sijainti}>
              <button
                onClick={() => handleLocationClick(location.sijainti)}
                className={location.sijainti === selectedLocation ? 'selected' : ''}
              >
                {location.sijainti}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="reservation-spot-container">
        <h2>Vapaat paikat:</h2>
        <ul>
          {availableSpots.map((spot) => (
            <li key={spot.idParkit}>
              {spot.vapaa ? (
                <button
                  onClick={() => handleSpotClick(spot.idParkit)}
                  className={spot.idParkit === selectedSpot ? 'selected' : ''}
                >
                  {spot.idParkit}
                </button>
              ) : (
                <span className="reservation-unavailable-spot">{spot.idParkit}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="reservation-time-container">
        <h2>Varauksen kesto:</h2>
        <div className="reservation-time-controls">
          <button onClick={handleDecreaseHour}>-1 Tunti</button>
          <button onClick={handleIncreaseHour}>+1 Tunti</button>
        </div>
        <div className="reservation-selected-time">
          {reservationTime > 0 && (
            <p>Valittu aika: {reservationTime} Tunti(a)</p>
          )}
        </div>
      </div>
      <div className="reservation-reserve-button-container">
        <button
          onClick={makeReservation}
          disabled={!parkingSpot || !reservationTime}
          className={`reservation-reserve-button ${(!parkingSpot || !reservationTime) ? 'disabled' : ''}`}
        >
          Luo varaus
        </button>
        {error && <div className="reservation-error-message">{error}</div>}
      </div>
      <div className="reservation-user-reservations">
        <h2>Sinun varaukset:</h2>
        <ul>
          {userReservations.map((reservation) => (
            <li key={reservation.id}>
              <div className="reservation-details">
                <p>Parkkihalli: {reservation.sijainti}</p>
                <p>Parkkipaikka: {reservation.parkki}</p>
                <p>Auto: {reservation.rekisteri}</p>
                <p>Varaus alkoi: {reservation.startTime}</p>
                <p>Varaus loppuu: {reservation.endTime}</p>
                <button className="reservation-deleteButton" onClick={() => handleReservationDelete(reservation.id)}>poista varaus</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
