import "./SVKasten.css";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  runTransaction,
  increment,
  setDoc,
  deleteDoc
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import {db, auth} from '../config/firebase';

export default function SVKasten1() {
  const likeCooldown = useRef(false);
  const dislikeCooldown = useRef(false);

  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState({}); // { messageId: 1 | -1 }

  // ==============================
  // 🔥 AUTH INITIALISIEREN (Anonymous)
  // ==============================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }
    });
    return () => unsub();
  }, []);

  // ==============================
  // 🔥 LIVE MESSAGES + USER VOTES
  // ==============================
  useEffect(() => {
    // Nachrichten immer laden
    const messagesUnsub = onSnapshot(
      collection(db, "messages"),
      (snap) => {
        const msgs = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(msgs.filter((msg) => msg.isPublic));
      }
    );

    // Votes erst laden, wenn User existiert
    let votesUnsub = () => {};

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const userId = user.uid;

      votesUnsub = onSnapshot(
        collection(db, "votes"),
        (snap) => {
          const map = {};
          snap.forEach((doc) => {
            const { messageId, value, userId: uid } = doc.data();
            if (uid === userId) {
              map[messageId] = value;
            }
          });
          setVotes(map);
        }
      );
    });

    return () => {
      messagesUnsub();
      votesUnsub();
      authUnsub();
    };
  }, []);

  // ==============================
  // ✉️ SEND MESSAGE
  // ==============================
  const handleClick = async () => {
    if (text.trim() === "") {
      gsap.to(".button-36", {
        x: -95,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
        onComplete: () => gsap.set(".button-36", { x: 0 }),
      });
      return;
    }

    await addDoc(collection(db, "messages"), {
      text,
      timestamp: new Date(),
      isPublic,
      likes: 0,
      dislikes: 0,
    });

    // Animation
    gsap.to(".button-36", {
      opacity: 0,
      duration: 2,
      fontSize: "8px",
      width: "3rem",
      height: "1.5rem",
      padding: "0.5rem",
      ease: "power1.in",
      onComplete: () => {
        gsap.to(".button-36", {
          opacity: 1,
          fontSize: "16px",
          width: "12rem",
          height: "3rem",
          padding: "0",
          clearProps: "all",
          delay: 1,
        });
      },
    });

    gsap.to(".plane", {
      y: "-500px",
      x: "70vw",
      duration: 2,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(".plane", {
          opacity: 0,
          duration: 0,
          onComplete: () => {
            gsap.set(".plane", {
              y: "130px",
              x: "0px",
              rotate: "10deg",
              opacity: 2,
            });
          },
          delay: 1.5,
        });
      },
    });

    setText("");
  };

  // ==============================
  // ❤️ LIKE
  // ==============================
  const handleLike = async (messageId) => {
    if (likeCooldown.current) return;
    likeCooldown.current = true;
    setTimeout(() => (likeCooldown.current = false), 500);

    const userId = auth.currentUser.uid;

    const voteRef = doc(db, "votes", `${userId}_${messageId}`);
    const messageRef = doc(db, "messages", messageId);

    await runTransaction(db, async (tx) => {
      const voteDoc = await tx.get(voteRef);

      if (!voteDoc.exists()) {
        tx.set(voteRef, { userId, messageId, value: 1 });
        tx.update(messageRef, { likes: increment(1) });
        return;
      }

      const val = voteDoc.data().value;

      if (val === 1) {
        tx.delete(voteRef);
        tx.update(messageRef, { likes: increment(-1) });
      } else if (val === -1) {
        tx.update(voteRef, { value: 1 });
        tx.update(messageRef, {
          likes: increment(1),
          dislikes: increment(-1),
        });
      }
    });

    gsap.to(`#like-${messageId}`, {
      scale: 1.2,
      duration: 0.2,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(`#like-${messageId}`, { scale: 1, duration: 0.2 });
      },
    });
  };

  // ==============================
  // 💔 DISLIKE
  // ==============================
  const handleDislike = async (messageId) => {
    if (dislikeCooldown.current) return;
    dislikeCooldown.current = true;
    setTimeout(() => (dislikeCooldown.current = false), 500);

    const userId = auth.currentUser.uid;

    const voteRef = doc(db, "votes", `${userId}_${messageId}`);
    const messageRef = doc(db, "messages", messageId);

    await runTransaction(db, async (tx) => {
      const voteDoc = await tx.get(voteRef);

      if (!voteDoc.exists()) {
        tx.set(voteRef, { userId, messageId, value: -1 });
        tx.update(messageRef, { dislikes: increment(1) });
        return;
      }

      const val = voteDoc.data().value;

      if (val === -1) {
        tx.delete(voteRef);
        tx.update(messageRef, { dislikes: increment(-1) });
      } else if (val === 1) {
        tx.update(voteRef, { value: -1 });
        tx.update(messageRef, {
          dislikes: increment(1),
          likes: increment(-1),
        });
      }
    });

    gsap.to(`#dislike-${messageId}`, {
      scale: 1.2,
      duration: 0.2,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(`#dislike-${messageId}`, { scale: 1, duration: 0.2 });
      },
    });
  };

  return (
   <>
  <div className="main_kasten">
    <div className="center">
      <br />
      <br />
      <br />

      <div className="head">
        <div className='highvs2'>SV</div>&nbsp; Kasten
      </div>

      <div className="neinene"></div>

      <div className="kasten">
        <div className="texte">
          <div className="text2">
            Wilkommen beim SV Kasten! Hier könnt ihr uns eure Wünsche und Beschwerden schicken, 
            damit wir diese dann bestmöglich erfüllen können, um die Schule zu einem besseren Ort 
            zu machen. Natürlich ist das ganze Anonym.
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
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div>
          <label className='oeffentlich'>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <p>Veröffentlichen</p>
          </label>
        </div>

        <div className='gap123'></div>

        <button className="button-36" role="button" onClick={handleClick}>
          Senden
        </button>

        <img src={`Paper.png`} alt='Paper Plane' className='plane' />
      </div>

      <div 
        style={{fontFamily:"Poppins"}} 
        className='text-black text-3xl w-full flex justify-center items-center mt-50 mb-[-12%]'
      >
        Nachrichten
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-[40px] text-white font-roboto">
        {messages
          .sort((a, b) => b.likes - a.likes)
          .map((message) => (
            <div key={message.id} className="message1234">
              <p>{message.text}</p>

              <div className='likecon'>
                
                {/* ❤️ LIKE BUTTON */}
                <button className='btslike' onClick={() => handleLike(message.id)}>
                  <img 
                    id={`like-${message.id}`} 
                    src={votes[message.id] === 1 ? './like.png' : './not_liked2.png'} 
                    className='like2' 
                    alt='Like'
                  /> 
                  {message.likes}
                </button>

                {/* 💔 DISLIKE BUTTON */}
                <button className='btslike' onClick={() => handleDislike(message.id)}>
                  <img 
                    id={`dislike-${message.id}`} 
                    src={votes[message.id] === -1 ? './dislike.png' : './Not_liked.png'} 
                    className='dislike' 
                    alt='Dislike'
                  /> 
                  {message.dislikes || 0}
                </button>

              </div>
            </div>
          ))}
      </div>

    </div>
  </div>
</>

  );
}
