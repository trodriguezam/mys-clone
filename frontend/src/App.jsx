import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/jsx/Home.jsx';
import Navbar from './components/jsx/Navbar.jsx';
import Top from './components/jsx/Top.jsx';
import Matches from './components/jsx/Matches.jsx';
import SignUp from './components/jsx/SignUp.jsx';

function App() {
  return (
    <Router>
      <Top />
      <Routes>
        <Route path="/" element={< SignUp/>} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<div><h1>Page Not Found</h1></div>} />
      </Routes>
      <Navbar />
    </Router>
  );
}

export default App;
