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
    const [memberSearchData, setMemberSearchData] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [membersOpen, setMembersOpen] = useState(true);

    const navigate = useNavigate();

    const getUserImageLink = (imagePath) => `http://localhost:3002/${imagePath}`;

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
    
    
     //api call for member search
        useEffect(() => {
        if (!addMemberSearch) {
            setMemberSearchData([]);
            return;
        }

        const timer = setTimeout(() => {
            const fetchSearch = async () => {
            try {
                const response = await api.get(`/projects/${projectId}/member-search?q=${addMemberSearch}`, {
                withCredentials: true,
                });

                setMemberSearchData(response.data);
            } catch (err) {
                console.log(err);
            }
            };

            fetchSearch();
        }, 300);

        return () => {
            clearTimeout(timer);
        };
        }, [addMemberSearch, projectId]);

    const resetAddMemberForm = () => {
        setAddMemberPressed(false);
        setAddMemberSearch("");
        setMemberSearchData([]);
        setSelectedMembers([]);
    }

    const handleSelectMember = (user) => {
        setSelectedMembers((prevMembers) => {
            const alreadySelected = prevMembers.some((member) => member.id === user.id);

            if(alreadySelected) return prevMembers;

            return [...prevMembers, user];
        });
        setAddMemberSearch("");
        setMemberSearchData([]);
    }

    const handleRemoveSelectedMember = (userToRemove) => {
        setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.id !== userToRemove.id));
    }

    const handleAddMember = async () => {
        if(selectedMembers.length === 0 || isAddingMember) return;

        const selectedMemberIds = selectedMembers.map((member) => member.id);

        try{
            setIsAddingMember(true);

            await api.post(`/projects/${projectId}/members`, {
                userIds: selectedMemberIds,
            }, {
                withCredentials: true,
            });

            setResponseData((prevData) => {
                if(!prevData) return prevData;

                const newMembers = selectedMembers.filter((selectedMember) => {
                    return !prevData.members?.some((member) => member.user?.id === selectedMember.id);
                });

                if(newMembers.length === 0) return prevData;

                return {
                    ...prevData,
                    members: [
                        ...(prevData.members || []),
                        ...newMembers.map((member) => ({ user: member })),
                    ],
                };
            });

            resetAddMemberForm();
        }catch(err){
            console.log(err);
        }finally{
            setIsAddingMember(false);
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
       

       <AnimatePresence>
        {membersOpen ? (
        <motion.aside
        key="project-members-panel"
        className="members-project"
        initial={{x: "105%"}}
        animate={{x: 0}}
        exit={{x: "105%"}}
        transition={{duration: 0.35, ease:"easeOut"}}
        >
        <button
        className="project-members-toggle project-members-toggle-close"
        type="button"
        onClick={() => setMembersOpen(false)}
        aria-label="Hide members"
        >
            <span></span>
        </button>

        <div className="members-project-content">
        <div className="members-project-header">
            <div>
                <span>Team</span>
                <h2>Members</h2>
            </div>
            <strong>{responseData?.members?.length || 0}</strong>
        </div>

        {!addMemberPressed && (
        <button className="project-add-member-primary" type="button" onClick={() => setAddMemberPressed(true)}>
            + Add Member
        </button>
        )}

        {addMemberPressed && 
        <div className="add-member-button-project additional-add-member">
        <button
        className="project-cancel-add-member"
        type="button"
        onClick={resetAddMemberForm}
        aria-label="Cancel adding members"
        >
            x
        </button>
        <div className="project-member-search-field">
        <div className="project-member-search-input-wrap">
        <input type="text" placeholder="Search members" value={addMemberSearch} onChange={(e) => setAddMemberSearch(e.target.value)}></input>

        {memberSearchData.length > 0 && (
            <div className="project-member-search-results">
                {memberSearchData.filter((user) => {
                    const alreadySelected = selectedMembers.some((member) => member.id === user.id);
                    const alreadyProjectMember = responseData?.members?.some((member) => member.user?.id === user.id);

                    return !alreadySelected && !alreadyProjectMember;
                }).map((user) => (
                    <button key={user.id} type="button" onClick={() => handleSelectMember(user)}>
                        <img src={getUserImageLink(user.image)} alt={`${user.name} avatar`} />
                        <span>{user.name}</span>
                    </button>
                ))}
            </div>
        )}
        </div>

        {selectedMembers.length > 0 && (
            <div className="project-selected-members">
                {selectedMembers.map((member) => (
                    <div className="project-selected-member" key={member.id}>
                        <img src={getUserImageLink(member.image)} alt={`${member.name} avatar`} />
                        <span>{member.name}</span>
                        <button type="button" onClick={() => handleRemoveSelectedMember(member)}>x</button>
                    </div>
                ))}
            </div>
        )}
        </div>

        <button
        className="project-confirm-add-member"
        type="button"
        onClick={handleAddMember}
        disabled={selectedMembers.length === 0 || isAddingMember}
        >
            {isAddingMember ? "Adding" : "Add"}
        </button>
        </div>
        }

        <div className="member-list-project">
            {responseData?.members?.map((member) => {
                if(!member.user) return null;

                return(
                 <div className="member-detail-project" key={member.user.id}>
                    <img src={`http://localhost:3002/${member.user.image}`} alt={`${member.user.name} avatar`}></img>
                    <div>
                        <p>{member.user.name}</p>
                        <span>Project member</span>
                    </div>
                </div>
                );
            })}
        </div>
        </div>
        </motion.aside>
        ) : (
        <motion.button
        key="project-members-open"
        className="project-members-toggle project-members-toggle-open"
        type="button"
        initial={{x: 44, opacity:0}}
        animate={{x:0, opacity:1}}
        exit={{x:44, opacity:0}}
        transition={{duration:0.25}}
        onClick={() => setMembersOpen(true)}
        aria-label="Show members"
        >
            <span></span>
        </motion.button>
        )}
       </AnimatePresence>

    </div>
    

     <div className="footer-project">
        <Footer />
     </div>

    </div>
    </>
    )
}
