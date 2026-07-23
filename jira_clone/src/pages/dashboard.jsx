import { Outlet } from "react-router-dom";


import Header from '../components/header';
import NavigationBar from '../components/navigationBar';
import Footer from '../components/footer';
import "../styles/pages/dashboard.css";



export default function Dashboard(){

return(
    <>
    <div className="dashboard-layout">
    <div className='header-dashboard'>
    <Header />
    </div>

    <div className='sidebar'>
    <NavigationBar />
    </div>

    <div className='main'>
    <Outlet />
    </div>

    <div className='footer-dashboard'>
    <Footer />
    </div>

    </div>
    </>
)
}
