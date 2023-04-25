import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';

export default function Reservation () {

  let navigate = useNavigate();

  const [ parkingSpot, setParkingSpot ] = useState('');
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ spots, setSpots ] = useState(Array(30).fill(false));
  const [ selectedSpot, setSelectedSpot ] = useState('');

  const handleSpotClick = (spotNumber) => {
    setParkingSpot(spotNumber);
    setSelectedSpot(spotNumber);
  };

  // handlePageChange säätelee nykyistä sivua, mistä valita paikka
  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  // reserve ottaa parametrit 'id' sekä 'rekisteri' ja syöttää ne.
  const reserve = () => {
    const rekisteri = localStorage.getItem("rekisteri");
    axios({
        method: "put",
        data: {
            id: parkingSpot,
            rekisteri: rekisteri,
        },
        url: "https://13.51.255.38:3000/",
    })
    .then((res) => {
        localStorage.setItem("id", parkingSpot);
        navigate('/');
    });
  };

  const renderSpots = () => {
    let spotsPerPage = 10;
    let start = (currentPage - 1) * spotsPerPage;
    let end = start + spotsPerPage;
    let spotsToRender = spots.slice(start, end);

    return spotsToRender.map((isReserved, index) => {
      let spotNumber = start + index + 1;
      let spotClass = isReserved ? 'reservedSpot' : 'freeSpot';
      if (selectedSpot === spotNumber) {
        spotClass += ' selectedSpot';
      }
      let spotText = isReserved ? 'Varattu' : spotNumber;

      return (
        <div
          className={`spotBox ${spotClass}`}
          key={`spot-${spotNumber}`}
          onClick={() => handleSpotClick(spotNumber)}
        >
          {spotText}
        </div>
      );
    });
  };
  

  return (
    <div className="reservationContainer">
      <div className="spotListContainer">
        <div className="spotListTitle">Valitse autopaikka:</div>
        <div className="spotList">
          <div className="hallSelector">
            <div
              className={`hallArrow ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => handlePageChange('prev')}
            >
              &lt;
            </div>
            <div className={`hallNumber ${currentPage === 1 ? 'selectedHallNumber' : ''}`}>
              1
            </div>
            <div
              className={`hallNumber ${currentPage === 2 ? 'selectedHallNumber' : ''}`}
            >
              2
            </div>
            <div
              className={`hallNumber ${currentPage === 3 ? 'selectedHallNumber' : ''}`}
            >
              3
            </div>
            <div
              className={`hallArrow ${currentPage === 3 ? 'disabled' : ''}`}
              onClick={() => handlePageChange('next')}
            >
              &gt;
            </div>
          </div>
          <div className="spotsContainer">{renderSpots()}</div>
        </div>
      </div>
      <div className="reserveButtonContainer">
        <button
          onClick={reserve}
          disabled={!parkingSpot}
          className={`reserveButton ${!parkingSpot ? 'disabled' : ''}`}
        >
          Varaa
        </button>
      </div>
    </div>
  );
  
}