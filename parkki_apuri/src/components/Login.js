import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {

  let navigate = useNavigate();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const [ loginProcessState, setLoginProcessState ] = useState("idle");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoginProcessState("processing");
    try {
      const result = await axios.post('https://13.51.255.38:3000/user/login', {
          email: event.target.email.value,
          salasana: event.target.password.value
        }
      );
      console.log(result);
      console.log(result.data[0]);
      setLoginProcessState("success");
      setTimeout(() => {
        setLoginProcessState("idle")
        localStorage.setItem("rekisteri", result.data[0].rekisteri);
        localStorage.setItem("email", result.data[0].email);
        navigate("/", { replace: true });
      }, 1500);
    } catch (error) {
      console.error(error.message);
      setLoginProcessState("error");
      setTimeout(() => setLoginProcessState("idle"), 1500);
    }
  }

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
    <div>
      <div className="logincssheaderContainer">
          <div className="logincsscontainer">
              <div className="logincsstitleText">Kirjaudu sisään</div>
              <div className="logincsssubtitleText">Syötä kirjautumistietosi</div>
              <form onSubmit={ onSubmit }>
                  <div className="logincssusernameText">Sähköposti*<input className="logincssusernameField" type="text" name="email"/></div>
                  <div className="logincsspasswordText">Salasana*<input className="logincsspasswordField" type="password" name="password"/></div>
                  <div><button className="logincsssignInButton" type="submit">Kirjaudu sisään</button> </div>
              </form>
          </div>
      </div>
    </div>
  )
};
  
  export default Login;