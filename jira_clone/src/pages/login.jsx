import logo from '../assets/logos/logo.png'; 
import axios from 'axios';
import { useState } from 'react';


export default function Profile(){
const [form, setForm] = useState({
    email:'',
    password:''
})


const handleChange = (e) =>{
    setForm({...form,[e.target.name]:e.target.value});
}

const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('/api/login', form);
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

                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}></input>

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" value={form.password} onChange={handleChange}></input>
                
                <button type="submit" className="btn" >
                        Login
                    </button>
            </form>
            <p>Don't have an account?</p>
            <button >Sign Up</button>
        </section>

        </>
    )
}
