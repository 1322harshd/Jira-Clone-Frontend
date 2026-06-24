import logo from '../assets/logos/logo.png'; 
import UserIcon from './usericon';
import { useState } from 'react';
import './header.css'


export default function Header(){
    return(
        <>
       <section className='header'>
       <img src={logo} alt="website-logo" width="200px" height="100px" padding-left="20px" />
       

       <input type="text" placeholder='Search' name="search" ></input>

       <UserIcon />
       </section>
        </>
    )
}