import "./SVKasten.css";


export default function SVKasten() {
   return (
     <>
     <div className="main">
    
       <div className="head">
         SV Kasten 
       </div>
       <div className="textCon">
          <div className="text">
            Wilkommen beim SV Kasten! Hier könnt ihr eure Wünsche, Beschwerden und so weiter
            bei uns einrreichen, damit wir diese dann, wenn es möglich ist, zu erfüllen, um die Schule zu 
            einem besseren Ort zu machen.
          </div>
       </div>
       <input type="text" placeholder="Was wollt ihr uns mitteilen?" className="inSVKasten"/>
       <br/>
       <button className="btnSVKasten">
         Senden
       </button>
      
     </div>
     </>
   );
}
