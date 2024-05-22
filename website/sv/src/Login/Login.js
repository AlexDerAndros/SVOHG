import "./Login.css";
import Cookies from 'js-cookie';
import { useState } from "react";
export default function Login() {
  const[log, setLog] = useState(false);
 
 if (log == true  || Cookies.get('log') == 'true') {
   return <LoggedIn setLog={setLog} />;
 }
 else {
  return <LoggingIn setLog={setLog} />;
 }

}
function LoggingIn({setLog}) {
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState(''); 
  const incorrectps = useState(''); 
   const USAdminSV = "SVHost";
   const PAAdminSV = "Test";
 const logBtn = () => {
   if ( username == USAdminSV && password == PAAdminSV ) {
      setLog(true);
      alert("Login erfolgreich");
      Cookies.set('log', true, {expires: 7});
   }
   else {
      setLog(false);
      alert("Login fehlgeschlagen");
    }
    Cookies.set("user", username, {expires: 7});
    Cookies.set("password", password, {expires: 7});
 };
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
            <label for="email">E-Mail</label><div className="nono"></div>
            <input type="text" 
                   placeholder="&nbsp;E-Mail oder Nutzername..." 
                   id="username" 
                   value={username} 
                   onChange={(e)=> setUsername(e.target.value)}/>

            <label for="password">Passwort</label><div className="nono"></div>
            <input type="password" 
                   placeholder="&nbsp; Passwort" 
                   id="password" 
                   value={password}
                   onChange={(e)=> setPassword(e.target.value)}/>
                   <div classnName='incorrect'>{incorrectps}</div>
            <button className="button" onClick={logBtn}>Log In</button>
           
          </div>
        </div>
      </div>
    </>
  );
}
function LoggedIn({setLog}) {
  let us = Cookies.get("user");
  const logOut = () =>{
    setLog(false);
    alert("Sie sind ausgeloggt!");
    Cookies.set('log', 'false', { expires: 1/3600 });
 }

  return (
    <div className="main">
     <div className="welcome">
       Wilkommen {us}!
      </div>
      <button onClick={logOut}> 
        Log Out
      </button>
    </div>
  );
}
