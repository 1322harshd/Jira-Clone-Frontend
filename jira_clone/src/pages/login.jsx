import logo from '../assets/logos/logo.png'; 
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authentication.css';

export default function Profile(){

const navigate = useNavigate();

const [form, setForm] = useState({
    email:'',
    password:''
})

const [error, setError] = useState(null);

const handleChange = (e) =>{
    setForm({...form,[e.target.name]:e.target.value});
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('/api/login', form);
        console.log(response);
        navigate('/dashboard');
    }
    catch(error){
        setError(error.response.data.message);
    }
}
    return(
        <>
        <section className='header'>    
        <img src={logo} alt="website-logo" width="200px" height="100px" padding-left="20px" />
        </section>

        <h1 className='page-heading'>Login</h1>

        <section className='login-inputs'>
            <form onSubmit={handleSubmit}>
                <div className='input-wrapper'>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}></input>
                </div>

                <div className='input-wrapper'>
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange}></input>
                </div>

{error && <p className='error'>{error}</p>}

                <button type="submit" className="btn" >
                        Login
                    </button>
            </form>

            <section className='authentication-option'>
            <p>Don't have an account?</p>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
            </section>
            
        </section>

        </>
    )
}
