import React from 'react';
import { Link } from 'react-router-dom';
import '../style/NavBar.css';

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/calendar">계획설계</Link></li>
                <li><Link to="/">대시보드</Link></li>
                <li><Link to="/calendar-show">달력</Link></li>
                <li><Link to="/studygroup">스터디그룹</Link></li>
                <li><Link to="/mypage">마이페이지</Link></li>
                <li><Link to="/record">기록</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;
