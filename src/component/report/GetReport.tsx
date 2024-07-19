import React, { useState } from 'react';
import axios from 'axios';

const GetReport: React.FC = () => {
    const [groupChatId, setGroupChatId] = useState<number | null>(null);
    const [report, setReport] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFetchReport = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reports/${groupChatId}`);
            if (response.status === 200) {
                console.log(response.data);  // 데이터를 콘솔에 출력하여 확인
                setReport(response.data);
                setError(null);
            }
        } catch (error) {
            console.error(error);  // 에러를 콘솔에 출력
            setError('Report not found');
            setReport(null);
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Enter Chat ID"
                value={groupChatId || ''}
                onChange={(e) => setGroupChatId(Number(e.target.value))}
            />
            <button onClick={handleFetchReport}>Get Report</button>
            {error && <p>{error}</p>}
            {report && (
                <div>
                    <h3>Report Details</h3>
                    <p>ID: {report.id}</p>
                    <p>Chat ID: {report.chatId}</p>
                    <p>Reported User ID: {report.reportedUserId}</p>
                    <p>Reporter ID: {report.reporterId}</p>
                    <p>Status: {report.status}</p>
                    <p>Date: {report.date}</p>
                </div>
            )}
        </div>
    );
};

export default GetReport;
