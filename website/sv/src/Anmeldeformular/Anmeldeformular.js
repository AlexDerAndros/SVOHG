import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";

import { auth, db } from "../config/firebase"; 
import { getDocs, collection, Timestamp, addDoc, deleteDoc, doc, where, query } from "firebase/firestore"; // import Firestore functions

export default function Anmeldeformular1() {
  const [verfügbar, setVerfügbar] = useState(false);
  const [events, setEvents] = useState([]);
  const [clickEF, setClickEF] = useState(false);

 

  const remove = async () => {
    try {
      const userEmail = Cookies.get("email1");
      const q = query(collection(db, "userEvents"), where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "userEvents", docSnapshot.id);
        await deleteDoc(docRef);
      });

      setClickEF(!clickEF);
      Cookies.set('teil', false, { expires: 1 / 48 });
      alert('Sie wurden aus dem Event ausgetragen');
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Error: ' + error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : data.date || "No Time Available",
            time: data.time || "No Time Available",
            place: data.place || "No Place Available",
            topic: data.topic || "No Topic Available",
            shortDescription: data.shortDescription || "No short Description Available",
            longDescription: data.longDescription || "No short Description Available",
          };
        });

        setVerfügbar(eventsList.length > 0);
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    const conditions = () => {
      if (Cookies.get("teil") === "true") {
        setClickEF(true);
      }
    };

    fetchEvents();
    conditions();
  }, []);

  if (clickEF === true || Cookies.get("teil") === "true") {
    return (
      <div className="anmeldeformular">
        <InEvent remove={remove} events={events} />
      </div>
    );
  }

  return (
    <div className="anmeldeformular">
      {verfügbar ? (
             <Event remove={remove} events={events} clickEF={clickEF} setClickEF={setClickEF}/>
          )
       : (
        <NichtsVerfügbar />
      )}
    </div>
  );
}

function Event({ events,  remove, clickEF, setClickEF}) {
  const [clickF, setClickF] = useState(false);

  const pressF = () => {
    setClickF(!clickF);
  };

  return (
    <>
    {clickF ? (
      <Formular events={events} pressF={pressF} clickEF={clickEF} remove={remove} setClickEF={setClickEF} />
    ) : (
      <>
        {events.map((event, index) => (
          <div className="events1" key={index}>
            <div className="coneven1">
              <div className="title_events">{event.topic}</div>
            </div>
            <div className="tabelle1" >
              <div className="zeit">
                <div className='angabezeit'>Datum: &nbsp;</div>
                {event.date}
              </div>
              <div className="zeit">
                <div className='angabezeit'>Zeit: &nbsp;</div>
                {event.time}
              </div>
              <div className="zeit">
                <div className='angabezeit'>Ort: &nbsp;</div>
                {event.place}
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
                  Beim {event.topic} kann man teilnehmen, indem Sie auf den unteren Knopf ,,Ich bin ein/e Schüler*in." drücken. Wenn Sie den gedrückt haben, können Sie sich dann für den {event.topic} anmelden.
                </div>
                <br />
                <div className="posLi">
                  
                  <div className="eventname" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={pressF}>
                    Ich bin ein/e Schüler*in.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    )}
  </>
    
  );
}

function NichtsVerfügbar() {
  return (
    <div className="nichtsVerfügbar">
      Momentan steht keine Wahl für ein Event zur Verfügung.
    </div>
  );
}

function Formular({ events, pressF, clickEF, remove, setClickEF }) {
  const [VN, setVN] = useState('');
  const [NN, setNN] = useState('');
  const [email, setEmail] = useState('');
  const [geb, setGeb] = useState('');
  const [kla, setKla] = useState('');
  
  let user = Cookies.get('user');
  useEffect(() => {}, []);

  const sendForm = async () => {
    if (VN.trim() !== '' && NN.trim() !== '' && email.trim() !== '' && geb.trim() !== '' && kla.trim() !== '') {
      await addDoc(collection(db, "userEvents"), {
        title: VN + '' + NN,
        name: VN + ' ' + NN,
        email: email,
        age: geb,
        Klasse: kla
      });
      setClickEF(true);
      Cookies.set('teil', true, { expires: 7 });
      Cookies.set("name", VN + ' ' + NN, { expires: 7 });
      Cookies.set("age", geb, { expires: 7 });
      Cookies.set("kla", kla, { expires: 7 });
      Cookies.set("email1", email, { expires: 7 });
      alert("Ihr Formular wurde an die SV gesendet. Sie können nun an dem Event teilnehmen!");
      let mail = Cookies.get('email1');
      await addDoc(collection( db, "mail"), {
        to : [mail],
        message: {
          subject: "Anmeldung für das Event erfolgreich",
          text:"Hallo",
          html:`Guten Tag ${mail}, <br/> <br/> sie nehmen nun am Event teil. <br/> Falls Sie noch weitere Fragen haben, wenden Sie sich bitte an die E-Mail Adresse svohgmonheim7@gmail.com <br/> <br/> Mit freundlichen Grüßen <br/> Eure SV`
        }
      });
      setVN('');
      setNN('');
      setEmail('');
      setGeb('');
      setKla('');
    }
  };

  if (clickEF === true || Cookies.get("teil") === "true") {
    return <InEvent remove={remove} events={events} />;
  } else {
    return (
      <>
        {events.map((event, index) => (
          <div className="contentA" key={index}>
            <div className="title_events" >
              {event.topic}
            </div>
            <div className="infoIN">Vorname:</div>
            <input type="text" className='search' placeholder="Vorname..." onChange={(e) => setVN(e.target.value)} />
            <div className="infoIN">Nachname:</div>
            <input type="text" className='search' placeholder="Nachname..." onChange={(e) => setNN(e.target.value)} />
            <div className="infoIN">Alter:</div>
            <input type="number" className='search' placeholder="Alter..." onChange={(e) => setGeb(e.target.value)} />
            <div className="infoIN">Klasse:</div> 
            <input type="text" className='search' placeholder="Klasse..." onChange={(e) => setKla(e.target.value)} />
            <div className="infoIN">E-Mail:</div> 
            <input type="text" className='search' placeholder="E-Mail..."  onChange={(e) => setEmail(e.target.value)} />
            <div className="btnPos">
              <button className="bearbeiten" onClick={sendForm} style={{ marginTop: "5%" }}>
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
    );
  }
}

function InEvent({ remove, events }) {
  const [teilnehmer, setTeilnehmer] = useState([]);
  let name = Cookies.get("name") || "Sie können Ihre Anmeldedaten nur auf dem Gerät abrufen, auf dem Sie sich für das Event angemeldet haben.";
  let age = Cookies.get("age") || "Hier ist dasselbe der Fall.";
  let email = Cookies.get("email1") || "Hier ist dasselbe der Fall.";
  let klasse = Cookies.get("kla") || "Hier ist dasselbe der Fall.";
  const fetchTeilnehmer = async () => {
    const TeilnehmerCol = collection(db, 'userEvents');
    const messagesSnapshot = await getDocs(TeilnehmerCol);
    const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeilnehmer(messagesList);
  };
  useEffect(() => {
    fetchTeilnehmer();
  }, []);
  return (
    <div className="contentB">
      {events.map((event => (
        <>
          <div className="coneven1">
            <div className="title_events">{event.topic}</div>
          </div>
          <div className="tabelle1">
            <div style={{ fontWeight: "600" }}>
              Sie können nun an diesem Event teilnehmen.
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
                Beim {event.topic} kann man teilnehmen, indem Sie auf den unteren Knopf ,,Ich bin ein/e Schüler*in." drücken. Wenn Sie den gedrückt haben, können Sie sich dann für den {event.topic} anmelden.
              </div>
            </div>
            <div>
              <div style={{ fontWeight: "600" }}>
                Ihre Informationen:
                <div style={{ fontWeight: "400" }}>
                  <div>
                    Name: {name}
                  </div>
                  <div>
                    Alter: {age}
                  </div>
                  <div>
                    Klasse: {klasse}
                  </div>
                  <div>
                    E-Mail: {email}
                  </div>
                </div>
              </div>
              <ul>
              </ul>
            </div>
            <button className="bearbeiten" onClick={remove}>
              Ich möchte nicht mehr an diesem Event teilnehmen.
            </button>
          </div>
        </>
      )))}
    </div>
  );
}

