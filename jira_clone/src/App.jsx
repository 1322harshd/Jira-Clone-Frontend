import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/login.jsx';
import SignUp from "./pages/signup.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Avatar from "./pages/avatar.jsx";
import Project from "./pages/project.jsx";
import DashboardTab from "./components/dashboardTab.jsx";
import Projects from "./components/projects.jsx";
import Tasks from "./components/tasks.jsx";
import Settings from "./components/settings.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Profile />} />
        <Route path="/dashboard" element= {<Dashboard />}>
          <Route index element={<DashboardTab />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/avatar" element= {<Avatar />} />
        <Route path="/project/:projectId" element= {<Project /> } />
      </Routes>
    </Router>
  )
}

export default App
