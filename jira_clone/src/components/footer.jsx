import { NavLink } from "react-router-dom";
import logo from "../assets/logos/logo.png";
import "../styles/components/footer.css";

export default function Footer(){
    const year = new Date().getFullYear();

    return(
        <footer className="footer-component">
            <div className="footer-top">
                <div className="footer-brand">
                    <div className="footer-logo-wrap">
                        <img src={logo} alt="website-logo" className="footer-logo" />
                    </div>
                    <p>Plan, track and ship work with your team.</p>
                </div>

                <nav className="footer-links">
                    <NavLink to="/dashboard" end>Dashboard</NavLink>
                    <NavLink to="/dashboard/projects">Projects</NavLink>
                    <NavLink to="/dashboard/tasks">Tasks</NavLink>
                    <NavLink to="/dashboard/settings">Settings</NavLink>
                </nav>
            </div>

            <div className="footer-bottom">
                <span>&copy; {year} Jira Clone. All rights reserved.</span>
                <span>More features coming soon...</span>
            </div>
        </footer>
    );
}
