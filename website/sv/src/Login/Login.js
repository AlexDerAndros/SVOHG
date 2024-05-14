import "./Login.css";
import Cookies from 'js-cookie';
import { useState } from "react";
export default function Login() {
  const[log, setLog] = useState(false);
  let user;
  let pa;
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState(''); 
  const USAdminSV = "SVHost";
  const PAAdminSV = "Test";
  const logBtn = () => {
    if ( username == USAdminSV && password == PAAdminSV ) {
      setLog(true);
      Cookies.set("user", user, {expires: 7});
      Cookies.set("password", pa, {expires: 7});
      alert("Login erfolgreich")
    }
    else {
      setLog(false);
      alert("Login fehlgeschlagen");
    }
  };
  
  return (
   <div className="main">
      { log ? (
        <LoggedIn/>
      ) : (
        <LoggingIn logBtn={logBtn} 
                    password={password} 
                    setPassword={setPassword} 
                    username={username} 
                    setUsername={setUsername}/>
      )}
   </div>
  );

}
function LoggingIn({logBtn, password, setPassword, username, setUsername}) {
  return (
    <>
      <div className="main">
        <div className="square">
          <div className="con_3">
              <div className="title_login">
                  Login
              </div>
          </div>
          <br />
          <div className="inputs_5">
            <label for="email">E-Mail</label>
            <input type="text" 
                   placeholder="E-Mail oder Nutzername..." 
                   id="username" 
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)} />

            <label for="password">Passwort</label>
            <input type="password" 
                   placeholder="Passwort" 
                   id="password" 
                   value={password} 
                   onChange={(e) => setPassword(e.target.value)}/>
            <button className="bt" onClick={logBtn}>Log In</button>
          </div>
        </div>
      </div>
    </>
  );
}
function LoggedIn() {
  let us = Cookies.get("user");
  return (
    <>
     Wilkommen {us}!
    </>
  );
}