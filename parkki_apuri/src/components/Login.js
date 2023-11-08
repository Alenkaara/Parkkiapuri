import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import parkkilogomuokattu from './images/parkkilogomuokattu.png';

const Login = ({ setIsLoggedIn }) => {

  let navigate = useNavigate();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const [ loginProcessState, setLoginProcessState ] = useState("idle");

  // onSubmit lähettää kirjautumistiedot ja tallentaa ne localstorageen
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoginProcessState("processing");
    try {
      const response = await axios.post(
        "https://eu-de.functions.appdomain.cloud/api/v1/web/ff38d0f2-e12e-497f-a5ea-d8452b7b4737/Parkki-apuri/login-user.json",
        {
          email: email,
          salasana: password,
        }
      );
      if (response.data.error) {
        if (response.data.error === "User not found") {
          console.log("User not found");
        } else if (response.data.error === "Wrong password") {
          console.log("Wrong password");
        }
        setLoginProcessState("error");
        setTimeout(() => setLoginProcessState("idle"), 1500);
      } else {
        console.log(response.data);
        setLoginProcessState("success");
        setTimeout(() => {
          setLoginProcessState("idle");
          localStorage.setItem("rekisteri", response.data.rekisteri);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("userid", response.data.userid);
          navigate("/home", { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error(error.message);
      setLoginProcessState("error");
      setTimeout(() => setLoginProcessState("idle"), 1500);
    }
  };

  // Ohjaukset kirjautumisen eri vaiheisiin
  let loginUIControls = null;
  switch(loginProcessState) {
    case "idle":
      loginUIControls = <button className="logincsssignInButton" type="submit">Kirjaudu sisään</button>
      break;

    case "processing":
      loginUIControls = <span style={{color: 'blue'}}>Prosessoidaan...</span>
      break;

    case "success":
      loginUIControls = <span style={{color: 'green'}}>Kirjautuminen onnistui</span>
      break;

    case "error":
      loginUIControls = <span style={{color: 'red'}}>Virhe</span>
      break;

    default:
      loginUIControls = <button className="logincsssignInButton" type="submit">Kirjaudu sisään</button>
  }

  return (
    <div className="logincsscontainer">
    <img className="background-image" />
    <div className="logo-container">
      <img className="image-div" src={parkkilogomuokattu} />
    </div>
    <div className="logincsstitleText">Kirjaudu sisään</div>
    <div className="logincsssubtitleText">Syötä kirjautumistietosi</div>
    <input
      className="logincssusernameField"
      type="text"
      name="email"
      placeholder='Sähköposti*'
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className="logincsspasswordField"
      type="password"
      name="password"
      placeholder='Salasana*'
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={onSubmit} className="logincsssignInButton">
      Kirjaudu sisään
    </button>
  </div>
  )
}
  
  export default Login;