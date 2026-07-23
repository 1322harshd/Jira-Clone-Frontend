import "../styles/components/navigationBar.css";
import { NavLink } from "react-router-dom";

export default function NavigationBar(){
    return(
        <>
        
<div className='navigation-bar'>
  <ul>
   
    <li><NavLink to="/dashboard" end>Dashboard</NavLink></li>
    <li><NavLink to="/dashboard/projects">Projects</NavLink></li>
    <li><NavLink to="/dashboard/tasks">Tasks</NavLink></li>
    <li><NavLink to="/dashboard/settings">Settings</NavLink></li>

  </ul>
  </div>
        </>
    )
}
