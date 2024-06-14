import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";

import { auth, db } from "../config/firebase"; 
import { getDocs, collection, Timestamp, addDoc, deleteDoc, doc, where, query } from "firebase/firestore"; // import Firestore functions

export default function Anmeldeformular1() {
  const [verfügbar, setVerfügbar] = useState(false);
  const [events, setEvents] = useState([]);
  const [click, setClick] = useState(false);
  const [clickEF, setClickEF] = useState(false);

  const press = () => {
    setClick(!click);
  };

  const remove = async () => {
    try {
      const userEmail = Cookies.get("email");
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
        <>
          {click ? (
            <Event events={events} press={press} clickEF={clickEF} remove={remove} setClickEF={setClickEF} />
          ) : (
            <>
              <div>
                {events.map((event, index) => (
                  <div className="events" key={index}>
                    <div className="coneven">
                      <div className="title_events">{event.topic}</div>
                    </div>
                    <div className="tabelle1">
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
                      <div className="eventname" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={press}>
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

function Event({ events, press, remove, clickEF }) {
  const [clickF, setClickF] = useState(false);

  const pressF = () => {
    setClickF(!clickF);
  };

  return (
    <>
      {clickF ? (
        <Formular events={events} pressF={pressF} clickEF={clickEF} remove={remove} setClickEF={setClickF} />
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
                    <div className="eventname" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={press}>
                      ← Zurück
                    </div>
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
      Cookies.set("email", email, { expires: 7 });

      alert("Ihr Formular wurde an die SV gesendet. Sie können nun an dem Event teilnehmen!");
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
            <div className="title_events">
              {event.topic}
            </div>
            <input type="text" className='search' placeholder="Vorname..." onChange={(e) => setVN(e.target.value)} />
            <input type="text" className='search' placeholder="Nachname..." onChange={(e) => setNN(e.target.value)} />
            <input type="number" className='search' placeholder="Alter..." onChange={(e) => setGeb(e.target.value)} />
            <input type="text" className='search' placeholder="Klasse..." onChange={(e) => setKla(e.target.value)} />
            <input type="text" className='search' placeholder="E-Mail..." value={user} onChange={(e) => setEmail(e.target.value)} />
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
  let email = Cookies.get("email") || "Hier ist dasselbe der Fall.";
  let klasse = Cookies.get("class") || "Hier ist dasselbe der Fall.";
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
    <div className="events1">
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
