import "./Login.css";
import Cookies from 'js-cookie';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [log, setLog] = useState(Cookies.get('log') === 'true');

  return log ? <LoggedIn setLog={setLog} /> : <LoggingIn setLog={setLog} />;
}


function LoggingIn({ setLog }) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const press = () => {
    setClick(!click);
  }


 const logBtn = async(event) => {
  event.preventDefault();
    try  {
      const user = await signInWithEmailAndPassword(auth, username, password);
      console.log(user);
      setLog(true);
      alert("Login erfolgreich");
      Cookies.set('log', 'true', { expires: 7 });
      Cookies.set('user', username, { expires: 7 });
    } catch (error) {
      setLog(false);
      console.log(error);
      alert("Login fehlgeschlagen");
    }
  }

  const register = async (event) => {
    event.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      console.log(user);
      setLog(true);
      alert("Registrierung erfolgreich");
      Cookies.set('log', 'true', { expires: 7 });
      Cookies.set('user', registerEmail, { expires: 7 });
    } catch (error) {
      setLog(false);
      console.log(error);
      alert("Registrierung fehlgeschlagen");
    }
  }

          


  return (
    <div className="main">
      <div className="square">
        {click ? (
          <>
            <FontAwesomeIcon icon={faArrowLeft} onClick={press} className='arrowBack' />
            <div className="con_3">
              <div className="title_login">
                Registrierung
              </div>
            </div>
            <br />
            <div className="inputs_5">
              <label htmlFor="email">E-Mail</label>
              <div className="nono"></div>
              <input type="text"
                placeholder="&nbsp;Benutze eine E-Mail Adresse..."
                id="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)} />

              <label htmlFor="password">Passwort</label>
              <div className="nono"></div>
              <input type="password"
                placeholder="&nbsp;Erstelle ein Passwort..."
                id="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} />
              <button className="button" onClick={register}>Registrieren</button>
            </div>
          </>
        ) : (
          <>
            <div className="con_3">
              <div className="title_login">
                Login
              </div>
            </div>
            <br />
            <div className="inputs_5">
              <label htmlFor="email">E-Mail</label>
              <div className="nono"></div>
              <input type="text"
                placeholder="&nbsp;E-Mail Adresse..."
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />

              <label htmlFor="password">Passwort</label>
              <div className="nono"></div>
              <input type="password"
                placeholder="&nbsp; Passwort..."
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <button className="button" onClick={logBtn}>Einloggen</button>
              <div className="loginInfo">
                Wenn Sie noch nicht eingeloggt sind,
                <span className="registerInfo" onClick={press}>
                  &nbsp; registrieren Sie sich bitte!
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoggedIn({ setLog }) {
  const username = Cookies.get("user");

  const logOut = () => {
    setLog(false);
    alert("Sie sind ausgeloggt!");
    Cookies.set('log', 'false', { expires: 1 / 3600 });
    Cookies.remove('user');
  }

  return (
    <div>
      <div className="welcome">
        Willkommen {username}!
      </div>
      <div className="posLogOutBtn">
       <button onClick={logOut} className="logOutBtn">
         Ausloggen  
       </button>
      </div>
    </div>
  );
}