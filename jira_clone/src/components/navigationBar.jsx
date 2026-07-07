import "../styles/components/navigationBar.css";

export default function NavigationBar({onStateChange}){
    return(
        <>
        
<div className='navigation-bar'>
  <ul>
   
    <li><button onClick={() => onStateChange("dashboard")}>Dashboard</button></li>
    <li><button onClick={() => onStateChange("projects")}>Projects</button></li>
    <li><button onClick={() => onStateChange("tasks")}>Tasks</button></li>
    <li><button onClick={() => onStateChange("settings")}>Settings</button></li>

  </ul>
  </div>
        </>
    )
}