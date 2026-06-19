import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/login.jsx';
import SignUp from "./pages/signup.jsx";
import Dashboard from "./pages/dashboard.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Profile />} />
        <Route path="/dashboard" element= {<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
