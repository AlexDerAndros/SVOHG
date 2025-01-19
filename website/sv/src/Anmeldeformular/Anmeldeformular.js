import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import gsap from "gsap";
import { useState, useEffect, useRef } from "react";
import { faTrash, faX, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  db } from "../config/firebase"; 
import { getDocs, collection, Timestamp, addDoc, deleteDoc, doc, where, query, setDoc, updateDoc } from "firebase/firestore"; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


gsap.registerPlugin(ScrollTrigger);

export default function Anmeldeformular1() {
  const [verfügbar, setVerfügbar] = useState(false);
  const [events, setEvents] = useState([]);
  const [clickEF, setClickEF] = useState(false);
 

  const remove = async () => {
    gsap.to('.alert', {
      display: 'flex',
      duration: 2,
      onComplete: () => {
        gsap.to('.alert', {
          display:'none', 
          duration: 2
        })
      }
    });
    Cookies.set('EventRaus', false , {expires: 28});

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
  const [eventList, setEventList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newEventList, setNewEventList] = useState([]);
  const [topic, setTopic] = useState('');

  const pressF = async () => {
    try {
      gsap.to(".eventname1", {
        scale: 1.2,
        duration: 0.5,
      });
  
      setTimeout(() => {
        setClickF(!clickF); 
      }, 500);
  
      const q = query(collection(db, 'events'), where('topic', '==', currentEvent.topic));
      const querySnapshot = await getDocs(q);
      const list = [];
      
      querySnapshot.forEach((docSnapshot) => {
          list.push(docSnapshot.data());  
      });
  
      setNewEventList(list);
      setTopic(currentEvent.topic);
      Cookies.set('topic', currentEvent.topic, {expires: 7});
      Cookies.set('time', currentEvent.time, {expires: 7});
      Cookies.set('place', currentEvent.place, {expires: 7});
      Cookies.set('longD', currentEvent.longDescription, {expires: 7});
      Cookies.set('date', currentEvent.date, {expires: 7});

    } catch (error) {
      console.error("Error fetching new events: ", error);
    }
  };
  
const [alert, setAlert] = useState(false);
const currentEvent = eventList[currentIndex];

const pressAlert = () => {
  Cookies.set('EventRaus', true, { expires: 28 });
  setAlert(true); 
};
  setTimeout(() => {
    Cookies.set('EventRaus', true, {expires: 28});
    setAlert(true); 

  }, 5000);
  function eventdavor() {

    gsap.to('.davor', {
      transform: 'scale(1.2)',
      duration: 0.2,
      onComplete: () => {
        gsap.to('.davor', {
          transform: 'scale(1)',
          duration: 0.2
        });
      }
    });
    // gsap.to('.tabelle1', {
    //   x: '-90vw',
    //   duration: 2.5,
    //   ease: 'power1.in',
    // });
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? eventList.length - 1 : prevIndex - 1
    );
    
  }

  function nachstesevent() {

    gsap.to('.danach', {
      transform: 'scale(1.2)',
      duration: 0.2,
      onComplete: () => {
        gsap.to('.danach', {
          transform: 'scale(1)',
          duration: 0.2
        });
      }
    });
    // gsap.to('.tabelle1', {
    //   x: '0px',
    //   duration: 2.5,
    //   ease: 'power1.in',
    // });
    setCurrentIndex((prevIndex) =>
      prevIndex === eventList.length - 1 ? 0 : prevIndex + 1
    );

  }
 
  
  
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
    async function fetchEvents() {
      try {
        const eventsCol = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCol);
        const eventsList = eventSnapshot.docs.map(doc => doc.data());
        const formattedEvents = eventsList.map(event => ({
          ...event,
          date: event.date instanceof Timestamp ? event.date.toDate().toLocaleDateString() : event.date,
          time: event.time,
          place: event.place,
          topic: event.topic,
          shortDescription: event.shortDescription,
        }));

        setEventList(formattedEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    }
   
     Cookies.set('EventRaus', true, {expires:7});
    fetchEvents();
  }, [events]);
  
  return (
    <>
     
    {clickF ? (
      <Formular newEventList={newEventList} pressF={pressF} clickEF={clickEF} remove={remove} setClickEF={setClickEF} topic={topic} />
    ) : (
      <>
      <div className="alert" style={{ display: Cookies.get('EventRaus') == 'true' || alert == true ? 'none' : 'flex'}}>
           Sie wurden aus dem Event ausgetragen!
           <span className="alertDelete">
              <FontAwesomeIcon className="alertDel" icon={faX} onClick={pressAlert} />
            </span>
            <span className="lineAlert" ></span>

         </div>
         <div className="eventsU">
       
         
            <div className="events1">
           
            <div className="coneven1">
              <div className="davor1" onClick={eventdavor}><FontAwesomeIcon icon={faArrowLeft} /></div>
              <div className="title_events" >{currentEvent ? currentEvent.topic : ''}</div>
              <div className="danach1" onClick={nachstesevent}><FontAwesomeIcon icon={faArrowLeft} style={{ transform: "rotate(180deg)"}}/></div>
            </div>
            <div className="tabelle1" >
              <div className="zeit">
                <div className='angabezeit'>Datum: &nbsp;</div>
                {currentEvent ? currentEvent.date : ''}  
              </div>
              <div className="zeit">
                <div className='angabezeit'>Zeit: &nbsp;</div>
                {currentEvent ? currentEvent.time : ''}
              </div>
              <div className="zeit">
                <div className='angabezeit'>Ort: &nbsp;</div>
                {currentEvent ? currentEvent.place : ''}
              </div>
              <div className="eventnameAusnahme">
                <div className='angabezeit'>Worum geht es bei dem Event: {currentEvent ? currentEvent.topic : ''} ? &nbsp;</div>
                <div className="textEv">
                  {currentEvent ? currentEvent.longDescription : ''}
                </div>
              </div>
              <div className="eventnameAusnahme">
                <div className='angabezeit'>Wie nehme ich bei dem Event: {currentEvent ? currentEvent.topic : ''} teil? &nbsp;</div>
                <div className="textEv">
                  Beim dem Event: {currentEvent ? currentEvent.topic : ''} kann man teilnehmen, indem Sie auf den unteren Knopf ,,Ich bin ein/e Schüler*in." drücken. Wenn Sie den gedrückt haben, können Sie sich dann für das Event anmelden.
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
          </div>

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



function Formular({ newEventList, pressF, clickEF, remove, setClickEF, topic }) {
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

  const [textIN1, setTextIN1] = useState('');
  const [textIN2, setTextIN2] = useState('');
  const [textIN3, setTextIN3] = useState('');
  const [textIN4, setTextIN4] = useState('');
  const [textIN5, setTextIN5] = useState('');

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
           placeholder: inF + '.',
           titleIN: inF + ':',
           number: newCountdown,
           input: inF,
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
        duration: 1,
        ease: 'power3.out'
      });
    }
  });
  gsap.to('.alert', {
    display: 'flex',
    duration: 5,
    onComplete: () => {
      gsap.to('.alert', {
         display:'none',
         duration: 5, 
       
       })
      }
   });
  gsap.to('.lineAlert', {
    duration: 5,
    width: '100%',  
    ease: 'power1.inOut',  
    position: 'absolute',
    bottom: '0%',
    onComplete: () => {
      gsap.to('.lineAlert', {
        duration: 5,
        width: '0%',  
        ease: 'power1.inOut',  
        position: 'absolute',
        bottom: '0%',
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
      textIN1: textIN1 || 'none',
      textIN2: textIN2 || 'none',
      textIN3: textIN3 || 'none',
      textIN4: textIN4 || 'none',
      textIN5: textIN5 || 'none',
      timestamp: new Date(),
      topic: topic || 'none'
      

    });
    setClickEF(true);
    Cookies.set('teil', true, { expires: 14});
    Cookies.set("name", VN + ' ' + NN, { expires: 14 });
    Cookies.set("age", geb, { expires: 14 });
    Cookies.set("kla", kla, { expires: 14});
    Cookies.set("email1", email, { expires: 14 });
    Cookies.set('confirmationForm', false, {expires: 28});
    Cookies.set('timestamp', new Date(), {expires: 14});
    Cookies.set('textIN1', textIN1 || 'none', {expires: 14});
    Cookies.set('textIN2', textIN2 || 'none', {expires: 14});
    Cookies.set('textIN3', textIN3 || 'none', {expires: 14});
    Cookies.set('textIN4', textIN4 || 'none', {expires: 14});
    Cookies.set('textIN5', textIN5 || 'none', {expires: 14});

   
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
  return <InEvent remove={remove} newEventList={newEventList} topic={topic} />;
} 
else {
  return (
   <>
       
     <div className="contentA"  >
      {newEventList.map((event) => (
        <div className="title_events_2" >
              {event.topic}
        </div>
      ))}
     
      <div className='loadofinputs'>
          <input type="text"   className='search' placeholder="Vorname." onChange={(e) => setVN(e.target.value)} />
          <input type="text" className='search' placeholder="Nachname." onChange={(e) => setNN(e.target.value)} />
          <input type="text" className='search' placeholder="Alter." onChange={(e) => setGeb(e.target.value)} />
          <input type="text" className='search' placeholder="Klasse." onChange={(e) => setKla(e.target.value)} />
          <input type="text" className='search' placeholder="E-Mail."  onChange={(e) => setEmail(e.target.value)}  />
      </div>
      <br/>

      {inputsList.length > 0 && (
  <div>
    {inputsList.map((item, index) => (
     <>
     <div className="columnInputs" style={{width: Cookies.get('isAdmin') || Cookies.get('isDeveloper') ? '104%' : '102.5%'}}>
        <div className="rowInputs">              
      <input
        key={index}
        type="text"
        className="search"
        placeholder={item.placeholder}
        onChange={(e) => {
          switch (index) {
            case 0:
              setTextIN1(e.target.value);
              break;
            case 1:
              setTextIN2(e.target.value);
              break;
            case 2:
              setTextIN3(e.target.value);
              break;
            case 3:
              setTextIN4(e.target.value);
              break;
            case 4:
              setTextIN5(e.target.value);
              break;
            default:
              break;
          }
        }}
      />
      <div className="INDEL">
       {Cookies.get('isAdmin') || Cookies.get('isDeveloper') ? (
                  <div className="PosbtnDelIn" >
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
             </div> 
             <br/>
      </div>
        
      </> 
    ))}
  </div>
)}

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

function InEvent({ remove, newEventList, topic }) {
  const [teilnehmer, setTeilnehmer] = useState([]);
  const [alert, setAlert] = useState(false);
  const [editEventInfo, setEditEventInfo] = useState(false);
  const [inputs, setInputs] = useState([])
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editKlasse, setEditKlasse] = useState('');
  const [editText1, setEditText1] = useState('');
  const [editText2, setEditText2] = useState('');
  const [editText3, setEditText3] = useState('');
  const [editText4, setEditText4] = useState('');
  const [editText5, setEditText5] = useState('');

  
  let name = Cookies.get("name") || "Sie können Ihre Anmeldedaten nur auf dem Gerät abrufen, auf dem Sie sich für das Event angemeldet haben.";
  let age = Cookies.get("age") || "Hier ist dasselbe der Fall.";
  let email = Cookies.get("email1") || "Hier ist dasselbe der Fall.";
  let klasse = Cookies.get("kla") || "Hier ist dasselbe der Fall.";
  let timestamp = Cookies.get('timestamp');
  
  const texts = [ Cookies.get('textIN1') ,
    Cookies.get('textIN2') ,
     Cookies.get('textIN3') ,
     Cookies.get('textIN4') ,
     Cookies.get('textIN5') 
  ]


  const fetchTeilnehmer = async () => {
    const TeilnehmerCol = collection(db, 'userEvents');
    const messagesSnapshot = await getDocs(TeilnehmerCol);
    const messagesList = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTeilnehmer(messagesList);
  };

 
  const fetchCookies = () => {
    setEditName(Cookies.get('name'));
    setEditAge(Cookies.get('age'));
    setEditEmail(Cookies.get('email1'));
    setEditKlasse(Cookies.get('kla'));
    setEditText1(Cookies.get('textIN1'));
    setEditText2(Cookies.get('textIN2'));
    setEditText3(Cookies.get('textIN3'));
    setEditText4(Cookies.get('textIN4'));
    setEditText5(Cookies.get('textIN5'));

  }

  const AktualisierungEventDaten = async () => {
    try {
      const q = query(
        collection(db, 'userEvents'), 
        where('name', '==', name),
        where('email', '==', email),
      );
  
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map((docSnapshot) => {
        const updateData = {
          name: editName, 
          title: editName, 
          age: editAge, 
          Klasse: editKlasse,
          email: editEmail,
          textIN1: editText1 || 'none', 
          textIN2: editText2 || 'none', 
          textIN3: editText3 || 'none', 
          textIN4: editText4 || 'none', 
          textIN5: editText5 || 'none', 

        };
  
        const docRef = doc(db, 'userEvents', docSnapshot.id);
        return updateDoc(docRef, updateData);
      });
  
      await Promise.all(updatePromises);
  
      Cookies.set('name', editName, { expires: 14 });
      Cookies.set('age', editAge, { expires: 14 });
      Cookies.set('email1', editEmail, { expires: 14 });
      Cookies.set('kla', editKlasse, { expires: 14 });
      Cookies.set('textIN1', editText1, { expires: 14 });
      Cookies.set('textIN2', editText2, { expires: 14 });
      Cookies.set('textIN3', editText3, { expires: 14 });
      Cookies.set('textIN4', editText4, { expires: 14 });
      Cookies.set('textIN5', editText5, { expires: 14 });


      
      fetchCookies();
      setEditEventInfo(false);
      alert('Ihre Infos wurden erfolgreich aktualisiert.');
    } catch (e) {
      console.error('Error: ' + e);
    }
  };
  
  const texts2 = [editText1, editText2, editText3, editText4, editText5];

  const fetchInputs = async () => {
    const inputCol = collection(db, 'inputs');
    const inputSnapchot = await getDocs(inputCol);
    const inputList = inputSnapchot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInputs(inputList);
  }
  useEffect(() => {
    fetchTeilnehmer();
    fetchCookies();
    fetchInputs();
  }, []);


 
 

const pressEditEvent = () => {
  setEditEventInfo(!editEventInfo);
}
const pressAlert = () => {
  Cookies.set('confirmationForm', true, { expires: 28 });
  setAlert(true); 
};
 setTimeout(() => {
  Cookies.set('confirmationForm', true, { expires: 28 });
  setAlert(true); 
 }, 5000)
    
 


  return (
    <>
     <div className="alert" style={{ display: Cookies.get('confirmationForm') === 'true' || alert ? 'none' : 'flex' }}>
            Ihr Formular wurde an die SV gesendet. Sie können nun an dem Event teilnehmen!
            <span className="alertDelete">
              <FontAwesomeIcon className="alertDel" icon={faX} onClick={pressAlert} />
            </span>
            <span className="lineAlert" ></span>
          </div> 
     
        <>
         

          <div className="contentB">
            <div className="coneven2">
              <div className="title_events">{Cookies.get('topic')}</div>
            </div>
            <div className="tabelle1">
              <div style={{ fontWeight: '600' }}>
                Sie können nun an diesem Event teilnehmen.
              </div>
               <> 
              <div className="eventnameAusnahme">
                <div>
                  <span className="angabezeit">Datum: </span> {Cookies.get('date')}
                  <br />
                  <br />
                  <span className="angabezeit">Zeit: </span> {Cookies.get('time')}
                  <br />
                  <br />
                  <span className="angabezeit">Ort: </span> {Cookies.get('place')}
                  <br />
                  <br />
                </div>
                <div className="angabezeit">Worum geht es bei dem Event: {Cookies.get('topic')}? &nbsp;</div>
                <div className="textEv">{Cookies.get('longD')}</div>
              </div>
              <div className="eventnameAusnahme">
                <div className="angabezeit">Wie nehme ich bei dem Event: {Cookies.get('topic')} teil? &nbsp;</div>
                <div className="textEv">
                  Bei dem Event: {Cookies.get('topic')} kann man teilnehmen, indem Sie auf den unteren Knopf ,,Ich bin ein/e Schüler*in." drücken. Wenn Sie den gedrückt haben, können Sie sich dann für das Event anmelden.
                </div>
              </div>
              </>  
              <div>
                <div style={{ fontWeight: '600' }}>
                  Ihre Informationen: 
                  <div style={{ fontWeight: '400' }}>
                    {editEventInfo ? (
                      <>
                         <input className="search   EditEvent" value={editName} type="text" placeholder={`Name: ${name}`} onChange={(e) => setEditName(e.target.value)}/>
                         <input className="search   EditEvent" value={editAge} type="text" placeholder={`Alter: ${age}`} onChange={(e) => setEditAge(e.target.value)}/>
                         <input className="search   EditEvent" value={editKlasse} type="text" placeholder={`Klasse: ${klasse}`} onChange={(e) => setEditKlasse(e.target.value)}/>
                         <input className="search   EditEvent" value={editEmail} type="text" placeholder={`E-Mail: ${email}`} onChange={(e) => setEditEmail(e.target.value)}/>
                         {inputs.map((input, index) => (
                         <div key={index}>
                           <input className="search   EditEvent"   value={texts2[index]}  type="text" placeholder={`${input.input}: ${texts[index]}`} 
                                   onChange={(e) => {
                                    switch (index) {
                                      case 0:
                                        setEditText1(e.target.value);
                                        break;
                                      case 1:
                                        setEditText2(e.target.value);
                                        break;
                                      case 2:
                                        setEditText3(e.target.value);
                                        break;
                                      case 3:
                                        setEditText4(e.target.value);
                                        break;
                                      case 4:
                                        setEditText5(e.target.value);
                                        break;
                                      default:
                                        break;
                                    }
                                  }}/>
                           
                        </div>
                             ))}
                         <button className="bearbeiten" style={{width:'60vw'}} onClick={AktualisierungEventDaten}>
                           Aktualisierung der angegebenen Daten
                         </button>
                        
                      </>
                    ) :(
                      <> 
                         <div>Name: {name}</div>
                        <div>Alter: {age}</div>
                        <div>Klasse: {klasse}</div>
                        <div>E-Mail: {email}</div>
                         
                        <div>
                        {inputs.map((input, index) => (
                         <div key={index}>
                           <span>{input.input}: </span>
                           <span>{texts[index]}</span>
                          <br />
                        </div>
                             ))}
                       </div>

                          
                          
                      </>
                    )}
                    
                  </div>
                  <div onClick={pressEditEvent} style={{cursor:'pointer'}}>
                    {editEventInfo ? (
                      <>
                      <br/> 
                       <FontAwesomeIcon icon={faX} 
                       size="2x"
                       style={{textAlign:'right', width: '100vw'}}/>
                       </>
                    ): (
                      <>
                      <br/>
                        <FontAwesomeIcon icon={faEdit} 
                       size="2x"
                       style={{textAlign:'right', width: '100vw'}}/>
                      </>
                    )}
                  </div>
                 
                </div>
              </div>
              <button className="bearbeiten" onClick={remove}>
                Ich möchte nicht mehr an diesem Event teilnehmen.
              </button>
            </div>
          </div>
        </>
    </>
  );
}