import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function AddMemberDrawer({projectId, members, membersOpen, setMembersOpen, onMembersChange}){
    const [addMemberPressed,setAddMemberPressed] = useState(false);
    const [addMemberSearch,setAddMemberSearch] = useState("");
    const [memberSearchData, setMemberSearchData] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isAddingMember, setIsAddingMember] = useState(false);

    const getUserImageLink = (imagePath) => `http://localhost:3002/${imagePath}`;

    useEffect(() => {
        if (!addMemberSearch) {
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
    };

    const handleSelectMember = (user) => {
        setSelectedMembers((prevMembers) => {
            const alreadySelected = prevMembers.some((member) => member.id === user.id);

            if(alreadySelected) return prevMembers;

            return [...prevMembers, user];
        });
        setAddMemberSearch("");
        setMemberSearchData([]);
    };

    const handleRemoveSelectedMember = (userToRemove) => {
        setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.id !== userToRemove.id));
    };

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

            const newMembers = selectedMembers.filter((selectedMember) => {
                return !members.some((member) => member.id === selectedMember.id);
            });

            if(newMembers.length > 0){
                onMembersChange([...members, ...newMembers]);
            }

            resetAddMemberForm();
        }catch(err){
            console.log(err);
        }finally{
            setIsAddingMember(false);
        }
    };

    return(
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
            <strong>{members.length}</strong>
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
        <input
        type="text"
        placeholder="Search members"
        value={addMemberSearch}
        onChange={(e) => {
            setAddMemberSearch(e.target.value);
            if(!e.target.value) setMemberSearchData([]);
        }}
        ></input>

        {memberSearchData.length > 0 && (
            <div className="project-member-search-results">
                {memberSearchData.filter((user) => {
                    const alreadySelected = selectedMembers.some((member) => member.id === user.id);
                    const alreadyProjectMember = members.some((member) => member.id === user.id);

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
            {members.map((member) => (
                <div className="member-detail-project" key={member.id}>
                    <img src={getUserImageLink(member.image)} alt={`${member.name} avatar`}></img>
                    <div>
                        <p>{member.name}</p>
                        <span>Project member</span>
                    </div>
                </div>
            ))}
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
    );
}
