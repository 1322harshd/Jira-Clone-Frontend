import CreateNewProject from "./createNewProject";
import "../styles/components/projects.css";
import {useState} from 'react';

export default function Projects(){

    const [showCreateProject,setShowCreateProject] = useState(false);
    
    return(
        <>
        {!showCreateProject && (
            <>

            <div className="project-create-new-btn">
                 <button className="create-new-btn" onClick={ () => setShowCreateProject(true)}><span className="plus-sign">+</span> Create New Project</button>
            </div>  
            
            <div className="projects-display">
                <h1>your projects</h1>
            </div>

            </>
        )}

        {showCreateProject && (
            <CreateNewProject onBack = { () => setShowCreateProject(false)}/>
        )}

     
        
        </>
    )
}