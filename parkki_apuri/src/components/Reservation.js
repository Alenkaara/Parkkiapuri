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

  // Fetch parking locations
  useEffect(() => {
    axios.get('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-locations.json')
      .then((response) => {
        setLocations(response.data.result);
      })
      .catch((error) => {
        setError('Error fetching parking locations: ' + error.message);
      });
  }, []);

  // Fetch available spots based on selected location
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

  // Fetch user reservations
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

  const makeReservation = () => {
    if (!parkingSpot || !reservationTime) {
      setError('Please select a parking spot and reservation time.');
      return;
    }
  
    const userId = localStorage.getItem("userid");
    const idParkit = parkingSpot;

      // Updated startTime to set it 2 hours ahead
      const startTime = new Date();
      startTime.setHours(startTime.getHours() + 2);
      const formattedStartTime = startTime.toISOString().substr(11, 8);
    
    // Calculate the end time based on the reservation time
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(reservationTime) + 2); // Add hours
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
          // Reservation successful, update user reservations
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

  // const calculateEndTime = (hours) => {
  //   const now = new Date()+
  //   now.setHours(now.getHours() + hours);
  //   return now.toISOString().substr(11, 8);
  // };

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
          // Reservation deleted, update user reservations
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
    // Decrease the reservation time by one hour, ensuring it doesn't go negative
    setReservationTime((prevTime) => Math.max(prevTime - 1, 0));
  };
  
  const handleIncreaseHour = () => {
    // Increase the reservation time by one hour, ensuring it doesn't exceed 24 hours
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
          {/* Add more buttons for different time intervals if needed */}
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
} //https://p.turbosquid.com/ts-thumb/eo/6V4Okm/WD/car_park_0006/jpg/1675357572/1920x1080/fit_q87/8ad931ba667c80fd249b6265e262a84f12871b75/car_park_0006.jpg


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Reservation = () => {
//   const [locations, setLocations] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [availableSpots, setAvailableSpots] = useState([]);
//   const [selectedSpot, setSelectedSpot] = useState('');
//   const [reservationTime, setReservationTime] = useState(0);
//   const [userReservations, setUserReservations] = useState([]);
//   const [parkingSpot, setParkingSpot] = useState('');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch locations from the backend
//     axios.get('https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-locations.json')
//       .then((response) => {
//         setLocations(response.data.result);
//       })
//       .catch((error) => {
//         console.error('Error fetching locations:', error);
//       });
//   }, []);

//   // Handle location selection
//   const handleLocationSelect = (location) => {
//     setSelectedLocation(location);
//     // Fetch parking slots based on the selected location
//     axios.get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-slots.json?id=${location.sijainti}`)
//       .then((response) => {
//         setParkingSlots(response.data.result);
//       })
//       .catch((error) => {
//         console.error('Error fetching parking slots:', error);
//       });
//   };

//   useEffect(() => {
//     // Fetch user reservations based on the user's ID
//     const userId = localStorage.getItem('userid');
//     axios.get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-reservation.json?userid=${userId}`)
//       .then((response) => {
//         setUserReservations(response.data.result);
//       })
//       .catch((error) => {
//         console.error('Error fetching user reservations:', error);
//       });
//   }, []);


//   // ... the rest of your component

//   return (
//     <div className="reservationContainer">
//       <div className="locationContainer">
//         <h2>Parking Locations:</h2>
//         <ul>
//           {locations.map((location) => (
//             <li key={location.sijainti}>
//               <button
//                 onClick={() => handleLocationClick(location.sijainti)}
//                 className={location.sijainti === selectedLocation ? 'selected' : ''}
//               >
//                 {location.sijainti}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="spotContainer">
//         <h2>Available Spots:</h2>
//         <ul>
//           {availableSpots.map((spot) => (
//             <li key={spot.idParkit}>
//               {spot.vapaa ? (
//                 <button
//                   onClick={() => handleSpotClick(spot.idParkit)}
//                   className={spot.idParkit === selectedSpot ? 'selected' : ''}
//                 >
//                   {spot.idParkit}
//                 </button>
//               ) : (
//                 <span className="unavailableSpot">{spot.idParkit}</span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="reservationTimeContainer">
//         <h2>Reservation Time:</h2>
//         {/* Your reservation time controls and display */}
//       </div>
//       <div className="userReservations">
//         <h2>Your Reservations:</h2>
//         <ul>
//           {userReservations.map((reservation) => (
//             <li key={reservation.id}>
//               <button>{reservation.idParkit}</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="reserveButtonContainer">
//         <button
//           onClick={makeReservation}
//           disabled={!parkingSpot || !reservationTime}
//           className={`reserveButton ${(!parkingSpot || !reservationTime) ? 'disabled' : ''}`}
//         >
//           Reserve Spot
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Reservation;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Reservation.css';

// export default function Reservation() {
//   const [parkingSpot, setParkingSpot] = useState('');
//   const [reservationTime, setReservationTime] = useState(1);
//   const [availableSpots, setAvailableSpots] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const fetchAvailableSpots = () => {
//     axios
//       .get(`https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/get-slots.json?id={sijainti}`)
//       .then((response) => {
//         if (response.data.result) {
//           const available = response.data.result.filter((spot) => spot.vapaa === true);
//           setAvailableSpots(available);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching available spots:', error);
//       });
//   };

//   useEffect(() => {
//     fetchAvailableSpots();
//   }, []);

//   const handleReservation = () => {
//     if (!parkingSpot || !reservationTime) {
//       setErrorMessage('Please select a parking spot and reservation time.');
//       return;
//     }

//     const userid = 'your_userid';
//     const idParkit = 'your_idParkit';
//     const rekisteri = 'your_rekisteri';
//     const sijainti = 'your_sijainti';

//     axios({
//       method: 'post',
//       data: {
//         userid,
//         idParkit,
//         startTime: 'your_startTime',
//         endTime: 'your_endTime',
//         rekisteri,
//         sijainti,
//       },
//       url: 'https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/add-reservation.json',
//     })
//       .then((response) => {
//         if (response.data.result === 'successful') {
//           setSuccessMessage('Reservation successful.');
//           setErrorMessage('');
//         } else if (response.data.result.error === 'Reservation cannot be made over other reservation') {
//           setErrorMessage('Reservation cannot be made over another reservation.');
//           setSuccessMessage('');
//         } else {
//           setErrorMessage('An error occurred during reservation.');
//           setSuccessMessage('');
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//         setErrorMessage('An error occurred during reservation.');
//         setSuccessMessage('');
//       });
//   };

//   return (
//     <div className="reservation-container">
//       <h1>Make a Reservation</h1>
//       <div className="error-message">{errorMessage}</div>
//       <div className="success-message">{successMessage}</div>
//       <div className="form">
//         <label>Select a Parking Spot:</label>
//         <select
//           value={parkingSpot}
//           onChange={(e) => setParkingSpot(e.target.value)}
//         >
//           <option value="">Select a spot</option>
//           {availableSpots.map((spot) => (
//             <option key={spot.idParkit} value={spot.idParkit}>
//               {spot.idParkit}
//             </option>
//           ))}
//         </select>
//         <label>Select Reservation Time (in hours):</label>
//         <input
//           type="number"
//           value={reservationTime}
//           onChange={(e) => setReservationTime(e.target.value)}
//         />
//         <button onClick={handleReservation}>Make Reservation</button>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Reservation.css';

// export default function Reservation () {

//   let navigate = useNavigate();

//   const [ parkingSpot, setParkingSpot ] = useState('');
//   const [ currentPage, setCurrentPage ] = useState(1);
//   const [ spots, setSpots ] = useState(Array(30).fill(false));
//   const [ selectedSpot, setSelectedSpot ] = useState('');
//   const [ reservationTime, setReservationTime ] = useState(0);
//   const [ rotation, setRotation ] = useState(0);
//   const [ currentTime, setCurrentTime ] = useState(new Date());
//   const [ additionalHour, setAdditionalHour ] = useState(0);

//   useEffect(() => {
//     // Update the current time every second
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   const handleSpotClick = (spotNumber) => {
//     setParkingSpot(spotNumber);
//     setSelectedSpot(spotNumber);
//   };

//   // handlePageChange säätelee nykyistä sivua, mistä valita paikka
//   const handlePageChange = (direction) => {
//     if (direction === 'prev' && currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     } else if (direction === 'next' && currentPage < 3) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handleDecreaseHour = () => {
//     // Decrease the additional hour
//     setAdditionalHour((prevHour) => prevHour - 1);
//   };

  
//   const handleIncreaseHour = () => {
//     // Increase the additional hour
//     setAdditionalHour((prevHour) => prevHour + 1);
//   };

//     // reserve ottaa parametrit 'id' sekä 'rekisteri' ja syöttää ne.
//     const reserve = () => {
//       if (!parkingSpot || !reservationTime) {
//         return; // Don't proceed if parking spot or reservation time is not selected
//       }
  
//       // Calculate the end time based on the reservation time
//       const now = new Date();
//       const endTime = new Date(now.getTime() + (reservationTime + additionalHour) * 60 * 60 * 1000); // Add hours
//       const formattedEndTime = endTime.toISOString().substr(11, 8); // Format as hh:mm:ss
  
//       const userid = localStorage.getItem("userid");
//       const idParkit = localStorage.getItem("idParkit");
//       const startTime = now.toISOString().substr(11, 8); // Format as hh:mm:ss
//       const rekisteri = localStorage.getItem("rekisteri");
//       const sijainti = localStorage.getItem("sijainti");
  
//       axios({
//         method: "post",
//         data: {
//           userid: userid,
//           idParkit: idParkit,
//           startTime: startTime,
//           endTime: formattedEndTime,
//           rekisteri: rekisteri,
//           sijainti: sijainti,
//         },
//         url:
//           "https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/add-reservation.json",
//       })
//         .then((response) => {
//           if (response.data.result) {
//             // Check for success or error response based on the backend format
//             if (response.data.result.error === "Reservation cannot be made over other reservation") {
//               console.log("Reservation cannot be made over another reservation.");
//             } else if (response.data.result === "successful") {
//               console.log("Reservation successful.");
//               // Handle success as needed (e.g., navigate to a success page)
//               navigate("/");
//             }
//           } else {
//             console.error("Invalid response data:", response.data);
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     };
  // // reserve ottaa parametrit 'id' sekä 'rekisteri' ja syöttää ne.
  // const reserve = () => {
  //   if (!parkingSpot || !reservationTime) {
  //     return; // Don't proceed if parking spot or reservation time is not selected
  //   }
  
  //   // Calculate the end time based on the reservation time
  //   const now = new Date();
  //   const endTime = new Date(now.getTime() + reservationTime * 60 * 60 * 1000); // Add hours
  //   const formattedEndTime = endTime.toISOString().substr(11, 8); // Format as hh:mm:ss
  
  //   const userid = localStorage.getItem("userid");
  //   const idParkit = localStorage.getItem("idParkit");
  //   const startTime = now.toISOString().substr(11, 8); // Format as hh:mm:ss
  //   const rekisteri = localStorage.getItem("rekisteri");
  //   const sijainti = localStorage.getItem("sijainti");
  
  //   axios({
  //     method: "post",
  //     data: {
  //       userid: userid,
  //       idParkit: idParkit,
  //       startTime: startTime,
  //       endTime: formattedEndTime,
  //       rekisteri: rekisteri,
  //       sijainti: sijainti,
  //     },
  //     url:
  //       "https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/add-reservation.json",
  //   })
  //     .then((response) => {
  //       if (response.data.result) {
  //         // Check for success or error response based on the backend format
  //         if (response.data.result.error === "Reservation cannot be made over other reservation") {
  //           console.log("Reservation cannot be made over another reservation.");
  //         } else if (response.data.result === "successful") {
  //           console.log("Reservation successful.");
  //           // Handle success as needed (e.g., navigate to a success page)
  //           navigate("/");
  //         }
  //       } else {
  //         console.error("Invalid response data:", response.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

//   const adjustedTime = new Date(currentTime);
//   adjustedTime.setHours(adjustedTime.getHours() + reservationTime + additionalHour);
//   const adjustedTimeString = `${adjustedTime.getHours()}:${String(adjustedTime.getMinutes()).padStart(2, '0')}`;  


//   const renderSpots = () => {
//     let spotsPerPage = 10;
//     let start = (currentPage - 1) * spotsPerPage;
//     let end = start + spotsPerPage;
//     let spotsToRender = spots.slice(start, end);

//     return spotsToRender.map((isReserved, index) => {
//       let spotNumber = start + index + 1;
//       let spotClass = isReserved ? 'reservedSpot' : 'freeSpot';
//       if (selectedSpot === spotNumber) {
//         spotClass += ' selectedSpot';
//       }
//       let spotText = isReserved ? 'Varattu' : spotNumber;

//       return (
//         <div
//           className={`spotBox ${spotClass}`}
//           key={`spot-${spotNumber}`}
//           onClick={() => handleSpotClick(spotNumber)}
//         >
//           {spotText}
//         </div>
//       );
//     });
//   };
  
//   // Rullalla voi valita varauksen keston väliltä 1-12 tuntia
//   return (
//     <div className="reservationContainer">
//       <div className="spotListContainer">
//         <div className="spotListTitle">Valitse autopaikka:</div>
//         <div className="spotList">
//           <div className="hallSelector">
//             <div
//               className={`hallArrow ${currentPage === 1 ? 'disabled' : ''}`}
//               onClick={() => handlePageChange('prev')}
//             >
//               &lt;
//             </div>
//             <div className={`hallNumber ${currentPage === 1 ? 'selectedHallNumber' : ''}`}>
//               1
//             </div>
//             <div
//               className={`hallNumber ${currentPage === 2 ? 'selectedHallNumber' : ''}`}
//             >
//               2
//             </div>
//             <div
//               className={`hallNumber ${currentPage === 3 ? 'selectedHallNumber' : ''}`}
//             >
//               3
//             </div>
//             <div
//               className={`hallArrow ${currentPage === 3 ? 'disabled' : ''}`}
//               onClick={() => handlePageChange('next')}
//             >
//               &gt;
//             </div>
//           </div>
//           <div className="spotsContainer">{renderSpots()}</div>
//         </div>
//       </div>
//       <div className="rescontainer">
//       <div className="reservationTimeContainer">
//         <div className="reservationTimeTitle">Valitse varauksen kesto:</div>
//         <div className="reservationTimeWheelContainer">
//           <div className="reservationTimeSelected">
//             {`${reservationTime + additionalHour} tuntia `}
//             <span style={{ color: 'red' }}>
//               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </span>
//           </div>
//           <div className="timeControls">
//             <button onClick={handleDecreaseHour}>-1 tunti</button>
//             <button onClick={handleIncreaseHour}>+1 tunti</button>
//           </div>
//         </div>
//         <div className="adjustedTime">
//           {`Varaus ${adjustedTimeString} asti`}
//         </div>
//       </div>
//       <div className="reserveButtonContainer">
//         <button
//           onClick={reserve}
//           disabled={!parkingSpot || !reservationTime}
//           className={`reserveButton ${(!parkingSpot || !reservationTime) ? 'disabled' : ''}`}
//         >
//           Varaa
//         </button>
//       </div>
//       </div>
//     </div>
//   );
// }