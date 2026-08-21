import logo from '../assets/logos/logo.png';
import UserIcon from './usericon';
import SearchBar from './searchBar';
import './header.css'


export default function Header(){
    return(
        <>
       <section className='app-header'>
       <img src={logo} alt="website-logo" width="190px" height="50px" padding-left="20px" />

       <SearchBar />

        <div className='user-menu'><UserIcon /></div>

       </section>
        </>
    )
}
