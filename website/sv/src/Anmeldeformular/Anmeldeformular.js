import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import gsap from "gsap";
import { useState, useEffect, useRef } from "react";
import { faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth, db } from "../config/firebase"; 
import { getDocs, collection, Timestamp, addDoc, deleteDoc, doc, where, query, setDoc } from "firebase/firestore"; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

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
  const eventsRefs = useRef([]);
  const [clickF, setClickF] = useState(false);

  const pressF = () => {
    gsap.to(".eventname1", {
      scale: 1.2,
      duration: 0.5,
    })
      setTimeout(() => {
        setClickF(!clickF);
      }, 500);
  };

  useEffect(() => {
    eventsRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(
          ref, // Target each eventRef
          { opacity: 0, y: -50 }, // Initial state
          { opacity: 1, y: 0, duration: 1 } // Final state
        );
      }
    });
  }, [events]);

  return (
    <>
    {clickF ? (
      <Formular events={events} pressF={pressF} clickEF={clickEF} remove={remove} setClickEF={setClickEF} />
    ) : (
      <>
{events.map((event, index) => (
            <div
              className="events1"
              ref={el => eventsRefs.current[index] = el} // Attach each event ref
              key={index}
            >
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
                  
                  <div className="eventname1" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={pressF}>
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
  const [inF, setInF] = useState('');
  
  const [clickIN, setClickIN] = useState(false);
  const [inputsList, setInputsList] = useState([]);
  const [addInLi, setAddINLi] = useState([]);
  const [deleteCon, setDeleteCon] = useState(false);
  const [deleteIn, setDeleteIn] = useState('');
  const [inCountdown, setInCountdown] = useState(0);
  let plusIcon;
  const pressIN = () => {
    setClickIN(!clickIN);
  }
  
  const PlusIcon = () => {
 
    return (
      <div className="addInput" onClick={pressIN} 
           style={{transform: clickIN ? "rotate(45deg)" : 'rotate(0deg)',
           transition: '0.2s ease-in'}}>
        +
      </div>
    );
  }

  //Überprüfung, ob das Plus Angezeigt wird oder nicht
  if (Cookies.get('isAdmin') == 'true' || Cookies.get('isDeveloper') == 'true') {
    plusIcon = <PlusIcon clickIN={clickIN} setClickIN={setClickIN} /> ;
  }
  else {
    plusIcon = '';
  }
  
 



//Senden des Inputs
const sendInput = async () => {
  
    if (inF.trim() !== '') {
      try {
        const newCountdown = inCountdown + 1;
        await setDoc(doc(db, "inputCounter", 'inCounter'), {
          counter: newCountdown
        });
        await addDoc(collection(db, "inputs"), {
           placeholder: inF + '...',
           titleIN: inF + ':',
           number: newCountdown
        });
        
       
        alert('Eingabefeld wurde erfolgreich hinzugefügt!');
        window.location.reload();
      } catch (error) {
         console.log(error);
         alert('Eingabefeld konnte nicht hinzugefügt werden!');
      }
    }
    setInF('');

};


const pressDel = () => {
  setDeleteCon(!deleteCon);
};
  
//Löschen des Inputs
const deleteInput = async() => {
    try {
      let value = deleteIn;
      const q = query(collection(db, "inputs"), where('titleIN', '==', value));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, "inputs", docSnapshot.id);
        await deleteDoc(docRef);
      });
      const newCountdown = inCountdown - 1;
      await setDoc(doc(db, "inputCounter", 'inCounter'), {
        counter: newCountdown
      });
      alert('Eingabefeld erfolgreich gelöscht!');

    } catch(error) {
      console.log(error);
      alert('Eingabefeld konnte leider nicht gelöscht werden');
    }
    
 };

 
//Aufrufung von der Inputanzahl
const inputCounter = async() => {
    try {
      const q = query(
        collection(db, "inputCounter"),
      );
  
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const counterValue =  data.counter;
        setInCountdown(counterValue);
      });
      
     
      
    } catch (error) {
      console.log(error);
    }
  };
  

const fetchCountdown = async() => {
  try {
    const q = query(
      collection(db, "inputs"),
    );

    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const counterValue =  data.number;
      setAddINLi(counterValue);
    });
    
   
    
  } catch (error) {
    console.log(error);
  }
}

const [addedIn, setAddedIn] = useState({
  1: '',
  2: '',
  3: '',
  4: '',
  5: ''
});

const onChange = (e) => {
  const value = e.target.value;
  if ([1, 2, 3, 4, 5].includes(addInLi)) {
    setAddedIn(prevState => ({
      ...prevState,
      [addInLi]: value   
    }));
  }
};

const counterDelete = async() => {
  try {
   const newCountdown = inCountdown - 1;
   await setDoc(doc(db, "inputCounter", 'inCounter'), {
     counter: newCountdown
   });
  } catch (e) {
  console.log(e)
 }
}

//Aufrufung von Database der Inputs
const fetchInputs = async () => {
    const inCol = collection(db, 'inputs');
    const inSnapshot = await getDocs(inCol);
    const inList = inSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInputsList(inList);
};
 
useEffect(() => {
    fetchInputs();
    inputCounter();
    fetchCountdown();
}, []);

//Senden des Formulars
const sendForm = async () => {
  gsap.to('.bearbeiten1', {
    borderRadius: '100%',
    width: '70px', 
    opacity: 0,
    duration: 1,
    onComplete: () => {
      gsap.to('.bearbeiten1', {
        borderRadius: '8px',
        width: '13rem',
        opacity: 1,
        duration: 1
      });
    }
  });
 
  if (VN.trim() !== '' && NN.trim() !== '' && email.trim() !== '' && geb.trim() !== '' && kla.trim() !== '') {
    await addDoc(collection(db, "userEvents"), {
      title: VN + '' + NN,
      name: VN + ' ' + NN,
      email: email,
      age: geb,
      Klasse: kla,
      newCategorie: addedIn || 'none',
      

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
} 
else {
  return (
   <>
       
     <div className="contentA"  >
      {events.map((event) => (
        <div className="title_events_2" >
              {event.topic}
        </div>
      ))}
      <div className='loadofinputs'>
          <input type="text"   className='search' placeholder="Vorname." onChange={(e) => setVN(e.target.value)} />
          <input type="text" className='search' placeholder="Nachname." onChange={(e) => setNN(e.target.value)} />
          <input type="number" className='search' placeholder="Alter." onChange={(e) => setGeb(e.target.value)} />
          <input type="text" className='search' placeholder="Klasse." onChange={(e) => setKla(e.target.value)} />
          <input type="text" className='search' placeholder="E-Mail."  onChange={(e) => setEmail(e.target.value)}  />
      </div>
      <br/>

      {/* Hinzugefügte Inputs werden gemappt  */}
      {inputsList.map((item) => (
        <>
         <div className="infoIN">{item.titleIN}</div> 
           <div className="INDEL">
              <input type="text" className='search' placeholder={item.placeholder} onChange={onChange}/>
               {Cookies.get('isAdmin') || Cookies.get('isDeveloper') ? (
                  <div className="PosbtnDelIn">
                   <br/>
                   <FontAwesomeIcon icon={faTrash} onClick={ async() => {
                       try {
                        const q = query(collection(db, "inputs"), where('titleIN', '==', item.titleIN ));
                        const querySnapshot = await getDocs(q);
                  
                        querySnapshot.forEach(async (docSnapshot) => {
                          const docRef = doc(db, "inputs", docSnapshot.id);
                          await deleteDoc(docRef);
                        });
                        counterDelete();
                        alert('Eingabefeld erfolgreich gelöscht!');
                  
                      } catch(error) {
                        console.log(error);
                        alert('Eingabefeld konnte leider nicht gelöscht werden');
                      }
                      
                   }} className="btnDelIn"/>
                  </div>
               ): (
                <>

                </>
               )}
             </div>  
             {/*Delete Container */}
             {/* <div className="delete" style={{opacity: deleteCon ? '1' : '0', zIndex: deleteCon ? '1000' : '-1'}}>
               <div className="conDelte">
                 <div className="backToForm" onClick={pressDel}>
                   <FontAwesomeIcon icon={faX}/>
                 </div>
                <div className="DelInfo">
                  <div className="DelText">
                    Bitte geben Sie hier den Titel des Eingabefeldes mit einem Doppelpunkt hinten dran ein und
                    <br/> bestätigen Sie dann die Löschung dieses Eingabefeldes, um es zu löschen.
                    <br/> <br/>
                    <input type="text" className='searchAI' placeholder="Titel eines Eingabefeldes mit einem Doppelpunkt hinten dran"  
                         onChange={(e) => setDeleteIn(e.target.value)}
                         style={{ padding: deleteCon ? '10px' : '10px',
                                  width: deleteCon ? '60vw' : "60vw",  }} />
                    <br/>
                    <button className="bearbeiten1" onClick={deleteInput} 
                           style={{width: deleteCon ? '60vw' : "60vw",
                                   fontSize: deleteCon ? '120%' : '120%', 
                                   padding: deleteCon ? '10px' : '10px'}}>
                       Löschung des Eingabefeldes
                    </button>
                 </div>
               </div>*/}
       </>
      ))}
      <br/>
      <br/>
      {plusIcon}
      {/*Hier werden die Inputs hinzugefügt */}
      <div style={{width: clickIN ? '60vw' : "0",
                  fontSize: clickIN ? '100%' : '0vw',
                  transition:'0.3s ease-in-out',
                  display: Cookies.get('isDeveloper') == 'true' || Cookies.get('isAdmin') == 'true' ? 'flex' : 'none'}}  className="infoIN">
         Titel des neuen Eingabefeldes:
      </div> 
      <br/>
      <input style={{zIndex: deleteCon ? '-1' : '1' ,
                     padding: clickIN ? '10px' : '0px',
                     width: clickIN ? '60vw' : "0vw", 
                     transition:'0.3s ease-in-out', 
                     display: Cookies.get('isDeveloper') == 'true' || Cookies.get('isAdmin') == 'true' ? 'flex' : 'none'}} 
              type="text"
              className='searchAI'
              placeholder="Titel des Eingabefeldes..."
              onChange={(e) => setInF(e.target.value)}   />
      <button className="bearbeiten1  btnAddIN" 
              onClick={sendInput} 
              style={{ display: clickIN ? 'flex' : 'none',
              }}>
         Senden des Eingabefeldes
      </button>
      <div className="btnPos">
        <button className="bearbeiten1" onClick={sendForm} style={{ marginTop: "5%" }}>
          Senden
        </button>
     </div>
     <br />
     <div className="eventname21" style={{ color: 'blue', textDecoration: 'underline blue 1px', cursor: "pointer" }} onClick={pressF}>
       ← Zurück
     </div>
    </div>
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
             <div>
              <span className="angabezeit">Datum: </span> {event.date} 
              <br/>
              <br/>
              <span className="angabezeit">Zeit: </span> {event.time} 
              <br/>
              <br/>
              <span className="angabezeit">Ort: </span>  {event.place}
              <br/>
              <br/>
             </div> 
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

