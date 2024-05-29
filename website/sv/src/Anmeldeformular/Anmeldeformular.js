import "./Anmeldeformular.css";
import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { auth, db } from "../firebase"; // import Firestore db
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore"; // import Firestore functions

export default function Anmeldeformular() {
  const [verfügbar, setVerfügbar] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date ? data.date.toDate().toString() : "No Date Available", // Convert Firestore Timestamp to date string
            time: data.time || "No Time Available",
            topic: data.topic || "No Topic Available"
          };
        });

        if (eventsList.length > 0) {
          setVerfügbar(true);
          setEvents(eventsList);
        } else {
          setVerfügbar(false);
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="anmeldeformular">
      {verfügbar ? (
        <>
          <h2>Events sind verfügbar:</h2>
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <p>Date: {event.date}</p>
                <p>Time: {event.time}</p>
                <p>Topic: {event.topic}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <NichtsVerfügbar />
      )}
    </div>
  );
}

function NichtsVerfügbar() {
  return (
    <div className="nichtsVerfügbar">
      Momentan steht keine Wahl für ein Event zur Verfügung.
    </div>
  );
}
