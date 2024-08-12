import React, { useState, useEffect } from 'react';
import './SVKasten.css';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import Cookies from 'js-cookie';
import { gsap } from 'gsap';
import plane from './Paper.png';

export default function SVKasten() {
  const [text, setText] = useState('');

  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        // Signed ie
      })
      .catch((error) => {
        console.error("Authentication error:", error);
      });
  }, []);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleClick = async () => {  

    if (text.trim() !== '') {
      try {
        await addDoc(collection(db, 'messages'), {
          text: text,
          timestamp: new Date()
        });
        Cookies.set('message', text, {expires: 7});
        gsap.to('.button-36', {
          opacity: 0,
          duration: 2,
          fontSize: '8px',   // Make the font smaller proportionally
          width: '3rem',     // Adjust the width to be smaller
          height: '1.5rem',  // Adjust the height to be smaller
          padding: '0.5rem', // Adjust padding to maintain proportions
          ease: 'power1.in',
          onComplete: () => {
            // Reset button styles after animation
            gsap.to('.button-36', {
              opacity: 1,
              fontSize: '16px',
              width: '12rem',
              height: '3rem',
              padding: '0',     // Reset padding
              clearProps: 'all', // Clear inline styles to return to original
              delay: 1, // Add a slight delay before resetting
            });
          }
        });
    
        gsap.to('.plane', {
          y: '-500px',
          x: '70vw',
          duration: 2,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to('.plane', {
              opacity: 0,
              duration: 0,
              onComplete: () => {
                // Reset the plane's position and then make it visible again
                gsap.set('.plane', {
                  y: '80px',
                  x: '0px',
                  rotate: '10deg',  // Reset the rotation
                  opacity: 2, 
                 });
              },
              delay: 1.5,
            });
          }
        });
        setText('');
      } catch (e) {
        console.error('Error adding document to the Database: ', e);
        alert('Error adding document to the database', e)
       }
    }
    else {
      gsap.to('.button-36', {
        x: -25,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set('.button-36', { x: 0 }); 
        },
      });
    }
  };


  return (
    <>
      <div className="main_kasten">
        <div className="center">
          <br />
          <br />
          <br />
          <div className="head">
            SV Kasten 
          </div>
          <div className="neinene"></div>
          <div className="kasten">
            <div className="texte">
              <div className="text">
                Wilkommen beim SV Kasten! Hier könnt ihr uns eure Wünsche und Beschwerden schicken, damit wir diese dann bestmöglich erfüllen können, um die Schule zu einem besseren Ort zu machen. Natürlich ist das ganze Anonym.
              </div>
            </div>
          </div>
          <div className='gap123'></div>
          <div className="kasten_schreiben">
            <div className="input">
              <input 
                type="text" 
                placeholder="Was wollen sie uns mitteilen?"
                className="input_real"
                value={text}
                onChange={handleChange}
              />
            </div>
            <div className='gap123'></div>
            <button className="button-36" role="button" onClick={handleClick}>Senden</button>
            <img src={plane} alt='Paper Plane' className='plane' />
          </div>
        </div>
      </div>
    </>
  );
}
