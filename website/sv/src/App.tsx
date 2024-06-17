import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faMagnifyingGlass, faTimes, faRightToBracket, faPenToSquare, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SVKasten1 from './SVKasten/SVKasten';
import Anmeldeformular1 from './Anmeldeformular/Anmeldeformular';
import Login1 from './Login/Login';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { auth, db } from "./config/firebase"; // import Firestore db
import 'firebase/analytics';
import { doc, updateDoc } from "firebase/firestore";

import { getDoc, setDoc, collection, getDocs, getFirestore , Timestamp} from "firebase/firestore"; // import Firestore functions

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



interface Event {
    date: string;
    time: string;
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
            <div  style={{ color: isFocusedS ? "rgb(127, 163, 231)" : 'white',  transform: isFocusedS ? " scale(1.25)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Home</div>
        </Link> 
        <Link to = '/login'className='svasdf' onClick={pressLogin}>
         <FontAwesomeIcon icon={faRightToBracket} style={{ color: isFocusedL ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_2' onClick={pressLogin}/>
         <div style={{ color: isFocusedL ? "rgb(127, 163, 231)" : 'white',  transform: isFocusedL ? " scale(1.25)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Login</div>
        </Link> 
        <Link to='/Search'className='svasdf' onClick={pressSearch}>
         <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: isFocusedSEA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_3' onClick ={pressSearch}/>
         <div  style={{ color: isFocusedSEA ? "rgb(127, 163, 231)" : 'white',  transform: isFocusedSEA ? " scale(1.25)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Suche</div>
        </Link> 
        <Link to="/SV Kasten" className='svasdf'  onClick={pressSVKasten}>
         <FontAwesomeIcon icon={faPenToSquare} style={{ color: isFocusedSVK ? "rgb(127, 163, 231)" : 'white'}}  className='house_icon_4' />
         <div  style={{ color: isFocusedSVK ? "rgb(127, 163, 231)" : 'white' ,  transform: isFocusedSVK ? " scale(1.25)" : "scale(1)", transition:"ease-in-out 0.3s"}}>SV Kasten</div>
         </Link>
         <Link to="/Anmeldeformular" className='svasdf' onClick={pressAnmeldeformular}>
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: isFocusedSA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_5' onClick={pressAnmeldeformular}/>
         <div style={{ color: isFocusedSA ? "rgb(127, 163, 231)" : 'white' ,  transform: isFocusedSA ? " scale(1.25)" : "scale(1)", transition:"ease-in-out 0.3s"}}>Events</div>
         </Link>
        </div>
      </header>
      <div>
        
      </div>
        
      <footer>
        <div className='icons_footer ' >
        <Link to='/' className='svasdf' onClick={pressStartseite}>   
         <FontAwesomeIcon icon={faHouse} className='house_icon'  id='first' style={{ color: isFocusedS ? "rgb(127, 163, 231)" : 'white'}} />
            <div className='title_footer' style={{ color: isFocusedS ? "rgb(127, 163, 231)" : 'white', transform:"scale(1.1)", }}>Home</div>
        </Link> 
        <Link to = '/login'className='svasdf'  onClick={pressLogin}>
         <FontAwesomeIcon icon={faRightToBracket} style={{ color: isFocusedL ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_2'/>
         <div className='title_footer' style={{ color: isFocusedL ? "rgb(127, 163, 231)" : 'white'}}>Login</div>
        </Link> 
        <Link to='/Search'className='svasdf' onClick ={pressSearch} >
         <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: isFocusedSEA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_3' />
         <div className='title_footer' style={{ color: isFocusedSEA ? "rgb(127, 163, 231)" : 'white'}}>Suche</div>
        </Link> 
        <Link onClick={pressSVKasten} to="/SV Kasten" className='svasdf'  >
         <FontAwesomeIcon icon={faPenToSquare} style={{ color: isFocusedSVK ? "rgb(127, 163, 231)" : 'white'}}  className='house_icon_4' />
         <div className='title_footer' style={{ color: isFocusedSVK ? "rgb(127, 163, 231)" : 'white'}}>SV Kasten</div>
         </Link>
         <Link onClick={pressAnmeldeformular} to="/Anmeldeformular" className='svasdf' >
          <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ color: isFocusedSA ? "rgb(127, 163, 231)" : 'white'}} className='house_icon_5' />
         <div className='title_footer'  style={{ color: isFocusedSA ? "rgb(127, 163, 231)" : 'white'}}>Events</div>
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
      </Routes>
      </BrowserRouter>
    </>
  );
}

function Startseite() {

    const [events, setEvents] = useState<Event[]>([]);
  
    useEffect(() => {
      async function fetchEvents() {
        try {
          const eventsCol = collection(db, 'events');
          const eventSnapshot = await getDocs(eventsCol);
          const eventList = eventSnapshot.docs.map(doc => doc.data());
          const formattedEvents: Event[] = eventList.map(event => ({
            ...event,
            date: event.date instanceof Timestamp ? event.date.toDate().toLocaleDateString() : event.date,
            time: event.time,
            topic: event.topic,
            shortDescription: event.shortDescription
          }));
  
          setEvents(formattedEvents);
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
      }
  
      fetchEvents();
    }, []);
  
    return (
  <div style={{background: "rgba(250, 255, 238, 0.993)"}}>
        <div className="all_container"></div>
        <div className="anfang">
          <div className='img-containerSV'>
            <img src='./SV.jpg' className='imgSV' alt='Foto' />
          </div>
          <br />
          <br />
        <div style={{display:"flex", justifyContent:"center", alignItems: "center"}}>
          <div className='text_container'>
            <div className="hallo">Hallo!</div>
            <div className="text_1">Wir sind die SV für das Otto-Hahn-Gymnasium.</div>
            <div className="abstand"></div>
            <div className="events" style={{width:"80%"}}>
              <div className="coneven">
                <div className="title_events"> Aktuelles Event</div>
              </div>
              {events.map((event, index) => (
                <div className="tabelle" key={index}>
                  <div className="zeit">
                  <div className='angabezeit'>Datum: &nbsp;</div>{event.date}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Zeit: &nbsp;</div>
                    {event.time}
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Thema: &nbsp;</div><br/>
                    {event.topic} 
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Kurze Beschreibung: &nbsp;</div><br/>
                    {event.shortDescription} 
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>  
        <div className="neinen"></div>
      {/* <div className='conPos'> */}
        <div className="what_de_sv">
          <div className="container">
            <div className='gap_containers_2'></div> 
            <div className='headContainer_2'>Was ist die SV?</div>
            <div className='text_2'>
              Der Begriff SV bedeutet Schülervertretung. Wir vertreten die Interessen und Probleme der Schüler*innen bei Lehrer*innen, damit die Schule für alle ein besserer Ort ist und jeder sich wohlfühlen kann.
            </div>
          </div>
        {/* </div> */}
        </div>  
        <br />
        <br />
        <br />
      {/* <div className='center'> */}
        <div className="wofur">
          <div className='container2'>
            <div className='headContainer'>Wofür ist die SV da?</div>
            <div className='text'>
              Die SV kümmert sich beispielsweise darum, dass die Wünsche der Schüler*innen auf dem Otto-Hahn-Gymnasium so gut es geht umgesetzt werden. Außerdem organisiert die SV auch einige spaßige und lustige Events für euch wie zum Beispiel eine Schülerdisko oder den Talentwettbewerb.
            </div>
          </div>
        {/* </div> */}
      </div>    
        <br />
        <br />
        <br />
       {/* <div className='center'> */}
        <div className="wiekontakt">
          <div className="container_33">
            <div className='headContainer'>
              Wie könnt ihr uns kontaktieren?
            </div>
            <div className="text_23">
              Um uns zu kontaktieren musst ihr nur auf dem SV Kasten unten clicken und dann koennt ihr eure Fragen oder andere Sachen aufschreiben.
            </div>
          {/* </div> */}
        </div>  
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

function AboutUs() {
  return (
    <div className='ÜberUns'>
        
    <div className='UInfos'>
    <a href='https://www.instagram.com/schuelervertretungohg/' style={{cursor: "pointer"}} >
      <FontAwesomeIcon icon={faInstagram} className='InstaIcon'/> Folge uns auf Instagram!
    </a>  
    <br />
      <div className="UInfo1">Website made by <a href='https://github.com/marcodoro'>@Marcodori</a> and <a href='https://github.com/AlexDerAndros'>@AlexandrosNtrikos</a></div>
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
          <input type="text" className='search' placeholder="Suche..." value={value} onChange={(e) => handleFilter(e.target.value)}/>
         </div>
         <ul className='searchItems'>
         {filteredItems.map(item =>(
           <li key={item.index} className='searchItem' onClick={item.press}>
            {item.theme}
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