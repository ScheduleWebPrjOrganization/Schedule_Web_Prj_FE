import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';
import AllStudyGroup from "./component/AllStudyGroup";
import StudyGroupDetails from "./component/StudyGroupDetails";
import Timer from './component/Timer';
import NavBar from "./component/NavBar";
import CalendarPage from "./pages/CalendarPage";
import CalendarPlan from "./pages/CalendarPlan";
import CalendarShow from "./pages/CalendarShow";
import Dashboard from "./pages/Dashboard";
import {MyPage} from "./pages/MyPage";
import Statistics from "./pages/Statistics";


const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <div>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/calendar-plan" element={<CalendarPlan />} />
                    <Route path="/calendar-show" element={<CalendarShow />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/studygroup" element={<AllStudyGroup />} />
                    <Route path="/studygroup/:id" element={<StudyGroupDetails />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
