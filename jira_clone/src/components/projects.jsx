import CreateNewProject from "./createNewProject";
import "../styles/components/projects.css";
import {useEffect,useState} from 'react';
import api from '../api/axiosInstance';

export default function Projects(){

    const [showCreateProject,setShowCreateProject] = useState(false);
    const [projects,setProjects] = useState([]);



    useEffect (() => {
        const abortController = new AbortController();

        const fetchProjects = async () => {
        try{ 
            const response = await api.get('/projects', {
            withCredentials: true,
            signal: abortController.signal,
        });

        setProjects(response.data);

        }
        catch(err){
            if(err.code === 'ERR_CANCELED') return;
            console.log(err);
        }

        }
        
        fetchProjects();

        return () => {
            abortController.abort();
        };
       
    },[]);
    
    return(
        <>
        {!showCreateProject && (
            <>

            <div className="project-create-new-btn">
                 <button className="create-new-btn" onClick={ () => setShowCreateProject(true)}><span className="plus-sign">+</span> Create New Project</button>
            </div>  
            
            <div className="projects-heading">
                <h1>Projects</h1>
            </div>

       <div className="project-display">
    {/* using map to show all projects */}
  {projects.map((project) => {
    const visibleMembers = project.members?.slice(0, 3) || [];
    const extraMembers = (project.members?.length || 0) - visibleMembers.length;
    let noTasks = false;
    if(project.tasks == [] ){
       noTasks = true;
    }
    return (
      <div className="project" key={project.id}>
        <h2>{project.name}</h2>

        <div className="project-details">
        { !noTasks && <h5>No Tasks</h5>}
        
        </div>

        <div className="member-details">
            {/* using map method to show all the members images */}
          <div className="member-details-images">
            {visibleMembers.map((member) => {
              const user = member.user;

              if (!user) return null;

              return (
                <img
                  key={user.id}
                  src={`http://localhost:3002/${user.image}`}
                  alt={user.name}
                />
              );
            })}
          </div>

          <div className="member-details-names">
             {/* using map method to show all the members names */}
            {visibleMembers.map((member, index) => {
              const user = member.user;

              if (!user) return null;

              const firstName = user.name.split(" ")[0];
              const isLastVisibleName = index === visibleMembers.length - 1;

              return (
                <span key={user.id}>
                  {firstName}
                  {!isLastVisibleName && ", "}
                </span>
              );
            })}

            {extraMembers > 0 && (
              <span> +{extraMembers} members</span>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>
            </>
        )}

        {showCreateProject && (
            <CreateNewProject onBack = { () => setShowCreateProject(false)}/>
        )}

     
        
        </>
    )
}
