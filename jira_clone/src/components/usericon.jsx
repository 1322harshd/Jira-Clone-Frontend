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

const userName = currentUser.name || "Account";
const imageLink = currentUser.image ? `${currentUser.image}` : null;

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
        {imageLink ? (
        <img src={imageLink} alt="user-image" className='user-image' onClick={ () => setOpen(!open)}></img>
        ) : (
        <button type="button" className="user-image user-image-fallback" onClick={() => setOpen(!open)}>
            {userName.charAt(0)}
        </button>
        )}
    </div>

    <div className={open ? 'user-settings show' : 'user-settings'}>

        <div className='user-img-name'>
        {imageLink ? (
        <img src={imageLink} alt="user-image" className='user-image' ></img>
        ) : (
        <span className="user-image user-image-fallback">{userName.charAt(0)}</span>
        )}
        <h3>{userName}</h3>
        </div>

        <hr></hr>

        <div className='user-settings-btn'>
        <button type="button" onClick={handleClick}>Logout</button>
        </div>

    </div>
    </>
)

}
