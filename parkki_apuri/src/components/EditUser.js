import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './EditUser.css';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';

export default function EditUser () {

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

  let navigate = useNavigate();

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ licensePlate, setLicensePlate ] = useState('');
  const rekisteri = localStorage.getItem("rekisteri");
  const email1 = localStorage.getItem("email");
  const userid = localStorage.getItem("userid");

  // update ottaa parametrit email, salasana ja rekisteri ja päivittää ne tietokantaan.
  const update = () => {
    const userid = localStorage.getItem("userid");
    axios({
      method: "put",
      data: {
        email: email,
        salasana: password,
        rekisteri: licensePlate,
        userid: userid,
      },
      url: "https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/put-user.json",
    })
      .then((res) => {
        if (res.data.result === "successful") {
          localStorage.removeItem("rekisteri");
          localStorage.removeItem("email");
          localStorage.setItem("rekisteri", licensePlate);
          localStorage.setItem("email", email);
          window.location.reload();
        } else {
          console.log(res.data.result.error);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="edituser-wrapper">
      <img className="edit-user-background-image" />
      <div className="editusercsscontainer">
        <div className="edituser-loginInformation">
          {localStorage.getItem("rekisteri") && ( <span>Kirjauduttu sisään käyttäjällä: {email1}</span> )}
        </div>
        <div>Nykyiset käyttäjätiedot:</div>
        <div className="edituser-logindetails">
          {localStorage.getItem("rekisteri") && ( <span> Sähköposti: {email1}<br /> </span> )}
          {localStorage.getItem("rekisteri") && ( <span> Ajoneuvon rekisterinumero: {rekisteri}<br /> </span> )}
          {localStorage.getItem("rekisteri") && ( <span> Käyttäjän tunnistenumero: {userid} </span> )}
        </div>
        <div className="editusercsstitleText">Tietojen muokkaus</div>
            <input className="editusertextField1" placeholder="sähköposti*" onChange={e => setEmail(e.target.value)} />
            <input className="editusertextField2" type="password" placeholder="salasana*" onChange={e => setPassword(e.target.value)} />
            <input className="editusertextField3" placeholder="Rekisterinumero*" onChange={e => setLicensePlate(e.target.value)} />
            <button onClick={update} className="edituserConfirmButton">Vahvista muutokset</button>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}