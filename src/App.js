import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Projects from './components/Projects'; 
import Tasks from './components/Tasks'; // Import the Tasks component

const App = () => {
    return (       
        <Router>
            <Routes>
                <Route exact path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Projects/:userId" element={<Projects />} />
                <Route path="/tasks/:userId/:projectId" element={<Tasks />} /> {/* Route for Tasks */}
            </Routes>
        </Router>
    );
};

export default App;
