import React, { useState } from 'react';
import './App.css';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHouse, faMagnifyingGlass, faTimes, faRightToBracket, faPenToSquare, faArrowUpFromBracket} from '@fortawesome/free-solid-svg-icons';
import SVKasten1 from './SVKasten/SVKasten';
import Anmeldeformular1 from './Anmeldeformular/Anmeldeformular';
import Login1 from './Login/Login';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';




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
      <div className='content' style={{ height: click ? '50%' : '0%' }}>
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
      <header>
        
        <div className='title'>
          SV Otto-Hahn-Gymnasium
        </div>
         <FontAwesomeIcon icon={faBars}  onClick={press} className ="hamburger-menu"/>
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
        <Link to='/'>   
         <FontAwesomeIcon icon={faHouse} className='house_icon' onClick={pressStartseite} />
        </Link> 
        <Link to = '/login'>
         <FontAwesomeIcon icon={faRightToBracket} className='house_icon' onClick={pressLogin}/>
        </Link> 
        <Link to='/Search'>
         <FontAwesomeIcon icon={faMagnifyingGlass} className='house_icon' onClick ={pressSearch}/>
        </Link> 
        <Link to="/SV Kasten">
         <FontAwesomeIcon icon={faPenToSquare}  className='house_icon' onClick={pressSVKasten} />
         </Link>
         <Link to="/Anmeldeformular">
          <FontAwesomeIcon icon={faArrowUpFromBracket} className='house_icon'/>
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
  return (
    <>
    <div className="all_container">
      
    </div>
    <div className="anfang">
    <div className='img-containerSV'>
      <img src='./SV.jpg' className='imgSV' alt='Foto'/>
    </div>
    <br/>
    <br/>
    <div className='text_container'>
      <div className="hallo">
        Hallo!
      </div>
      <div className="text_1">
       Wir sind die SV für das Otto-Hahn-Gymnasium.
      </div>


    </div>
    </div>
<div className="what_de_sv">
  <div className="container">


      <div className='headContainer'>
        Was ist die SV?
      </div>
      <div className='text'>
       Der Begriff SV bedeutet Schülervertretung. 
       Wir vertreten die Interessen und Probleme der Schüler*innen bei Lehrer*innen, damit die Schule für alle ein besserer Ort ist und jeder sich wohlfühlen kann.

      </div>
  </div>
</div>

<div className="wofur">

    <div className='container'>
      <div className='headContainer'>
        Wofür ist die SV da?
      </div>
      <div className='text'>
      Die SV kümmert sich beispielsweise darum, dass die Wünsche der Schüler*innen auf dem Otto-Hahn-Gymnasium so gut es geht umgesetzt werden. Außerdem organisiert die SV auch einige spaßige und lustige Events für euch wie zum Beispiel eine Schülerdisko oder den Talentwettbewerb.

      </div>
    </div>
</div>

<AboutUs/>



   
    </>
  );
}
function AboutUs() {
  return (
    <div className='ÜberUns'>
        
    <div className='UInfos'>
      <div className="UInfo1">Impressum</div>
    </div>
  </div>  
  );
}
function Search() {
  return (
   <div>
     Search
     <AboutUs/>
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
