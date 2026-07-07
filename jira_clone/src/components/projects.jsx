import CreateNewProject from "./createNewProject";
import "../styles/components/projects.css";
export default function Projects(){
    return(
        <>
        <div className="project-create-new-btn">
        <CreateNewProject />
        </div>
        <h1>your projects</h1>
        </>
    )
}