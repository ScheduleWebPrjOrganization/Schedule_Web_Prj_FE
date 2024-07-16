import React from "react";
import "../style/Dashboard.css";

function Dashboard() {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // 이전 날짜로 이동하는 함수
    const goToPreviousDate = () => {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDate);
    };

    // 다음 날짜로 이동하는 함수
    const goToNextDate = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    return (
        <div className="dashboard">
            <div className="small-container">
                <p>00 : 00 : 00</p>
            </div>
            <div className="large-container">
                <div className="top-bar">
                    <div className="arrow left-arrow" onClick={goToPreviousDate}>{"<<"}</div>
                    <div className="current-date">{currentDate.toLocaleDateString()}</div>
                    <div className="arrow right-arrow" onClick={goToNextDate}>{">>"}</div>
                </div>
                <div className="subject-task">
                    <div className="subject">
                        <h3>Subject</h3>
                    </div>
                    <div className="task">
                        <h3>Task</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Dashboard };
