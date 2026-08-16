import {useState} from 'react';
import {useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import api from '../api/axiosInstance.js';


export default function UserIcon(){
const navigate = useNavigate();

const [open, setOpen] = useState(false);
const { currentUser, authLoading, setCurrentUser } = useAuth();

if(authLoading || !currentUser){
    return null;
}

const imageLink = `http://localhost:3002/${currentUser.image}`;

const handleClick =  async () => {
try{
     await api.post('/logout');
     setCurrentUser(null);
     setOpen(false);
     navigate('/login');

}catch(error){
    console.log(error);
}
}

return (
    <>
    <div className="main-icon">
        <img src={imageLink} alt="user-image" className='user-image' onClick={ () => setOpen(!open)}></img>
    </div>

    <div className={open ? 'user-settings show' : 'user-settings'}>

        <div className='user-img-name'>
        <img src={imageLink} alt="user-image" className='user-image' ></img>
        <h3>{currentUser.name}</h3>
        </div>

        <hr></hr>

        <div className='user-settings-btn'>
        <button type="button" onClick={handleClick}>Logout</button>
        </div>

    </div>
    </>
)

}
