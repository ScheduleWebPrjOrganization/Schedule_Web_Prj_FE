import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
