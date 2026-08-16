import "./project.css";
import Header from "../../components/header";
import NavigationBar from "../../components/navigationBar";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import api from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
import Board from "../../components/board/Board";
import AddMemberDrawer from "./AddMemberDrawer";
import { useAuth } from "../../context/AuthContext";

export default function Project(){
    const {projectId} = useParams();
    const [tasks, setTasks] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(true);

    const navigate = useNavigate();
    const {currentUser} = useAuth();

    useEffect( () => {
        const abortController = new AbortController();

        const fetchProject = async () => {
            try{
                const response = await api.get(`/project/${projectId}`,{
                    withCredentials: true,
                    signal: abortController.signal,
                });

                setTasks(response.data.tasks || []);
                setProjectMembers((response.data.members || []).map((member) => member.user || member).filter(Boolean));

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

    const boardMembers = currentUser && !projectMembers.some((member) => member.id === currentUser.id)
        ? [currentUser, ...projectMembers]
        : projectMembers;

    const handleMembersChange = (nextMembers) => {
        setProjectMembers(nextMembers);
    };
        

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

        <Board
        projectId={projectId}
        tasks={tasks}
        members={boardMembers}
        currentUser={currentUser}
        onTasksChange={setTasks}
        />

        <AddMemberDrawer
        projectId={projectId}
        members={projectMembers}
        membersOpen={membersOpen}
        setMembersOpen={setMembersOpen}
        onMembersChange={handleMembersChange}
        />

    </div>
    

     <div className="footer-project">
        <Footer />
     </div>

    </div>
    </>
    )
}
