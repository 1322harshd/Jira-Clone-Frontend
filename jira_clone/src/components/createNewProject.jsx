import "../styles/components/createNewProject.css";
import { useState } from "react";

export default function CreateNewProject(){

const [buttonPressed,setButtonPressed] = useState(false);

if(buttonPressed === true){
    alert('button pressed');
}
    return(
        <>
        <button className="create-new-btn" onClick={ () => setButtonPressed(true)}><span className="plus-sign">+</span> Create New Project</button>
        </>
    )
}