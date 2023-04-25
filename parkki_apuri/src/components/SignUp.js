import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

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
        url: "https://13.51.255.38:3000/user//",
    })
    .then((res) => console.log(res));
    navigate('/login')
};

  return (
      <div className="signupcsscontainer">
        <div className="signupcsstitleText">Rekisteröityminen</div>
        <div className="signupcsssubtitleText">Täyttämällä tiedot voit luoda käyttäjän</div>
        <div>
            <input className="signupcsstextField1" placeholder="sähköposti*" onChange={e => setEmail(e.target.value)} />
            <input className="signupcsstextField2" type="password" placeholder="salasana*" onChange={e => setPassword(e.target.value)} />
            <input className="signupcsstextField3" placeholder="Rekisterinumero*" onChange={e => setLicensePlate(e.target.value)} />
            <button onClick={signup} className="signupcsssignUpButton">Luo käyttäjä</button>
        </div>
      </div>
  )
}