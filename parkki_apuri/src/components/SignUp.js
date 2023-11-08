import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';

export default function Signup () {

  let navigate = useNavigate();

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ licensePlate, setLicensePlate ] = useState('');

  // Signup ottaa parametrit email, salasana ja rekisteri ja postaa ne.
  const signup = () => {
    axios({
      method: "post",
      data: {
        email: email,
        salasana: password,
        rekisteri: licensePlate,
      },
      url:
        "https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/sign-up-user.json",
    })
      .then((response) => {
        if (response.data.result) {
          // Tarkistaa erilaisia virheitä, ja käsittelee ne
          if (response.data.result.error === "User with email already exists") {
            console.log("User with this email already exists.");
          } else if (response.data.result.error === "User with register already exists") {
            console.log("User with this license plate already exists.");
          } else if (response.data.result.error === "Can't have empty email, password, or register") {
            console.log("Email, password, or license plate cannot be empty.");
          } else if (response.data.result.error === "Invalid register") {
            console.log("Invalid license plate.");
          } else if (response.data.result === "successful") {
            console.log("User created successfully.");
            navigate("/login");
          }
        } else {
          console.error("Invalid response data:", response.data);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="signupcsscontainer">
      <img className="background-image"></img>
      <div className="logo-container">
        <img className="image-div" src={parkkilogomuokattu} />
      </div>
      <div className="signupcsstitleText">Rekisteröityminen</div>
      <div className="signupcsssubtitleText">Täyttämällä tiedot voit luoda käyttäjän</div>
          <input className="signupcsstextField1" placeholder="sähköposti*" onChange={e => setEmail(e.target.value)} />
          <input className="signupcsstextField2" type="password" placeholder="salasana*" onChange={e => setPassword(e.target.value)} />
          <input className="signupcsstextField3" placeholder="Rekisterinumero*" onChange={e => setLicensePlate(e.target.value)} />
          <button onClick={signup} className="signupcsssignUpButton">Luo käyttäjä</button>
    </div>
  )
}