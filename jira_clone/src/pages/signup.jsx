import logo from '../assets/logos/logo.png'; 
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authentication.css';


export default function SignUp(){

    const navigate = useNavigate();

const [form, setForm] = useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
})


const handleChange = (e) =>{
    setForm({...form,[e.target.name]:e.target.value});
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('/api/users', form);
        console.log(response);
    }
    catch(error){
        console.log(error);
    }
}
    return(
        <>
        <section className='header'>    
        <img src={logo} alt="website-logo" width="200px" height="100px" />
        </section>
        <section className='login-inputs'>
            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Name:</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange}></input>

                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}></input>

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange}></input>

                <label htmlFor="confirm-password">Confirm Password:</label>
                <input id="confirm-password" name="confirm-password" type="password" value={form.confirmPassword} onChange={handleChange}></input>


                
                <button type="submit" className="btn" >
                        SignUp
                    </button>
            </form>

            <section className='authentication-option'>
            <p>Already have an account?</p>
            <button onClick={() => navigate('/login')}>Login</button>
            </section>
           
        </section>

        </>
    )
}
