import React, { useState } from 'react';
import './App.css';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SVKasten1 from './SVKasten/SVKasten';
import Anmeldeformular1 from './Anmeldeformular/Anmeldeformular';
import Login1 from './Login/Login';

export default function App() {
  return (
    <main>
      <HeaderBottom />
    </main> 
  );
}

function HeaderBottom() {
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
        <div className="hamburger-menu" onClick={press}>
          <FontAwesomeIcon icon={faBars} size='2x' />
        </div>
        <div className='title'>
          SV Otto-Hahn-Gymnasium
        </div>
      </header>
       <br/>
      <br/>
      <br/>
      
      <Routes>
        <Route path='/' element={<Startseite />} />
        <Route path='/Login' element={<Login1 />} />
        <Route path='/Anmeldeformular' element={<Anmeldeformular1 />} />
        <Route path='/SV Kasten' element={<SVKasten1 />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

function Startseite() {
  return (
    <>
    <div className='img-containerSV'>
      <img src='./SV.jpg' className='imgSV'/>
    </div>
    <br/>
    <br/>
    <div className='text-container'>
      Hallo! Wir sind die SV für das Otto-Hahn-Gymnasium.
    </div> 
    <div className='container' style={{marginTop:"15%", borderTop:"solid 2px rgb(222, 222, 222)"}}>
      <div className='headContainer'>
        Was ist die SV?
      </div>
      <div className='text'>
        Der Begriff SV bedeutet Schülervertretung. Wir vertreten die Interessen der 
        Schüler*innen bei Lehrer*innen, damit die Schule für alle ein besserer Ort ist.
      </div>
    </div>
    <div className='container'>
      <div className='headContainer'>
        Wofür ist die SV da?
      </div>
      <div className='text'>
        Die SV kümmert sich beispielsweise darum, dass die Wünsche der Schüler*innen auf dem Otto-Hahn-Gymnasium 
        so gut es geht umgesetzt werden
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