import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { auth, db } from "../config/firebase"; // import Firestore db
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, Timestamp, addDoc } from "firebase/firestore"; // import Firestore functions



export default function Anmeldeformular() {
  const [verfügbar, setVerfügbar] = useState(false);
  const [events, setEvents] = useState([]);
  const [click, setClick] = useState(false);

  const press = () => {
    setClick(!click);
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date:  data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : data.date || "No Time Available", 
            time: data.time || "No Time Available",
            topic: data.topic || "No Topic Available",
            shortDescription: data.shortDescription || "No short Description Available",
            longDescription: data.longDescription || "No short Description Available",
            
          };
        });


        if (eventsList.length > 0) {
          setVerfügbar(true);
          setEvents(eventsList);
        } else {
          setVerfügbar(false);
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="anmeldeformular">
      
      {verfügbar ?   (
        <>
        {click ? (
           <Event events={events} press={press}/>
            ):(
             <>
              <div >
             {events.map((event, index) => (
              <div className="events">
              <div className="coneven">
                <div className="title_events"> {event.topic}</div>
              </div>
                <div className="tabelle1" key={index}>
                <div className="zeit">
                    <div className='angabezeit'>Datum: &nbsp;</div>
                    {event.date}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Zeit: &nbsp;</div>
                    {event.time}
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Kurze Beschreibung: &nbsp;</div>
                    {event.shortDescription} 
                  </div>
                  <div className="eventname" style={{color:'blue', textDecoration: 'underline blue 1px', cursor: "pointer"}} onClick={press}>
                    Weitere Informationen →
                   </div> 
                </div>
                </div>
              ))} 
           </div>
             </>
            )}
            </>
      ) : (
        <NichtsVerfügbar />
      )}
    </div>
  );
}

function NichtsVerfügbar() {
  return (
    <div className="nichtsVerfügbar">
      Momentan steht keine Wahl für ein Event zur Verfügung.
    </div>
  );
}
function Event({events, press}) {
  const [clickF, setClickF] = useState(false);
  const pressF = () => {
    setClickF(!clickF);
  }
  
  return (
    <>
     {clickF ? (
      <Fomular events={events} pressF={pressF}/>
     ): ( <>
        {events.map((event, index) => (
              <div className="events" style={{height: "auto"}}  >
              <div className="coneven">
                <div className="title_events"> {event.topic}</div>
              </div>
                <div className="tabelle1" key={index}  >
                <div className="zeit" style={{marginTop: " 12.5vh"}}>
                    <div className='angabezeit' >Datum: &nbsp;</div>
                    {event.date}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Zeit: &nbsp;</div>
                    {event.time}
                  </div>
                  <div className="eventnameAusnahme">
                    <div className='angabezeit'>Worum geht es bei dem {event.topic}? &nbsp;</div>
                    <div className="textEv">
                     {event.longDescription} 
                    </div>
                  </div>
                  <div className="eventnameAusnahme">
                    <div className='angabezeit'>Wie nehme ich bei dem {event.topic} teil? &nbsp;</div>
                    <div className="textEv">
                      Beim {event.topic} nehme ich teil, indem Sie auf den unteren Knopf ,,Ich bin ein/e Schüler*in." drücken. 
                      Wenn Sie den gedrückt haben, können Sie sich dann für den {events.topic} anmelden.
                    </div>
                    <br/>
                  <div className="posLi">
                  <div className="eventname" style={{color:'blue', textDecoration: 'underline blue 1px', cursor: "pointer"}} onClick={press}>
                  ← Zurück
                   </div>
                   <div className="eventname" style={{color:'blue', textDecoration: 'underline blue 1px', cursor: "pointer"}} onClick={pressF}>
                   Ich bin ein/e Schüler*in.
                   </div>
                   </div>  
                   </div> 
                </div>
                </div>
              ))} 
     </>)}
        
    </>
  );
}
function Fomular({ events, pressF }) {
 useEffect(() => {
   if (Cookies.get("Teilnehmer") == "true") {
    setClickEF(true);
   }
 }, []);
  const [clickEF, setClickEF] = useState(false);
  const [VN, setVN] = useState('');
  const [NN, setNN] = useState('');
  const [email, setEmail] = useState('');
  const [geb, setGeb] = useState('');
  const [kla, setKla] = useState('');

  const sendForm = async () => {
    if (VN.trim() !== '' && NN.trim() !== '' && email.trim() !== '' && geb.trim() !== '' && kla.trim() !== '') {
      await addDoc(collection(db, "userEvents"), {
        name: VN + ' ' + NN, 
        email: email,
        Geburtstag: geb,
        Klasse: kla
      });
      alert("Ihr Formular wurde an die SV gesendet. Sie können nun an dem Event teilnehmen!");
      setVN('');
      setNN('');
      setEmail('');
      setGeb('');
      setKla('');
      setClickEF(!clickEF);
      window.location.reload();
      Cookies.set('Teilnehmer', true, { expires: 7 });
    }
   
  }

  const remove = async () => {
    setClickEF(!clickEF);
    Cookies.set('Teilnehmer', false, { expires: 7 });

  }

  return (
    <>
      {clickEF ? (
        <>
          Sie können nun an diesem Event teilnehmen.
          <button className="button" onClick={remove}>
            Ich möchte nicht mehr an diesem Event teilnehmen.
          </button>
        </>
      ) : (
        <>
          {events.map((event, index) => (
            <div className="contentA" key={index}>
              <div className="headContainer">
                {event.topic}
              </div>
              <input type="text" className='search' placeholder="Vorname..." onChange={(e) => setVN(e.target.value)} />
              <input type="text" className='search' placeholder="Nachname..." onChange={(e) => setNN(e.target.value)} />
              <input type="text" className='search' placeholder="Geburtstag..." onChange={(e) => setGeb(e.target.value)} />
              <input type="text" className='search' placeholder="Klasse..." onChange={(e) => setKla(e.target.value)} />
              <input type="text" className='search' placeholder="E-Mail..." value={email} onChange={(e) => setEmail(e.target.value)} />
              <div className="btnPos">
                <button className="button" onClick={sendForm}>
                  Senden
                </button>
              </div>
              <br />
              <div className="eventname" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={pressF}>
                ← Zurück
              </div>
            </div>
          ))}
        </>
      )}

    </>
  );
}