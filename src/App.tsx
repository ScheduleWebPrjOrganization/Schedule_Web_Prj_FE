import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';
import AllStudyGroup from "./component/AllStudyGroup";
import StudyGroupDetails from "./component/StudyGroupDetails";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/studygroup" element={<AllStudyGroup />} />
                    <Route path="/studygroup/:id" element={<StudyGroupDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
