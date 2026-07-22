import api from '../api/axiosInstance';
import {useState,useEffect} from 'react';


import Header from '../components/header';
import DashboardTab from '../components/dashboardTab';
import CreateNewProject from '../components/createNewProject';
import Projects from '../components/projects';
import Tasks from '../components/tasks';
import Settings from '../components/settings';
import NavigationBar from '../components/navigationBar';
import Footer from '../components/footer';
import "../styles/pages/dashboard.css";



export default function Dashboard(){

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [openedComponent,setOpenedComponent] = useState("dashboard");


return(
    <>
    <div className="dashboard-layout">
    <div className='header-dashboard'>
    <Header />
    </div>

    <div className='sidebar'>
    <NavigationBar onStateChange={setOpenedComponent}/>
    </div>

    <div className='main'>
    {openedComponent === "dashboard" && <DashboardTab />}
    {openedComponent === "projects" && <Projects />}
    {openedComponent === "tasks" && <Tasks />}
    {openedComponent === "settings" && <Settings />}
    </div>

    <div className='footer-dashboard'>
    <Footer />
    </div>

    </div>
    </>
)
}