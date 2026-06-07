import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/login.jsx'
import SignUp from "./pages/signup.jsx";
function App() {
  return (
    <Router>
     <Route path="/signup" element={<SignUp />}/>
     <Route path="/" element={<Profile />}/>
    </Router>
  )
}

export default App
