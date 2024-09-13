import React, { useState, useEffect, useRef } from 'react';
import './SVKasten.css';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Cookies from 'js-cookie';
import { gsap } from 'gsap';

export default function SVKasten() {
  
  const likeCooldown = useRef(false);
  const dislikeCooldown = useRef(false);
  const [text, setText] = useState(''); 
  const [isPublic, setIsPublic] = useState(false); 
  const [messages, setMessages] = useState([]); 
  let [isAdminOrDeveloper, setIsAdminOrDeveloper] = useState(false); 
  const [userLikes, setUserLikes] = useState({}); // Store user's like/dislike state
  const auth = getAuth(); 

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const fetchedMessages = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMessages(fetchedMessages.filter(message => message.isPublic));
  
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        await fetchUserLikes(userId, fetchedMessages.map(msg => msg.id));
        await checkUserRoles(userId);
      }
    };
  
    const checkUserRoles = async (userId) => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const isAdmin = data.isAdmin || false;
        const isDeveloper = data.isDeveloper || false;
        setIsAdminOrDeveloper(isAdmin || isDeveloper);
      } else {
        setIsAdminOrDeveloper(false);
      }
    };
  
    fetchMessages();
  }, [auth.currentUser]);
  const fetchUserLikes = async (userId, messageIds) => {
    const likesSnapshot = await getDocs(collection(db, 'likes'));
    const dislikesSnapshot = await getDocs(collection(db, 'dislikes'));
    
    let likesData = {};
    
    likesSnapshot.forEach((doc) => {
      const { userId: likeUserId, messageId } = doc.data();
      if (messageIds.includes(messageId) && likeUserId === userId) {
        likesData[messageId] = 'liked';
      }
    });
    
    dislikesSnapshot.forEach((doc) => {
      const { userId: dislikeUserId, messageId } = doc.data();
      if (messageIds.includes(messageId) && dislikeUserId === userId) {
        likesData[messageId] = 'disliked';
      }
    });

    setUserLikes(likesData);
  };

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
          likes: 0,
          dislikes: 0,
        });
        Cookies.set('message', text, { expires: 7 });

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
        x: -95,
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


  const handleLike = async (messageId) => {
    if (likeCooldown.current) return;
    likeCooldown.current = true; 
    setTimeout(() => likeCooldown.current = false, 500); // Fuktion um die Like sachen zu stoppen weil wenn man zu schneel klickt dann glitch das aus
  
    const userId = auth.currentUser?.uid;
    const likeRef = doc(db, 'likes', `${userId}_${messageId}`);
    const dislikeRef = doc(db, 'dislikes', `${userId}_${messageId}`); 

    if (userId) {
      const likeDoc = await getDoc(likeRef);
      const dislikeDoc = await getDoc(dislikeRef);
      const messageRef = doc(db, 'messages', messageId);
      const message = messages.find(msg => msg.id === messageId);
      
      if (likeDoc.exists()) {
        await updateDoc(messageRef, { likes: message.likes - 1 });
        await deleteDoc(likeRef);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, likes: msg.likes - 1 }
              : msg
          )
        );
      } else {
        if (dislikeDoc.exists()) {
          await updateDoc(messageRef, { dislikes: message.dislikes - 1 });
          await deleteDoc(dislikeRef);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId
                ? { ...msg, dislikes: msg.dislikes - 1 }
                : msg
            )
          );
        }
        await updateDoc(messageRef, { likes: message.likes + 1 });
        await setDoc(likeRef, { userId, messageId });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, likes: msg.likes + 1 }
              : msg
          )
        );
      }
  
      gsap.to(`#like-${messageId}`, { 
        scale: 1.2, 
        duration: 0.2, 
        ease: 'power1.out',
        onComplete: () => {
          document.querySelector(`#like-${messageId}`).src = likeDoc.exists() ? './not_liked2.png' : './like.png';
          document.querySelector(`#dislike-${messageId}`).src = './Not_liked.png';
          gsap.to(`#like-${messageId}`, { scale: 1, duration: 0.2 });
        }
      });
    }
  };

  const handleDislike = async (messageId) => {
    if (dislikeCooldown.current) return;
    dislikeCooldown.current = true; 
    setTimeout(() => dislikeCooldown.current = false, 500); // Selbe sache wie oben
  
    const userId = auth.currentUser?.uid;
    const dislikeRef = doc(db, 'dislikes', `${userId}_${messageId}`);
    const likeRef = doc(db, 'likes', `${userId}_${messageId}`);

    if (userId) {
      const dislikeDoc = await getDoc(dislikeRef);
      const likeDoc = await getDoc(likeRef);
      const messageRef = doc(db, 'messages', messageId);
      const message = messages.find(msg => msg.id === messageId);

      if (dislikeDoc.exists()) {
        await updateDoc(messageRef, { dislikes: message.dislikes - 1 });
        await deleteDoc(dislikeRef);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, dislikes: msg.dislikes - 1 }
              : msg
          )
        );
      } else {
        if (likeDoc.exists()) {
          await updateDoc(messageRef, { likes: message.likes - 1 });
          await deleteDoc(likeRef);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId
                ? { ...msg, likes: msg.likes - 1 }
                : msg
            )
          );
        }
        await updateDoc(messageRef, { dislikes: message.dislikes + 1 });
        await setDoc(dislikeRef, { userId, messageId });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, dislikes: msg.dislikes + 1 }
              : msg
          )
        );
      }

      gsap.to(`#dislike-${messageId}`, { 
        scale: 1.2, 
        duration: 0.2, 
        ease: 'power1.out',
        onComplete: () => {
          document.querySelector(`#dislike-${messageId}`).src = dislikeDoc.exists() ? './Not_liked.png' : './dislike.png';
          document.querySelector(`#like-${messageId}`).src = './not_liked2.png';
          gsap.to(`#dislike-${messageId}`, { scale: 1, duration: 0.2 });
        }
      });
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
          <div className="head"><div className='highvs2'>SV</div>&nbsp; Kasten</div>
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
            <button className="button-36" role="button" onClick={handleClick}>Senden</button>
            <img src={`${process.env.PUBLIC_URL}/Paper.png`} alt='Paper Plane' className='plane' />
          </div>
  
          <div className="oeffentlich_nach">
            <div className='title_svkasten_123adg'>
              Nachichten Keine ahnung
            </div>
            {messages
              .sort((a, b) => b.likes - a.likes)
              .map((message) => (
                <div key={message.id} className="message1234">
                  <p>{message.text}</p>
                  <div className='likecon'>
                    <button className='btslike' onClick={() => handleLike(message.id)}>
                      <img id={`like-${message.id}`} src={userLikes[message.id] === 'liked' ? './like.png' : './not_liked2.png'} className='like2' alt='Like'/> {message.likes}
                    </button>
                    <button className='btslike' onClick={() => handleDislike(message.id)}>
                      <img id={`dislike-${message.id}`} src={userLikes[message.id] === 'disliked' ? './dislike.png' : './Not_liked.png'} className='dislike' alt='Dislike'/> {message.dislikes || 0}
                    </button>
                    {console.log("isAdminOrDeveloper:", isAdminOrDeveloper)} 
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
