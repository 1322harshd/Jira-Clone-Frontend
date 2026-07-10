import "../styles/components/createNewProject.css";
import { useState } from "react";

export default function CreateNewProject({onBack}){



    return(
        <>
        <button onClick={onBack}>Back</button>
       <h1>Create new project here</h1>
       
        </>
    )
}