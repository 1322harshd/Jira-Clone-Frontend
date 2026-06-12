import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './pages/login.jsx';
import SignUp from "./pages/signup.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
