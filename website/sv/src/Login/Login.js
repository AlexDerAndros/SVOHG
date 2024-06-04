import "./Login.css";
import Cookies from 'js-cookie';
import { useState, useEffect, handleUpdate } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, db, GoogleProvider } from "../config/firebase"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getDoc, setDoc, collection, getDocs, getFirestore } from "firebase/firestore"; // import Firestore functions

import { doc, updateDoc } from "firebase/firestore";

const makeUserAdmin = async (email) => {
  try {
    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
      isAdmin: true,
    });
    console.log(`${email} is now an admin.`);
  } catch (error) {
    console.error("Error updating admin status: ", error);
  }
};

// Example usage:
// makeUserAdmin("user@example.com");

makeUserAdmin("marcodori2010@gmail.com");


export default function Login() {
  const [log, setLog] = useState(Cookies.get('log') === 'true');
  const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin') === 'true');

  useEffect(() => {
    const checkAdminStatus = async () => {
      const username = Cookies.get('user');
      if (username) {
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isAdmin = data.isAdmin || false;
          setIsAdmin(isAdmin);
          Cookies.set('isAdmin', isAdmin.toString(), { expires: 7 });
        }
      }
    };
    checkAdminStatus();
  }, []);

  return log ? (isAdmin ? <AdminDashboard setLog={setLog} /> : <LoggedIn setLog={setLog} />) : <LoggingIn setLog={setLog} />;
}

function LoggingIn({ setLog }) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [googleUs, setGoogleUs] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const press = () => {
    setClick(!click);
  }

  const logBtn = async(event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      console.log(user);
      setLog(true);
      Cookies.set('log', 'true', { expires: 7 });
      Cookies.set('user', username, { expires: 7 });

      // Check for admin status in Firestore
      const docRef = doc(db, "users", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isAdmin = data.isAdmin || false;
        Cookies.set('isAdmin', isAdmin.toString(), { expires: 7 });
        window.location.reload();
      }
    } catch (error) {
      setLog(false);
      console.log(error);
    }
  }

  const register = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      console.log(user);
      setLog(true);
      alert("Registrierung erfolgreich");
      Cookies.set('log', 'true', { expires: 7 });
      Cookies.set('user', registerEmail, { expires: 7 });
      window.location.reload();
  
      // Save user info in Firestore
      await setDoc(doc(db, "users", registerEmail), {
        email: registerEmail,
        isAdmin: false // Default isAdmin status
      });
    } catch (error) {
      setLog(false);
      console.log(error);
      alert("Registrierung fehlgeschlagen");
    }
  }
  const logGoogle = () => {
    signInWithPopup(auth, GoogleProvider).then((data) => {
     setGoogleUs(data.user.email);
     Cookies.set('log', true, {expires: 7});
     Cookies.set('user', data.user.email, { expires: 7 });
     window.location.reload();
   });
  };
  

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
              <div className="title_login" >
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
              <div className="registerInfo" onClick={logGoogle}>
                <FontAwesomeIcon icon={faGoogle} /> Melden Sie sich mit Google an!
                </div>
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
    Cookies.remove('isAdmin');
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



function AdminDashboard({ setLog }) {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', topic: '', shortDescription: '', longDescription: '' });
  const [messages, setMessages] = useState([]); // State to store messages
  const [visibleMessages, setVisibleMessages] = useState(3); // State to control number of visible messages
  const username = Cookies.get("user");

  const fetchEvents = async () => {
    const eventsCol = collection(db, 'events');
    const eventSnapshot = await getDocs(eventsCol);
    const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(eventList);
  };

  const fetchMessages = async () => {
    const messagesCol = collection(db, 'messages');
    const messagesSnapshot = await getDocs(messagesCol);
    const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(messagesList);
  };

  useEffect(() => {
    fetchEvents();
    fetchMessages(); // Fetch messages when the component mounts
  }, []);

  const logOut = () => {
    setLog(false);
    alert("Sie sind ausgeloggt!");
    Cookies.set('log', 'false', { expires: 1 / 3600 });
    Cookies.remove('user');
    Cookies.remove('isAdmin');
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setFormData({
      date: event.date.toDate().toLocaleDateString('en-CA'), // for input type="date"
      time: event.time,
      topic: event.topic,
      shortDescription: event.shortDescription, // Corrected property name
      longDescription: event.longDescription // Corrected property name
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (editEvent) {
      const eventDoc = doc(db, 'events', editEvent.id);
      const newDate = new Date(formData.date);

      await updateDoc(eventDoc, {
        date: newDate,
        time: formData.time,
        topic: formData.topic,
        shortDescription: formData.shortDescription, // Corrected property name
        longDescription: formData.longDescription // Corrected property name
      });

      setEditEvent(null);
      setFormData({ date: '', time: '', topic: '', shortDescription: '', longDescription: ''});
      fetchEvents(); // Re-fetch the updated events list
    }
  };

  const handleSeeMore = () => {
    setVisibleMessages(prev => prev + 3); // Increase the number of visible messages by 3
  };

  return (
    <div>
      <div className="welcome">
        Willkommen Admin {username}!
      </div>
      <div className="posLogOutBtn">
        <button onClick={logOut} className="logOutBtn">
          Ausloggen
        </button>
      </div>
      <div className="adminDashboard">
        <h2>Admin Dashboard</h2>
        <div className='msg'>
          <h2>Nachichten</h2>
          {messages.slice(0, visibleMessages).map(message => (
            <div key={message.id}>
              <p>{message.text}</p>
              <p>{message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString() : 'No timestamp available'}</p>
            </div>
          ))}
          {visibleMessages < messages.length && (
            <button onClick={handleSeeMore} className='seemore'>See More</button>
          )}
        </div>
        <br />
        <br />
        {events.map(event => (
          <div key={event.id} className="events_fff">
            <div className="events_asdf">
              <div className="title_asdf">
                <h3>Events bearbeiten</h3>
              </div>
              <p>Datum: {event.date.toDate().toLocaleDateString()}</p>
              <p>Zeit: {event.time}</p>
              <p>Thema: {event.topic}</p>
              <p>Kurze Beschreibung: {event.shortDescription}</p>
              <p>Was ist es?: {event.longDescription}</p>

            </div>
            <br />
            <br />
            <button onClick={() => handleEditClick(event)} className="bearbeiten">Bearbeiten</button>
          </div>
        ))}
        <br />
        <br />
        {editEvent && (
          <div className="bearbeitenpop">
            <h2>Event bearbeiten</h2>
            <form onSubmit={e => e.preventDefault()}>
              <label>
                Datum:
                <input
                  className="search"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>
              <label>
                Zeit:
                <input
                  className="search"
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </label>
              <label>
                Thema:
                <input
                  className="search"
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                />
              </label>
              <label>
                Kurze Beschreibung:
                <input
                  className="search"
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </label> <label>
                Was ist es?
                <input
                  className="search"
                  type="text"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                />
              </label>
              <br />
              <br />
              <button type="button" onClick={handleUpdate} className="bearbeiten">Aktualisieren</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}