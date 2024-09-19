import "./Login.css";
import Cookies from 'js-cookie';
import { useState, useEffect, handleUpdate, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faTrash} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { auth, db, GoogleProvider } from "../config/firebase"; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getDoc, setDoc, collection, getDocs, addDoc, where, deleteDoc, query, writeBatch} from "firebase/firestore"; // import Firestore functions
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { doc, updateDoc } from "firebase/firestore";

gsap.registerPlugin(ScrollTrigger);


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



export default function Login1() {
  const [log, setLog] = useState(Cookies.get('log') === 'true');
  const [isAdmin, setIsAdmin] = useState(Cookies.get('isAdmin') === 'true');
 const [isDeveloper, setIsDeveloper] = useState(Cookies.get('isDeveloper') === 'true');


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
          Cookies.set('isAdmin', isAdmin.toString(), { expires: 14 });
        }
      }
    };
    const checkDeveloperStatus = async () => {
      const username = Cookies.get('user');
      if (username) {
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const isDeveloper = data.isDeveloper || false;
          setIsDeveloper(isDeveloper);
          Cookies.set('isDeveloper', isDeveloper.toString(), { expires: 14 });
        }
      }
    };
    
    checkAdminStatus();
    checkDeveloperStatus();
  }, []);
  
  
   return log ? (isAdmin ? <AdminDashboard setLog={setLog} />:  isDeveloper ?  <DeveloperDashboard setLog={setLog}/>  : <LoggedIn setLog={setLog} />) : <LoggingIn setLog={setLog} />;
 
  }

function LoggingIn({ setLog }) {
  let [text, settext] = useState("password");

  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [googleUs, setGoogleUs] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const [seePassword, setSeePassword] = useState(false); // Changed to boolean
  const eyePassword = () => {
    setSeePassword(!seePassword);
  }
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [error]);

  const press = () => {
    setClick(!click);
  }

  let icSee; 
  if (seePassword) {
    icSee = <FontAwesomeIcon className="icSee" icon={faEye} style={{ color:"white"}} onClick={eyePassword}/>; 
    text = "text";  // Show password
  } else {
    icSee = <FontAwesomeIcon className="icSee" icon={faEyeSlash} style={{ color:"white"}} onClick={eyePassword}/>;
    text = "password";  // Hide password
  }

  const logBtn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      setLog(true);
      Cookies.set('log', 'true', { expires: 14 });
      Cookies.set('user', username, { expires: 14 });

      const docRef = doc(db, "users", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isAdmin = data.isAdmin || false;
        const isDeveloper = data.isDeveloper || false;
        Cookies.set('isAdmin', isAdmin.toString(), { expires: 14 });
        Cookies.set('isDeveloper', isDeveloper.toString(), { expires: 14 });
        window.location.reload();
      }
    } catch (error) {
      setLog(false);
      setError('Falsche Passwort oder Account');
    }
  }

  const register = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      setLog(true);
      alert("Registrierung erfolgreich");
      Cookies.set('log', 'true', { expires: 14 });
      Cookies.set('user', registerEmail, { expires: 14 });

      let us = Cookies.get('user');
      await addDoc(collection(db, "mail"), {
        to: [us],
        message: {
          subject: "Registrierung erfolgreich",
          text: "Hallo",
          html: `Guten Tag ${us}, <br/> <br/> ihre Registrierung war erfolgreich. Nun können Sie sich mit ihrer E-Mail Adresse ${us} und mit ihrem Passwort auch anmelden. <br/> Falls Sie noch weitere Fragen haben, wenden Sie sich bitte an die E-Mail Adresse svohgmonheim7@gmail.com <br/> <br/> Mit freundlichen Grüßen <br/> Eure SV`
        }
      });
      window.location.reload();
      await setDoc(doc(db, "users", registerEmail), {
        email: registerEmail,
        isAdmin: false,
        isDeveloper: false
      });
      
    } catch (error) {
      setLog(false);
      alert("Registrierung fehlgeschlagen");
    }
  }

  const logGoogle = () => {
    try {
    signInWithPopup(auth, GoogleProvider).then((data) => {
      try {
      setGoogleUs(data.user.email);
      Cookies.set('log', true, { expires: 14 });
      Cookies.set('user', data.user.email, { expires: 14 });
      window.location.reload();
      }
      catch {
        alert("Error" + error)
      }
    });
    }
    catch {
      alert('Error: ' + error)
    }
  };

  return (
    <div className="main">
      <div className="square">
        {click ? (
          <div>
            <div className='arrowcon'>
            <FontAwesomeIcon icon={faArrowLeft} onClick={press} className='arrowBack' />
            </div>
            <div className="con_3">
              <div className="title_login" >
                Registrierung
              </div>
            </div>
            <br />
            <div className="inputs_5" style={{marginTop:"-10%"}}>
              <label htmlFor="email">E-Mail</label>
              <div className="nono"></div>
              <input type="text"
                placeholder="&nbsp;Benutze eine E-Mail Adresse..."
                id="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)} />

              <label htmlFor="password">Passwort</label>
              <div className="nono"></div>
              <div className="posINPA">
              <input type={seePassword ? "text" : "password"}
                placeholder="&nbsp;Erstelle ein Passwort..."
                id="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} /> 
                 {icSee}
                </div>
              <button className="button" onClick={register}>Registrieren</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="con_3">
              <div className="title_login" >
                Login
              </div>
            </div>
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
              <div className="posINPA">
              <input type={seePassword ? "text" : "password"}
                placeholder="Passwort"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
                 {icSee}
                </div>
              <button className="button" onClick={logBtn}>Einloggen</button>
               
              {error && <p style={{ color: 'red' }}>{error}</p>} 

              <div className="loginInfo">
                <div className="registerInfo" onClick={logGoogle}>
                  <img src="./google_icon-icons.com_62736.png" alt="Mit Google Anmelden" className="mitgoogle" />
                </div>
                Wenn Sie noch nicht eingeloggt sind,
                <span className="registerInfo" onClick={press}>
                  &nbsp; registrieren Sie sich bitte!
                </span>
              </div>
            </div>
          </div>
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
    Cookies.remove('isDeveloper');

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

function AdminDevDashboard() {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', topic: '', shortDescription: '', longDescription: '' });
  const [messages, setMessages] = useState([]); 
  const [teilnehmer, setTeilnehmer] = useState([]); 
  const [ moreSize, setMoreSize] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [visibleMessages, setVisibleMessages] = useState(6);
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

  const fetchTeilnehmer = async() => {
    const TeilnehmerCol = collection(db, 'userEvents');
    const messagesSnapshot = await getDocs(TeilnehmerCol);
    const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeilnehmer(messagesList);
  };
  
  useEffect(() => {
    fetchEvents();
    fetchMessages();
    fetchTeilnehmer();
  }, []);

 

  const handleEditClick = (event) => {
    setEditEvent(event);
    setFormData({
      date: event.date.toDate().toLocaleDateString('en-CA'), // for input type="date"
      time: event.time,
      place: event.place,
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
        place: formData.place,
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
 
   const More = () => {
     setMoreSize(true);
   };

   const deleteMessage = async () => {
     try {
       const q = query(collection(db, "messages"), where('timestamp', '==', timestamp));
       const querySnapshot = await getDocs(q);
   
       if (querySnapshot.empty) {
         console.log('Keine Dokumente zum Löschen gefunden.');
         return;
       }
   
       const batch = writeBatch(db);
   
       querySnapshot.forEach(docSnapshot => {
         const docRef = doc(db, "messages", docSnapshot.id);
         batch.delete(docRef);
       });
   
       await batch.commit();
       console.log('Dokumente erfolgreich gelöscht.');
     } catch (error) {
       console.error('Fehler beim Löschen der Dokumente: ', error);
       alert('Fehler: ' + error.message);
     }
   };

   const sortedMessages = messages.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

   return (
     <>
       <div className='msg'>
        <div className='titlead'>
          <h2>Nachichten</h2>
          </div>
  <div className="log123ad">
    {sortedMessages.slice(0, visibleMessages).map(message => (
      <div className="msg123" tabindex={0} key={message.id}>
        <p>{message.text}  <FontAwesomeIcon icon={faTrash} onClick={ async() => {
                       try {
                        const q = query(collection(db, "messages"), where('text', '==', message.text ), where('timestamp', '==', message.timestamp ));
                        const querySnapshot = await getDocs(q);
                  
                        querySnapshot.forEach(async (docSnapshot) => {
                          const docRef = doc(db, "messages", docSnapshot.id);
                          await deleteDoc(docRef);
                        });
                        alert('Nachricht erfolgreich gelöscht!');
                        
                      } catch(error) {
                        console.log(error);
                        alert('Nachricht konnte leider nicht gelöscht werden');
                      }
                      
                   }} className="btnDelIn"/>  </p>
        <p>{message.timestamp ? new Date(message.timestamp.seconds * 1000).toLocaleString() : 'Keine datum da'}</p>
        {/* <button onClick={deleteMessage}> Löschen</button> */}
      </div>
    ))}
  </div>
          {visibleMessages < messages.length && (
            <button onClick={handleSeeMore} className='seemore'>See More</button>
          )}
        </div>
        <br />
        <br />
        <div className='msg'>
        <div className="titleposMsg">
          <h2 style={{width:'100%', display:'flex',justifyContent:'center'}}>Teilnehmer*innen des {events.map((event) => ( <> {event.topic}</>))}</h2>
        </div>
        <div>
      
          <div className='personscon'>
  {teilnehmer.map((item) => (
    <div className="person" key={item.id} tabindex={0}>
      <div className="container_33log">
        <div className='headContainerlog'>
          {item.name}
        </div>
      </div>
      <ul>
        <li>Alter: {item.age}</li>
        <li>Klasse: {item.Klasse}</li>
        <li>E-Mail: {item.email}</li>
      </ul>
    </div>
  ))}
  </div>
</div>
    </div>
    <br />
    <br />
        {events.map(event => (
          <div key={event.id} className="events_fff">
            <div className="events_asdf">
              <div className="title_asdf">
                <h2>Events bearbeiten</h2>
              </div>
              <div className="textasdf123">
              <p tabIndex={0}>Datum: {event.date.toDate().toLocaleDateString()}</p>
              <p tabIndex={0}>Zeit: {event.time}</p>
              <p tabIndex={0}>Ort: {event.place}</p>
              <p tabIndex={0}>Thema: {event.topic}</p>
              <p tabIndex={0}>Kurze Beschreibung: {event.shortDescription}</p>
              <p tabIndex={0}>Was ist es?: {event.longDescription}</p>
              </div>

            </div>
            <br />
            <br />
            <button onClick={() => handleEditClick(event)} className="bearbeiten">Bearbeiten</button>
          </div>
        ))}
        <br />
        <br />

    <br />
    <br />
        {editEvent && (
          <div className="bearbeitenpop">
            <h2>Event bearbeiten</h2>
            <form onSubmit={e => e.preventDefault()}>
              <label>
                <div className="labelEditEvents">
                  Datum:
                </div>
                <input
                  className="search"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>
              <label>
              <div className="labelEditEvents">
                Zeit:
              </div>
                <input
                  className="search"
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </label>
              <label>
              <div className="labelEditEvents">
                 Ort:
              </div>
                <input
                  className="search"
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                />
              </label>
              <label>
               <div className="labelEditEvents"> 
                 Thema:
                </div>
                
                <input
                  className="search"
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                />
              </label>
              <label>
              <div className="labelEditEvents">
                Kurze Beschreibung:
               </div>
                <input
                  className="search"
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                />
              </label> 
              <label>
               <div className="labelEditEvents">
                 Was ist es?
               </div>  
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

     
     </>
   );
}

function AdminDashboard({ setLog }) {
 
  const username = Cookies.get("user");
  const logOut = () => {
    setLog(false);
    alert("Sie sind ausgeloggt!");
    Cookies.set('log', 'false', { expires: 1 / 3600 });
    Cookies.remove('user');
    Cookies.remove('isAdmin');
    Cookies.remove('isDeveloper');

  };
 
  return (
    <div className="siteAdmin" style={{marginBottom:"100vh"}}>
      <div className="welcome">
        Willkommen Admin {username}!
      </div>
      <div className="posLogOutBtn">
        <button onClick={logOut} className="logOutBtn">
          Ausloggen
        </button>
      </div>
      <div className="adminDashboard" style={{marginBottom:"50vh",}}>
         <h2>Admin Dashboard</h2>
         <AdminDevDashboard />
      </div>
    <div style={{height:'150vh', width:"100vw", zIndex:"-100"}}></div>

    </div>
  );
}
function DeveloperDashboard({ setLog }) {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState(6); // 6j users gerade

  const username = Cookies.get("user");

  const fetchUser = async () => {
    const UserCol = collection(db, 'users');
    const UserSnapshot = await getDocs(UserCol);
    const UserList = UserSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(UserList);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logOut = () => {
    setLog(false);
    alert("Sie sind ausgeloggt!");
    Cookies.set('log', 'false', { expires: 1 / 3600 });
    Cookies.remove('user');
    Cookies.remove('isAdmin');
    Cookies.remove('isDeveloper');
  };

  const loadMoreUsers = () => {
    setVisibleUsers(prevVisibleUsers => prevVisibleUsers + 3); 
  };

  return (
    <div className="siteAdmin" style={{marginBottom:"100vh"}}>
      <div className="welcome">
        Willkommen Developer {username}!
      </div>
      <div className="posLogOutBtn">
        <button onClick={logOut} className="logOutBtn">
          Ausloggen
        </button>
      </div>
      <div className="adminDashboard" style={{marginBottom:"50vh"}}>
        <h2>Developer Dashboard</h2>
        <div className='dev123ad2'>
          <h2>User zu Admins machen</h2>
          <div className='log123ad2' style={{marginBottom:"5%"}}>
            {users.slice(0, visibleUsers).map(user => (
              <form className="users" key={user.id} tabIndex={0}>
                E-Mail: {user.email} <br/>
                ist ein Admin: 
                <select name="options">
                  <option>true</option>
                  <option>false</option>
                </select>
              </form>
            ))}
        </div>
        <div className='savingthebutton'>
          {/* ... Button thing */}
          {visibleUsers < users.length && (
            <button onClick={loadMoreUsers} className='seemore' id="lilbutton">
              Mehr Benutzer laden
            </button>
          )}
        </div>
          </div>
        <AdminDevDashboard/>
      </div>
      <div style={{height:'150vh', width:"100vw", zIndex:"-100"}}></div>
    </div>
  );
}