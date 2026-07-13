import "../styles/components/createNewProject.css";
import { useState,useEffect } from "react";
import api from '../api/axiosInstance';

export default function CreateNewProject({onBack}){

    const [formData, setFormData] = useState({
        projectname: '',
        description: '',
    });

    const [searchText,setSearchText] = useState('');

    const [searchData, setSearchData] = useState([]);

    const [selectedMember, setSelectedMember] = useState([])

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const  handleSubmit = async (e) => {
        e.preventDefault();
         
    }

    useEffect( () => {

        if(!searchText){
            setSearchData([]);
            return;
        } 

        const fetchSearch = async () => {

            try{
                const response = await api.get(`/member-search?q=${searchText}`,{
                    withCredentials:true
                });

                setSearchData(response.data);
            }catch(err){
                console.log(err);
            }
        };

       fetchSearch();

    }, [searchText]);

    const handleAddedMember = (user) => {
       setSelectedMember((prevMembers) => [...prevMembers,user]);
    }

    const handleRemoveMember = (userToRemove) => {
       setSelectedMember((prevMembers) => prevMembers.filter((member) => member.name !== userToRemove.name))
    }

    return(
        <>
        <div className="main-element">

        <div className="back-btn">
            <button onClick={onBack}>Back</button> 
        </div>
       
        <div className="create-new-form">

        <form className="project-create-form" onSubmit={handleSubmit}>

            <h2 className="form-title">Create New Project</h2>
            
            <div className="form-inputs">

            <div className="form-group">
            <label htmlFor="projectname">Name</label>
            <input id="projectname" name="projectname" type="text" value={formData.projectname} onChange={handleChange}></input>
            </div>

            <div className="form-group">
            <label htmlFor="description">Description</label>
            <input id="description" name="description" type="textarea" value={formData.description} onChange={ handleChange} ></input>
            </div>

            { selectedMember.length > 0 && <div className="selected-members">
                {selectedMember.map( (user) => (
                    <p key={user.id}>
                       {user.name}
                        <span>
                            <button type="button" onClick={() => handleRemoveMember(user)}>
                            X
                            </button>
                        </span>

                    </p>
                ))}
                </div>
            }

            <div className="form-group">
            <label htmlFor="add-member">Member</label>
            <input id="add-member" name="add-member" type="text" value={searchText} onChange={ (e) => { setSearchText(e.target.value)}}></input>
            </div>
            
            </div>

            { searchData.length > 0 && <div className="search-response">
                <ul>
                {searchData.map( (user) => (

                   <li key={user.name}>
                    <button type="button" onClick={() => handleAddedMember(user)}>
                        {user.name}
                    </button>
                    </li>

                ))}
                </ul>
            </div>}

            <button className="create-btn" type="submit">Create</button>
        </form>
       </div>
       </div>

        </>
    )
}
