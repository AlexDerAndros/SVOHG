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
import { auth, db } from "./firebase"; // import Firestore db
import 'firebase/analytics';
import { doc, updateDoc } from "firebase/firestore";

import { getDoc, setDoc, collection, getDocs, getFirestore , Timestamp} from "firebase/firestore"; // import Firestore functions

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



interface Event {
    date: string;
    time: string;
    topic?: string;
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

  
  const pressSearch = () => {
    setSearch(true);
    setSvKasten(false);
    setLogin(false);
    setStartseite(false);
  }
  const pressStartseite = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(false);
    setStartseite(true);
  }
  const pressLogin = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(true);
    setStartseite(false);
  }
  const pressSVKasten = () => {
    setSearch(false);
    setSvKasten(true);
    setLogin(false);
    setStartseite(false);
  }
  const pressAnmeldeformular = () => {
    setSearch(false);
    setSvKasten(false);
    setLogin(false);
    setStartseite(false);
    setAnmeldeformular(true);
  }
  const [click, setClick] = useState(false);
  const [value, setValue] = useState('');
  const [list, setList] = useState([
    { theme: 'Startseite', link: '/', index: 1 },
    { theme: 'Anmeldeformular für die SV', link: '/Anmeldeformular', index: 2 },
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

  return (
    <>
    <BrowserRouter>
      <div className='content'>
        {click && (
          <>
            <div className='Hambuger-Elemente'>
              <div onClick={press}>
                <FontAwesomeIcon icon={faTimes} size='2x' className='hamburger-menu' />
              </div>
              <div className='inSp'>
                <input type='text'
                 value={value}
                 onChange={(e) => handleFilter(e.target.value)}
                 placeholder='Suchen...'
                 className='input' />
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
      </div>
      <header style={{ height: click ? '50%' : '10%' }}>
        
        <div className='title'>
          <a href="/">
          SV Otto-Hahn-Gymnasium 
          </a>
        </div>
        <div className="menu">
         <FontAwesomeIcon icon={faBars}  onClick={press} className ="hamburger-menu"/>
        </div>
      </header>
      <div>
        {/* {startseite ? (
          <div>
            <Startseite/>
          </div>
        ) : search ? (
          <div>
            <Search/>
          </div>
        ) : svKasten ? (
          <div>
            <SVKasten1/>
          </div>   
        ): login ? (
          <div>
            <Login1/>
          </div>  
        ) : (
          <div>
            Error
          </div>  
        )} */}
      </div>
        
      <footer>
        <div className='icons_footer' style={{bottom:"0%"}}>
        <Link to='/'className='svasdf'>   
         <FontAwesomeIcon icon={faHouse} className='house_icon' onClick={pressStartseite} />
            <div className='title_footer'>Home</div>
        </Link> 
        <Link to = '/login'className='svasdf'>
         <FontAwesomeIcon icon={faRightToBracket} className='house_icon_2' onClick={pressLogin}/>
         <div className='title_footer'>Login</div>
        </Link> 
        <Link to='/Search'className='svasdf'>
         <FontAwesomeIcon icon={faMagnifyingGlass} className='house_icon_3' onClick ={pressSearch}/>
         <div className='title_footer'>Suche</div>
        </Link> 
        <Link to="/SV Kasten" className='svasdf'>
         <FontAwesomeIcon icon={faPenToSquare}  className='house_icon_4' onClick={pressSVKasten} />
         <div className='title_footer'>Sv Kasten</div>
         </Link>
         <Link to="/Anmeldeformular" className='svasdf'>
          <FontAwesomeIcon icon={faArrowUpFromBracket} className='house_icon_5'/>
         <div className='title_footer'>Events</div>
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
            topic: event.topic 
          }));
  
          setEvents(formattedEvents);
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
      }
  
      fetchEvents();
    }, []);
  
    return (
      <>
        <div className="all_container"></div>
        <div className="anfang">
          <div className='img-containerSV'>
            <img src='./SV.jpg' className='imgSV' alt='Foto' />
          </div>
          <br />
          <br />
          <div className='text_container'>
            <div className="hallo">Hallo!</div>
            <div className="text_1">Wir sind die SV für das Otto-Hahn-Gymnasium.</div>
            <div className="abstand"></div>
            <div className="events">
              <div className="coneven">
                <div className="title_events">Events</div>
              </div>
              {events.map((event, index) => (
                <div className="tabelle" key={index}>
                  <div className="title_tabelle">
                    {event.date}
                  </div>
                  <div className="zeit">
                    <div className='angabezeit'>Zeit: &nbsp;</div>
                    {event.time}
                  </div>
                  <div className="eventname">
                    <div className='angabezeit'>Thema: &nbsp;</div>
                    {event.topic} 
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="neinen"></div>
        <div className="what_de_sv">
          <div className="container">
            <div className='gap_containers_2'></div>
            <div className='headContainer_2'>Was ist die SV?</div>
            <div className='text_2'>
              Der Begriff SV bedeutet Schülervertretung. Wir vertreten die Interessen und Probleme der Schüler*innen bei Lehrer*innen, damit die Schule für alle ein besserer Ort ist und jeder sich wohlfühlen kann.
            </div>
          </div>
        </div>
        <div className="wofur">
          <div className='container'>
            <div className='gap_containers'></div>
            <div className='headContainer'>Wofür ist die SV da?</div>
            <div className='text'>
              Die SV kümmert sich beispielsweise darum, dass die Wünsche der Schüler*innen auf dem Otto-Hahn-Gymnasium so gut es geht umgesetzt werden. Außerdem organisiert die SV auch einige spaßige und lustige Events für euch wie zum Beispiel eine Schülerdisko oder den Talentwettbewerb.
            </div>
          </div>
        </div>
        <div className="wiekontakt">
          <div className="container_33">
            <div className='headContainer'>
              Wie könnt ihr uns kontaktieren?
            </div>
            <div className="text">
              Um uns zu kontaktieren musst ihr nur auf dem SV Kasten unten clicken und dann koennt ihr eure Fragen oder andere Sachen aufschreiben.
            </div>
          </div>
        </div>
        <AboutUs />
      </>
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
    { theme: 'Anmeldeformular für die SV', link: '/Anmeldeformular', index: 2, press: pressAnmeldeformular},
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
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressStartseite} className='arrowBack'/>
        <Startseite/>
      </div>
    ): svKasten ?(
      <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressSVKasten} className='arrowBack'/>
        <SVKasten1/>
      </>
    ) : login ? (
      <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressLogin} className='arrowBack'/>
        <Login1/>
      </>
    ): Anmeldeformular ?(
       <>
        <FontAwesomeIcon icon={faArrowLeft} onClick={pressAnmeldeformular} className='arrowBack'/>
        <Anmeldeformular1/>
       </>
    ) :(
      <>
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