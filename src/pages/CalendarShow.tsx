import React from "react";
import { useLocation, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

function CalendarShow() {
    const location = useLocation();
    const { newDayInput, currentDateKey } = location.state || {};

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            if (formattedDate === currentDateKey) {
                return <p>{newDayInput}</p>;
            }
        }
        return null;
    };

    return (
        <div className="calendar-page">
            <h2 className="Calendar-Title">여정 계획하기</h2>
            <Link to="/" className="back-home">
                뒤로가기
            </Link>

            <div className="calendar-container">
                <Calendar
                    tileContent={tileContent}
                    formatDay={(locale, date) => dayjs(date).format("DD")}
                    className="custom-calendar"
                />
            </div>
        </div>
    );
}

export default CalendarShow;
