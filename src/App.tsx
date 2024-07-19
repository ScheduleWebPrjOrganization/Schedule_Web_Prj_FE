import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import Home from './component/Home';
import ReportModal from './component/report/ReportModal';
import GetReport from "./component/report/GetReport";

const App: React.FC = () => {
    const [showReportModal, setShowReportModal] = useState(false);

    const handleOpenReportModal = () => setShowReportModal(true);
    const handleCloseReportModal = () => setShowReportModal(false);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/report" element={<ReportModal show={showReportModal} handleClose={handleCloseReportModal} />} />
                    <Route path="/note" element={<GetReport />} />
                </Routes>
                <button onClick={handleOpenReportModal}>Report</button>
                {showReportModal && <ReportModal show={showReportModal} handleClose={handleCloseReportModal} />}
            </div>
        </Router>
    );
};

export default App;
