import "./Anmeldeformular.css";
import { useState } from "react";

export default function Anmeldeformular() {
  const[verfügbar, setVerfügbar] = useState(false);
    return (
    <div className="anmeldeformular">
       {verfügbar ?
       (
        <>
          Events sind verfügbar:
        </>
       ): (
        <>
          <NichtsVerfügbar/>
        </>
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