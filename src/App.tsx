import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';
import NavBar from "./component/NavBar";
import CalendarPage from "./pages/CalendarPage";
import CalendarPlan from "./pages/CalendarPlan";
import CalendarShow from "./pages/CalendarShow";
import Dashboard from "./pages/Dashboard";
import {StudyGroup} from "./pages/StudyGroup";
import {MyPage} from "./pages/MyPage";
import {Record} from "./pages/Record";

const App: React.FC = () => {
    return (
        <Router>
            <NavBar />
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/calendar-plan" element={<CalendarPlan />} />
                    <Route path="/calendar-show" element={<CalendarShow/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/studygroup" element={<StudyGroup />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/record" element={<Record />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;