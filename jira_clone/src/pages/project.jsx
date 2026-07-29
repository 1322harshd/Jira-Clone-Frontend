import "../styles/pages/project.css";
import Header from "../components/header";
import NavigationBar from "../components/navigationBar";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import api from "../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

export default function Project(){
    const {projectId} = useParams();
    const [responseData, setResponseData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addMemberPressed,setAddMemberPressed] = useState(false);
    const [addMemberSearch,setAddMemberSearch] = useState("");

    const navigate = useNavigate();

    useEffect( () => {
        const abortController = new AbortController();

        const fetchProject = async () => {
            try{
                const response = await api.get(`/project/${projectId}`,{
                    withCredentials: true,
                    signal: abortController.signal,
                });

                setResponseData(response.data)

            }catch(err){
                if(err.code === 'ERR_CANCELED') return;
                console.log(err);
            }
            }

            fetchProject();

            return () => {
                        abortController.abort();
                    };

    },[projectId]);
    
    {/*  handling state change of add member search */}
    const handleAddMemberSearch = (e) => {
            setAddMemberSearch(e.target.value);

            try{
                const result = api.get(`/projects/${projectId}/member-search/`)
            }
    }

    return(
    <>
    <div className={`project-page-layout ${sidebarOpen ? "nav-open" : "nav-closed"}`}>
    <div className="header-project">
        <Header />
    </div>
    
<div className="sidebar-project">
    <AnimatePresence mode="wait">
    {sidebarOpen ? (
        <motion.div 
        key="project-navigation"
        className="navigation-bar-project"
        initial={{x: -220}}
        animate={{x:0}}
        exit={{x: -220}}
        transition={{duration: 0.5, ease:"easeOut"}}
        >
            <NavigationBar />
            <button
            className="project-nav-chevron project-nav-chevron-close"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            >
                <span></span>
            </button>
        </motion.div>
    ):(
        <motion.button 
        key="project-nav-arrow"
        className="project-nav-chevron project-nav-chevron-open"
        type="button"
        initial={{x:-50, opacity:0}}
        animate={{x:0, opacity:1}}
        exit={{x:-50,opacity:0}}
        transition={{duration:0.25}}
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
        >
            <span></span>
        </motion.button>
    )}
    </AnimatePresence>

    </div>

    
    <div className="main-project">
        <button className="project-back-button" onClick={() => navigate("/dashboard/projects")}>Back to Projects</button>

       <h1>{responseData?.name}</h1> 
       

       <div className="members-project">

        {!addMemberPressed && <div className="member-list-project">

        {/* button to add new member to project */}
       <div className="add-member-button-project">
        <button onClick={() => setAddMemberPressed(true)}>+ Add Member</button>
       </div>

       

       {/* map method to show all project members */}
            {responseData?.members?.map((member) => {
                if(!member.user) return null;

                return(
                <>   
                 <div className="member-detail-project">
                    <img src={`http://localhost:3002/${member.user.image}`} key={member.user.id}></img>
                    <p key={member.user.id}>{member.user.name}</p>
                </div>
               
                </>
                );
            })}
            </div>
            }
        {addMemberPressed && 
        <div className="add-member-button-project additional-add-member">
        <button onClick={ () => setAddMemberPressed(false)}>x</button>
        <input type="text" value={addMemberSearch} onChange={handleAddMemberSearch}></input>
        
        </div>
        }

        </div>

    </div>
    

     <div className="footer-project">
        <Footer />
     </div>

    </div>
    </>
    )
}
