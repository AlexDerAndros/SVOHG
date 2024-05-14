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
          Wilkommen beim SV Kasten! Hier könnt ihr uns eure Wünsche und Beschwerden schicken, damit wir diese dann bestmöglich erfüllen können, um die Schule zu einem besseren Ort zu machen. Natürlich ist das ganze Anonym.
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
