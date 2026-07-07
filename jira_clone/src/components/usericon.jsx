import {useState} from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function UserIcon({user}){
const navigate = useNavigate();

const [open, setOpen] = useState(false);

const imageLink = `http://localhost:3002/${user.image}`;

const handleClick =  async (event) => {
event.preventDefault();



try{
     const response = await axios.post('/api/logout', {
                withCredentials:true
            });
     
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
        <h3>{user.name}</h3>
        </div>

        <hr></hr>

        <div className='user-settings-btn'>
        <a href='/logout' onClick={handleClick}>Logout</a>
        </div>

    </div>
    </>
)

}