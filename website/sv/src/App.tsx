import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { gsap } from 'gsap';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faMagnifyingGlass, faTimes, faRightToBracket, faPenToSquare, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import { faInstagram,  faGithub} from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import SVKasten1 from './SVKasten/SVKasten';
import Anmeldeformular1 from './Anmeldeformular/Anmeldeformular';
import Login1 from './Login/Login';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { auth, db } from "./config/firebase"; // import Firestore db
import 'firebase/analytics';
import { doc, updateDoc } from "firebase/firestore";

import { getDoc, setDoc, collection, getDocs, getFirestore , Timestamp, query} from "firebase/firestore"; // import Firestore functions

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



interface Event {
    date: string;
    time: string;
    place:string;
    topic?: string;
    shortDescription?: string;
    longDescription?: string;
    // Füge hier andere Felder hinzu, die ein Event haben könnte
}



/*Aufgaben:
Bug Fixes:
-Was ist dir SV, Wofür ist sie da Fixen CSS Flexbox
- Gap zwischen Impressum und Rest fixen
- ⁠Footer box shadow
- ⁠Login 
- ⁠Search`s
- ⁠Events
- ⁠Transition zwischen Farben in der Startseite
- ⁠Hamburger Menu schließt sich selbst
- ⁠Links für jedes einzelne Thema
- ⁠Reinfolge Impressum fixen
- ⁠Eventseite fixen
- ⁠nach oben scrollen automatisch, wenn man draufdrückt
- ⁠Dashboard für die SV */

export default function App() {
  return (
    <main>
      <HeaderBottom />
    </main> 
  );
}

function HeaderBottom() {
  
  const [startseite, setStartseite] = useState(false);
  const [login, setLogin] = useState(false);
  const [svKasten, setSvKasten] = useState(false);
  const [ search, setSearch] = useState(false);
  const [ Anmeldeformular, setAnmeldeformular] = useState(false);
  const [isFocusedS, setIsFocusedS] = useState(true);
  const [isFocusedL, setIsFocusedL] = useState(false);
  const [isFocusedSVK, setIsFocusedSVK] = useState(false);
  const [isFocusedSEA, setIsFocusedSEA] = useState(false);
  const [isFocusedSA, setIsFocusedSA] = useState(false);

  
  
  const pressSearch = () => {
    setSearch(true);
    setSvKasten(false);
    setLogin(false);
    setStartseite(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsFocusedSEA(true);
    setIsFocusedS(false);
    setIsFocusedL(false);
    setIsFocusedSVK(false);
    setIsFocusedSA(false);

  }
  
  const pressStartseite = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(false);
    setStartseite(true);    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsFocusedSEA(false);
    setIsFocusedS(true);
    setIsFocusedL(false);
    setIsFocusedSVK(false);
    setIsFocusedSA(false);

  }
  const pressLogin = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(true);
    setStartseite(false);    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsFocusedSEA(false);
    setIsFocusedS(false);
    setIsFocusedL(true);
    setIsFocusedSVK(false);
    setIsFocusedSA(false);


  }
  const pressSVKasten = () => {
    setSearch(false);
    setSvKasten(true);
    setLogin(false);
    setStartseite(false);    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsFocusedSEA(false);
    setIsFocusedS(false);
    setIsFocusedL(false);
    setIsFocusedSVK(true);
    setIsFocusedSA(false);

   

  }
  const pressAnmeldeformular = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(false);
    setStartseite(false);
    setAnmeldeformular(true);    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsFocusedSEA(false);
    setIsFocusedS(false);
    setIsFocusedL(false);
    setIsFocusedSVK(false);
    setIsFocusedSA(true);



  }
  const [click, setClick] = useState(false);
  const [value, setValue] = useState('');
  const [list, setList] = useState([
    { theme: 'Startseite', link: '/', index: 1 },
    { theme: 'Events', link: '/Anmeldeformular', index: 2 },
    { theme: 'Login', link: '/Login', index: 3 },
    { theme: 'SV Kasten', link: '/SV Kasten', index: 4 }
  ]);
  const [filteredItems, setFilteredItems] = useState(list);

  const press = () => {
    setClick(!click);
  };

  const handleFilter = (filterTerm: string) => {
    const filteredItems = list.filter(item => item.theme.toLowerCase().includes(filterTerm.toLowerCase()));
    setFilteredItems(filteredItems);
    setValue(filterTerm);
  };
  let element;
  if (click === true) {
    element =   <FontAwesomeIcon onClick={press} icon={faTimes} size='2x' className='hamburger-menu' />;
  }
  else {
    <FontAwesomeIcon icon={faBars}  onClick={press} className ="hamburger-menu"/>;

  }
   let color = 'rgb(127, 163, 231)';
  
  return (
    <>
    <BrowserRouter>
      {/* <div className='content' style={{height: click ? "40%" : '0%' }}>
        {click && (
          <>
            <div className='Hambuger-Elemente'>
              
              <div className='inSp'>
                <input type='text'
                 value={value}
                 onChange={(e) => handleFilter(e.target.value)}
                 placeholder='Suchen...'
                 className='search' 
                 style={{height:"10vh", marginLeft:"10%", padding:"0.1% 2%"}}/>
               </div>  
            </div>
            <ul className='searchOv' >
              {filteredItems.map((item) => (
                <li key={item.index} >
                  <Link to={item.link} className='searchEle'>
                    {item.theme}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div> */}
      <header>
        <div className="gap1234123"></div>
        <div className='LogoSVCon'>
            <img src='./3.png' className='LogoSV' alt='Logo' />
        </div>
        <div className='title'>
          <a href="/">
          SV Otto-Hahn-Gymnasium
          </a>
        </div>
        <div className="menu" style={{display:"none"}}>
          {click ? (
            <>
             <FontAwesomeIcon onClick={press} icon={faTimes} size='2x' className='hamburger-menu' />;
             </>
            
          ): (
            <>
         <FontAwesomeIcon icon={faBars}  onClick={press} className ="hamburger-menu"/>
         </>
          )}
        </div>
        <div className='Menu'>
        <Link to='/' className='svasdf' onClick={pressStartseite}>   
            <div  style={{ color: isFocusedS ? color : 'white',  transform: isFocusedS ? " scale(1.3)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Startseite</div>
        </Link> 
         <Link to="/Anmeldeformular" className='svasdf' onClick={pressAnmeldeformular}>
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: isFocusedSA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_5' onClick={pressAnmeldeformular}/>
         <div style={{ color: isFocusedSA ? color : 'white' ,  transform: isFocusedSA ? " scale(1.3)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Events</div>
         </Link>
        <Link to="/SV Kasten" className='svasdf'  onClick={pressSVKasten}>
         <FontAwesomeIcon icon={faPenToSquare} style={{ color: isFocusedSVK ? "rgb(127, 163, 231)" : 'white'}}  className='house_icon_4' />
         <div  style={{ color: isFocusedSVK ? color: 'white' ,  transform: isFocusedSVK ? " scale(1.3)" : "scale(1)", transition:"ease-in-out 0.3s"}}>SV Kasten</div>
         </Link>
        <Link to='/Search'className='svasdf' onClick={pressSearch}>
         <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: isFocusedSEA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_3' onClick ={pressSearch}/>
         <div  style={{ color: isFocusedSEA ? color : 'white',  transform: isFocusedSEA ? " scale(1.3)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Suche</div>
        </Link> 
        <Link to = '/login'className='svasdf' onClick={pressLogin}>
         <FontAwesomeIcon icon={faRightToBracket} style={{ color: isFocusedL ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_2' onClick={pressLogin}/>
         <div style={{ color: isFocusedL ? color : 'white',  transform: isFocusedL ? " scale(1.3)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Login</div>
        </Link> 
        </div>
      </header>
      <div>
        
      </div>
        
      <footer>
        <div className='icons_footer ' >
        <Link to='/' className='svasdf' onClick={pressStartseite}>   
         <FontAwesomeIcon icon={faHouse} className='house_icon'  id='first' style={{ color: isFocusedS ? color : 'white'}} />
            <div className='title_footer' style={{ color: isFocusedS ? color : 'white', transform:"scale(1.1)", }}>Home</div>
        </Link> 
        <Link to = '/login'className='svasdf'  onClick={pressLogin}>
         <FontAwesomeIcon icon={faRightToBracket} style={{ color: isFocusedL ? color : 'white'}} className='house_icon_2'/>
         <div className='title_footer' style={{ color: isFocusedL ? color : 'white'}}>Login</div>
        </Link> 
        <Link to='/Search'className='svasdf' onClick ={pressSearch} >
         <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: isFocusedSEA ? color : 'white'}} className='house_icon_3' />
         <div className='title_footer' style={{ color: isFocusedSEA ? color : 'white'}}>Suche</div>
        </Link> 
        <Link onClick={pressSVKasten} to="/SV Kasten" className='svasdf'  >
         <FontAwesomeIcon icon={faPenToSquare} style={{ color: isFocusedSVK ? color : 'white'}}  className='house_icon_4' />
         <div className='title_footer' style={{ color: isFocusedSVK ? color : 'white'}}>SV Kasten</div>
         </Link>
         <Link onClick={pressAnmeldeformular} to="/Anmeldeformular" className='svasdf' >
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: isFocusedSA ? color : 'white'}} className='house_icon_5' />
         <div className='title_footer'  style={{ color: isFocusedSA ? color : 'white'}}>Events</div>
         </Link>
        </div>
      </footer>
       <br/>
      <br/>
      <br/>
    
      <Routes>
        <Route path='/' element={<Startseite />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Anmeldeformular' element={<Anmeldeformularr/>} />
        <Route path='/SV Kasten' element={<SVKasten />} />
        <Route path='/Search' element={<Search />} />
        <Route path='/Search' element={<SVBeitreten />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}



function Startseite() {
  const svRef = useRef<HTMLDivElement | null>(null);
  const wofurRef = useRef<HTMLDivElement | null>(null);
  const kontaktRef = useRef<HTMLDivElement | null>(null);
  const beitretenRef = useRef<HTMLDivElement | null>(null);
  const teil1main = useRef<HTMLDivElement | null>(null);
  const questionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const conright123= useRef<HTMLDivElement | null>(null);
  const info = useRef<HTMLDivElement | null>(null);
  const line = useRef<HTMLDivElement | null>(null);
  const line44 = useRef<HTMLDivElement | null>(null);
  const iftar = useRef<HTMLImageElement | null>(null);
  const iftar2 = useRef<HTMLImageElement | null>(null);
  const iftar3 = useRef<HTMLImageElement | null>(null);
  const logo = useRef<HTMLImageElement | null>(null);

  const info2 = useRef<HTMLDivElement | null>(null);


  const title2 = useRef<HTMLDivElement | null>(null);


  const imgRef = useRef<HTMLImageElement | null>(null);
  const linetop = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const animateLogo = () => {
      gsap.to(logo.current, {
        height: '90px',
        duration: 1,
        onComplete: function() {
          gsap.to(logo.current, {
            height: '70px',
            duration: 1,
          })
        }
      })
    }
    const animateElement = (element: HTMLElement | null, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => {
      if (element) {
        gsap.fromTo(
          element,
          fromVars,
          {
            ...toVars,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    };

    animateElement(title2.current, { opacity: 0, }, { opacity: 1, duration: 1 });

    animateElement(imgRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2.5, ease: 'power3.out' });
    animateElement(linetop.current, { opacity: 0, height: '0px' }, { opacity: 1, height: '800px', duration: 4.5, ease: 'power3.out' });
    
    animateElement(eventsRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    animateElement(svRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    animateElement(wofurRef.current, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' });
    animateElement(kontaktRef.current, { opacity: 0, y: -100 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    animateElement(beitretenRef.current, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' });
    
    animateElement(teil1main.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power3.out' });
    animateElement(info.current, { opacity: 0, x: -150 }, { opacity: 1, x: 0, duration: 2, ease: 'power3.out' });
    animateElement(iftar.current, { opacity: 0,  stagger: 0.5, scale: 1.4 }, { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' });
    animateElement(iftar2.current, { opacity: 0,  stagger: 0.5, scale: 1.4 }, { opacity: 1, scale: 0.6, duration: 2, ease: 'power3.out' });
    animateElement(iftar3.current, { opacity: 0,  stagger: 0.5, scale: 1.4 }, { opacity: 1, scale: 0.6, duration: 2, ease: 'power3.out' });
    animateElement(logo.current, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' });
    animateElement(line.current, { height: '0px' }, { opacity: 1, duration: 2, height: '600px', ease: 'power3.out' });
    animateElement(line44.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power3.out' });


    animateElement(conright123.current, { opacity: 0, x: 150 }, { opacity: 1, x: -20, duration: 1, ease: 'power3.out' });
    
    animateElement(info2.current, { opacity: 0, x: '50vw' }, { opacity: 1, x: '-40px', duration: 2, ease: 'power3.out' });


    questionsRef.current.forEach((question, index) => {
      if (question) {
        let fromVars: gsap.TweenVars = { opacity: 0 };

        switch (index) {
          case 0:
            fromVars = { ...fromVars, y: 100 }; 
            break;
          case 1:
            fromVars = { ...fromVars, x: -100 }; 
            break;
          case 2:
            fromVars = { ...fromVars, y: -100 }; 
            break;
          case 3:
            fromVars = { ...fromVars, x: 100 }; 
            break;
          default:
            break;
        }

        animateElement(question, fromVars, { opacity: 1, x: 0, y: 0, duration: 1.5, ease: 'power2.out' });
      }
    });

    const cookieConsent = getCookie(COOKIE_NAME);
    if (!cookieConsent) {
      setTimeout(() => {
        setheightpopup('translateY(5vh)');
      }, 1000);
    } else {
      setFlexboxPopup('none');
    }

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

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    }
   

    fetchEvents();
  }, []);

  const [events, setEvents] = useState<any[]>([]);
  const [ currentIndex, setCurrentIndex ] = useState(0);

  const [flexboxPopup, setFlexboxPopup] = useState('flex');
  const [heightpopup, setheightpopup] = useState('translateY(100vh)');
  const COOKIE_NAME = 'cookieConsent';
  const COOKIE_EXPIRY_DAYS = 2;

  function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function getCookie(name: string) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
  }

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
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
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
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  }

  function deletePopup() {
    setheightpopup('translateY(100vh)');
    setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
    console.log('Popup display set to none and cookie set');
  }
   const currentEvent = events[currentIndex];
  return (
    <div className='abc123' style={{ background: "rgba(250, 255, 238, 0.993)" }}>
      <div className="popup" style={{ display: flexboxPopup, transform: heightpopup }}>
        <div className="innen_3">
          <div className="title_popup">
            <div className='bold'>Cookie-Zustimmung</div>
            <br />
            Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Indem Sie auf „Akzeptieren“ klicken, stimmen Sie der Verwendung von Cookies zu. Wenn Sie auf „Ablehnen“ klicken, werden keine Cookies gesetzt.
          </div>
          <div className="text_pop">
            <button className="button_cookies" onClick={deletePopup}>Akzeptieren</button>
            <button className="button_cookies" onClick={deletePopup}>Ablehnen</button>
          </div>
        </div>
      </div>
      <div className="all_container"></div>
      <div className="anfang">
        <div className='img-containerSV'>
            <div className="linetop" ref={linetop}></div>
          <img src='./SV 2.jpg' className='imgSV' alt='Foto' ref={imgRef} />
        </div>
        <br /><br />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className='text_container'>
            <div className="hallo">Hallo!</div>
            <div className="text_1">Wir sind die SV für das Otto-Hahn-Gymnasium Monheim am Rhein.</div>
            <div className="abstand"></div>
            <div className="events" ref={eventsRef} style={{ width: "80%" }}>
              <div className="coneven">
                <div className="davor" onClick={eventdavor}><FontAwesomeIcon icon={faArrowLeft} /></div>
                <div className="title_events">Aktuelle Events</div>
                <div className="danach" onClick={nachstesevent}><FontAwesomeIcon icon={faArrowLeft} style={{transform:'rotate(180deg)'}} /></div>
              </div>
              <div className="tabelle">
                <div className="tabelle1">
                  <div className="zeit">
                    <div className='angabezeit'>Datum: &nbsp;</div>
                    {currentEvent ? currentEvent.date : "Datum nicht verfügbar"}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Zeit: &nbsp;</div>
                    {currentEvent ? currentEvent.time : "Zeit nicht verfügbar"}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Ort: &nbsp;</div>
                    {currentEvent ? currentEvent.place : "Ort nicht verfügbar"}
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Thema: &nbsp;</div><br />
                    {currentEvent ? currentEvent.topic : "Thema nicht verfügbar"}
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Kurze Beschreibung: &nbsp;</div><br />
                    {currentEvent ? currentEvent.shortDescription : "Beschreibung nicht verfügbar"}
                  </div>
                </div>
                <div className="tabelle2">
                  <div className="foto">
                    <div className="holder">
                      <img className='imgbigred' src="./test.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="back"></div>
      <div className="line33" ref={line}></div>
      

      <div className="teil1main" ref={teil1main}>
        <div className="title_teil1">
          <h3>
          Was ist die  <div className='highvs2'>SV?</div>
          </h3>
        </div>
      <div className="teil1">
        <div className="right1">
        <div className="conright" ref={conright123}>
  <div className='sv-info' ref={info}>
    <h2>
    Die SV kümmert sich um die Umsetzung der Wünsche der Schüler*innen am Otto-Hahn-Gymnasium. Die SV organisiert verschiedene spaßige und lustige Events, z. B
    </h2>
    <h2> <img src='./favicon2.ico' className='SVetwas' /> Aktionen für das Schulleben:</h2>
    <ul>
      <li>Unterstufendiskos</li>
      <li>Abschlussaktion</li>
      <li>Talentwettbewerb</li>
      <li>Schulfest-Aktionen</li>
      <li>Speisenverkauf beim Weihnachtskonzert</li>
      <li>Rosen- und Nikolausaktion mit Fairtrade AG</li>
    </ul>

    <h2><img src='./favicon2.ico' className='SVetwas' /> Interessenvertretung:</h2>
    <ul>
      <li>Schul- und Fachkonferenzen</li>
      <li>Unterstützung bei schulischen Problemen</li>
    </ul>

    <h2><img src='./favicon2.ico' className='SVetwas' /> Freizeitgestaltung:</h2>
    <ul>
      <li>Stufenübergreifende Turniere</li>
      <li>„Schülerteam gegen Lehrerteam“</li>
    </ul>

    <h2><img src='./favicon2.ico' className='SVetwas' /> Schülerfirmen und Projekte:</h2>
    <ul>
      <li>Kiosk: verkauft Milch, Kakao, Brötchen; Überschüsse für ein Patenkind</li>
      <li>Zukunftsideen: Spendenaktionen, Umwelt-Tage, vegane Tage</li>
    </ul>
  </div>
</div>
        </div>
        <div className="left1">
              <div className="foto_con">
                <img className='iftar' ref={iftar} src="./Iftar.jpg" alt="" />
                <img className='iftar2' ref={iftar2}   src="./Mingolf.jpg" alt="" />
                <img className='iftar3' ref={iftar3} src="./SV.jpg" alt="" />
              </div>
        </div>
      </div>
      <div className="line44" ref={line44}></div>
      </div>
      <div className="teil2">
        <div className="title_teil1" id='skondone' ref={title2}>
          <h3>
            Was hat die SV für Aufgaben?
          </h3>
        </div>
        <div className="fototeil">
        <img src='./favicon2.ico' className='SVetwas2' ref={logo} />
        </div>
        <div className="innencon">
            <div className="teilr">
            <img className='iftar' ref={iftar} src="./Iftar.jpg" alt="" />

            </div>
            <div className="teill">
              <div className="sv_info2" ref={info2}>
              <p>Die Schülervertretung (SV) spielt eine zentrale Rolle im Schulleben und setzt sich für die Interessen der Schüler ein. Mit viel Engagement sorgt die SV dafür, dass Schule mehr ist als nur Unterricht und Prüfungen. Hier sind die wichtigsten Aufgaben und Aktivitäten der SV:</p>

<h2><img src='./favicon2.ico' className='SVetwas' />Organisation von Events:</h2>
<ul>
  <li>Unterstufendiskos</li>
  <li>Abschlussaktion</li>
  <li>Talentwettbewerb</li>
  <li>Schulfest-Aktionen</li>
  <li>Speisenverkauf beim Weihnachtskonzert</li>
  <li>Rosen- und Nikolausaktion mit Fairtrade AG</li>
</ul>

<h2><img src='./favicon2.ico' className='SVetwas' />Vertretung der Schülerinteressen:</h2>
<ul>
  <li>Teilnahme an Schul- und Fachkonferenzen zur Vertretung der Interessen der Schülerschaft</li>
  <li>Beratung und Unterstützung bei schulischen Problemen, z.B. mit Lehrern</li>
</ul>

<h2><img src='./favicon2.ico' className='SVetwas' />Kooperation mit anderen Gruppen:</h2>
<ul>
  <li>Organisation von Aktionen wie der Rosen- und Nikolausaktion in Zusammenarbeit mit der Fairtrade-AG</li>
  <li>Stärkung des Gemeinschaftsgefühls und Förderung sozialer Verantwortung</li>
</ul>

<h2><img src='./favicon2.ico' className='SVetwas' />Soziale Projekte:</h2>
<ul>
  <li>Betreibung eines Schulkiosks: Verkauf von Milch, Kakao, Brötchen; Überschüsse fließen in die Unterstützung eines Patenkindes in Bangladesch</li>
  <li>Planung und Durchführung von Spendenaktionen, Umwelt-Tagen und veganen Tagen</li>
</ul>



              </div>
            </div>
        </div>
        <div className="BTCON123">
              <button className='treten1'>
                <a href="/Anmeldeformular">
              Klicken sie hier, um am SV Talentwettbewerb teilzunehmen! <img src='./arrowleft.svg' className='arrowleft' />  
                </a>
              </button>

        </div>
      </div>
      <div className="teil1main" ref={teil1main} id='zeitung'>
        <div className="title_teil1" id='zei2'>
          <h3>
          Wie könnt ihr uns <div className='highvs2'>Kontaktieren?</div>
          </h3>
        </div>
      <div className="teil1">
        <div className="right1">
        <div className="conright" id='seite' >
  <div className='sv-info'ref={info}>

  <h2><img src='./favicon2.ico' className='SVetwas' /> Wie ihr die Schülervertretung (SV) kontaktieren könnt</h2>
<p>
    Ihr habt verschiedene Möglichkeiten, um mit uns in Kontakt zu treten. Wenn ihr Fragen, Ideen, Verbesserungsvorschläge oder Probleme habt, könnt ihr uns ganz einfach erreichen:
</p>
<ul>
  <h2>Per Email:</h2>
    <li>
        Schreibt uns eine E-Mail an <a id='link' href="mailto:sv@ohg-monheim.eu">sv@ohg-monheim.eu</a>. Wir antworten so schnell wie möglich und stehen euch bei allen Anliegen zur Seite.
    </li>
    <h2>Instagram:</h2>
    <li>
        Besucht uns auf Instagram unter <a id='link' href="https://www.instagram.com/schuelervertretungohg" target="_blank">@schuelervertretungohg</a>. Dort könnt ihr uns direkt Nachrichten schicken oder euch über unsere aktuellen Aktionen informieren.
    </li>
    <h2>Persoenlich:</h2>
    <li>
        Kommt donnerstags in der ersten großen Pause in Raum 022 vorbei. Wir sind persönlich für euch da und nehmen uns Zeit, eure Anliegen zu besprechen.
    </li>
    <h2>SVKasten:</h2>
    <li>
        Klickt auf den <a href="/SV%20Kasten" id="link">SV Kasten</a>, um uns direkt eine Nachricht zu schreiben. Ihr könnt eure Nachricht auch öffentlich machen, damit andere sie sehen, liken oder disliken können.
    </li>
</ul>
<p>
    Egal, auf welchem Weg – wir freuen uns auf eure Nachrichten und sind hier, um euch zu unterstützen!
</p>

  </div>
  
</div>
        </div>
        <div className="left1">
              <div className="foto_con2">
                <img className='iftar' ref={iftar} src="./Test.png" alt="" id='imgsvg12' />
              </div>
        </div>
      </div>
      <div className="BTCON123" id='keineanhungwieichdasnennenmusweilfastallenamengefhultscongennommenwurdenaberichgluabedasdasnochnichtgenommenwurdeodervielleichtschonkeinerweisauserichweilichderbesterprogrammierenallerzeitenbinderallesweistundnursozurinfoalexdubistschlechtinuiunduxdesignundichbinvielbesseraberegalobamawasntthatgood'>
              <button className='treten1'> Verschwindet einfach... Egal
              Klicken sie hier, um uns eine Nachicht zu Schreiben! <img src='./arrowleft.svg' className='arrowleft' />
              </button>

        </div>
      </div>
      <div className="teil2">
        <div className="title_teil1" id='skondone' ref={title2}>
          <h3>
            Wie kann man der <div className='highvs2'>SV</div> beitreten?
          </h3>
        </div>
        <div className="fototeil">
        <img src='./favicon2.ico' className='SVetwas2' ref={logo} />
        </div>
        <div className="innencon">
            <div className="teilr">
            <img className='iftar' ref={iftar} src="./Iftar.jpg" alt="" />

            </div>
            <div className="teill">
              <div className="sv_info2" ref={info2}>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.


              </div>
            </div>
        </div>
      </div>
            
      <div className="line1"></div>
      <div className="ic1">
        <FontAwesomeIcon icon={faCalendarDays} className='calendar'/>
      </div>
      <AboutUs />
    </div>
  );
}


/* FUR INSTAGRAMM POSTS IN DER WEBSITE
interface InstagramPostProps {
  src: string;
  caption?: string;
  width?: number;
  height?: number;
}

export const InstagramPost: React.FC<InstagramPostProps> = ({ src, caption, width = 500, height = 500 }) => {
  return (
    <div style={{ width, height }}>
      <iframe
        src={src}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        allowTransparency="true"
      />
      {caption && <div dangerouslySetInnerHTML={{ __html: caption }} />}
    </div>
  );
};
*/
function SVBeitreten() {
  return (
    <>
    Hallo sv beitreten?
    </>
  )
}

function AboutUs() {
  return (
    <div className='ÜberUns'>
        
    <div className='UInfos'>
    <a href='https://www.instagram.com/schuelervertretungohg/' style={{cursor: "pointer"}} >
      <FontAwesomeIcon icon={faInstagram} className='InstaIcon'/> Folge uns auf Instagram!
    </a>  
    <br />
      <div className="UInfo1">Website made by <a href='https://github.com/marcodoro'>@Marcodori</a> and <a href='https://github.com/AlexDerAndros'>@AlexandrosNtrikos</a></div><br />
      <a href="https://ohg.monheim.de/">OHG Monheim Website</a>
      <br/>
      <a href='https://github.com/AlexDerAndros/SVOHG'> <FontAwesomeIcon icon={faGithub} className='InstaIcon'/> Link zu GitHub </a>
    </div>
    
  </div>  
  );
}
function Search() {
  const [startseite, setStartseite] = useState(false);
  const [login, setLogin] = useState(false);
  const [svKasten, setSvKasten] = useState(false);
  const [ Anmeldeformular, setAnmeldeformular] = useState(false);
  const pressStartseite = () => {
    setStartseite(!startseite);
  }
  const pressLogin = () => {
    setLogin(!login);
  }
  const pressSVKasten = () => {
    setSvKasten(!svKasten);
  }
  const pressAnmeldeformular = () => {
    setAnmeldeformular(!Anmeldeformular);
  }
  const [value, setValue] = useState('');
  const [list, setList] = useState([
    { theme: 'Startseite', link: '/', index: 1, press: pressStartseite},
    { theme: 'Events', link: '/Anmeldeformular', index: 2, press: pressAnmeldeformular},
    { theme: 'Login', link: '/Login', index: 3, press: pressLogin },
    { theme: 'SV Kasten', link: '/SV Kasten', index: 4, press: pressSVKasten }
  ]);
  const [filteredItems, setFilteredItems] = useState(list);

 
  const handleFilter = (filterTerm: string) => {
    const filteredItems = list.filter(item => item.theme.toLowerCase().includes(filterTerm.toLowerCase()));
    setFilteredItems(filteredItems);
    setValue(filterTerm);
  };

  return (
   <div> 
    {startseite ? (
      <div>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressStartseite} className='arrowBack'  style={{color: "black"}}/>
        <Startseite/>
      </div>
    ): svKasten ?(
      <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressSVKasten} className='arrowBack'  style={{color: "black"}}/>
        <SVKasten1/>
      </>
    ) : login ? (
      <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressLogin} className='arrowBack'  style={{color: "black"}}/>
        <Login1/>
      </>
    ): Anmeldeformular ?(
       <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressAnmeldeformular} className='arrowBack' style={{color: "black"}}/>
        <Anmeldeformularr/>
       </>
    ) :(
      <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
        <div className="main_search">
        <div className="searchBar">
          <img src='./search.svg' alt='' className='lupesvg' />
          <input type="text" className='search' id='123ad' placeholder="Suche..." value={value} onChange={(e) => handleFilter(e.target.value)}/>
         </div>
         <ul className='searchItems'>
         {filteredItems.map(item =>(
           <li key={item.index} className='searchItem' onClick={item.press} >
            <div className="centerli">
            <div className="containerli" style={{background: ' #00052c'}}>
                {item.theme}
            </div>
            </div>
           </li>
         ))}
        </ul>
       </div>
       <AboutUs/>
      </>
    )}
    </div>
   
  );

}
function Login() {
  return (
   <>
     <Login1/>
     <AboutUs/>
   </>
  );
}
function Anmeldeformularr() {
  return (
   <>
     <Anmeldeformular1/>
       <AboutUs/>
   </>
  );
}
function SVKasten() {
  return (
   <>
     <SVKasten1/>
     <AboutUs/>
   </>
  );
}