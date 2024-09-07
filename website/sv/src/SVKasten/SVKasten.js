import React, { useState, useEffect } from 'react';
import './SVKasten.css';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { gsap } from 'gsap';

export default function SVKasten() {
  const [text, setText] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAdminOrDeveloper, setIsAdminOrDeveloper] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const fetchedMessages = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMessages(fetchedMessages.filter(message => message.isPublic));
    };

    fetchMessages();
  }, []);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleClick = async () => {  
    if (text.trim() !== '') {
      try {
        await addDoc(collection(db, 'messages'), {
          text: text,
          timestamp: new Date(),
          isPublic: isPublic,
          likes: 0
        });
        Cookies.set('message', text, {expires: 7});

        gsap.to('.button-36', {
          opacity: 0,
          duration: 2,
          fontSize: '8px',
          width: '3rem',
          height: '1.5rem',
          padding: '0.5rem',
          ease: 'power1.in',
          onComplete: () => {
            gsap.to('.button-36', {
              opacity: 1,
              fontSize: '16px',
              width: '12rem',
              height: '3rem',
              padding: '0',
              clearProps: 'all',
              delay: 1,
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
                gsap.set('.plane', {
                  y: '130px',
                  x: '0px',
                  rotate: '10deg',
                  opacity: 2, 
                });
              },
              delay: 1.5,
            });
          }
        });
        setText('');
      } catch (e) {
        console.error('Fehler beim Hinzufügen des Dokuments in die Datenbank: ', e);
        alert('Fehler beim Hinzufügen des Dokuments in die Datenbank', e);
      }
    } else {
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

  const handleLike = async (messageId, currentLikes) => {
    const userId = auth.currentUser?.uid;
  
    if (userId) {
      const likeRef = doc(db, 'likes', `${userId}_${messageId}`);
      const likeDoc = await getDoc(likeRef);
  
      if (likeDoc.exists()) {
        alert('Du hast diese Nachricht bereits geliket.');
        return;
      }
  
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { likes: currentLikes + 1 });
  
      await setDoc(likeRef, { userId, messageId });
  
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, likes: currentLikes + 1 } : msg
        )
      );
    } else {
      alert('Bitte melde dich an, um zu liken.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(messages.filter(message => message.id !== messageId));
    } catch (error) {
      console.error("Fehler beim Löschen der Nachricht: ", error);
      alert("Fehler beim Löschen der Nachricht: " + error.message);
    }
  };

  return (
    <>
      <div className="main_kasten">
        <div className="center">
          <br />
          <br />
          <br />
          <div className="head">SV Kasten</div>
          <div className="neinene"></div>
          <div className="kasten">
            <div className="texte">
              <div className="text2">
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
            <div>
              <label className='oeffentlich'>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <p>
                Öffentlich machen
                </p>
              </label>
            </div>
            <div className='gap123'></div>
            <button className="button-36" role="button" onClick={handleClick}>Senden
              
            </button>
            <img src='./paper.png' alt='Paper Plane' className='plane' />
          </div>
  
          <div className="oeffentlich_nach">
            <div className='title_svkasten_123adg'>
              Nachichten Keine ahnung
            </div>
            {messages
              .sort((a, b) => b.likes - a.likes) // Sortiere nachihten nach wer die meisten likes hat ich habe keine ahnung was diese funktion ist zumgluck gibt es GOOGLE
              .map((message) => (
                <div key={message.id} className="message1234">
                  <p>{message.text}</p>
                  <div className='likecon'>
                    <button className='btslike' onClick={() => handleLike(message.id, message.likes)}>
                      <img src='./like.png' className='like' alt='Like'/> {message.likes}
                    </button>
                    {isAdminOrDeveloper && (
                      <button onClick={() => handleDeleteMessage(message.id)}>Löschen</button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}  