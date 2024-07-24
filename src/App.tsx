import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login-page'; // 경로를 확인하세요
import Register from './component/Register'; // 경로를 확인하세요
import Home from './component/Home'; // 경로를 확인하세요
import AllStudyGroup from "./component/AllStudyGroup"; // 경로를 확인하세요
import StudyGroupDetails from "./component/StudyGroupDetails"; // 경로를 확인하세요
import Timer from './component/Timer'; // 경로를 확인하세요
import NavBar from "./component/NavBar"; // 경로를 확인하세요
import CalendarPage from "./pages/CalendarPage"; // 경로를 확인하세요
import CalendarPlan from "./pages/CalendarPlan"; // 경로를 확인하세요
import CalendarShow from "./pages/CalendarShow"; // 경로를 확인하세요
import Dashboard from "./pages/Dashboard"; // 경로를 확인하세요
import MyPage from "./pages/MyPage";
import {Record} from "./pages/Record"; // 경로를 확인하세요
import Snow from './component/decoration/Snow'; // Snow 컴포넌트를 임포트
import './style/App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="entire">
                <Snow /> {/* Snow 컴포넌트를 최상위에 추가 */}
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
                        <Route path="/record" element={<Record />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
