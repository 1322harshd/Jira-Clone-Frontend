import logo from '../assets/logos/logo.png'; 
import UserIcon from './usericon';
import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import './header.css'


export default function Header(){
    return(
        <>
       <section className='header'>
       <img src={logo} alt="website-logo" width="190px" height="50px" padding-left="20px" />
       
       <div className='search-input'>
        <FiSearch className="search-logo" />
       <input type="text" placeholder='Search' name="search" ></input>
       </div>

        <div className='user-menu'><UserIcon /></div>
      
       </section>
        </>
    )
}