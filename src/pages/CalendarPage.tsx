import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import '../style/Calendar.css'
import { Link, useNavigate, useLocation } from "react-router-dom";

function CalendarPage() {
    const [selectedRanges, setSelectedRanges] = useState<{ startDate: Date | null, endDate: Date | null }[]>([]);
    const navigate = useNavigate();

    const handleRangeChange = (dates: any) => {
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            setSelectedRanges([...selectedRanges, { startDate: start, endDate: end }]);
        } else {
            setSelectedRanges([...selectedRanges, { startDate: dates, endDate: null }]);
        }
    };

    const PlanButtonClick = () => {
        if (selectedRanges.length > 0) {
            navigate("/calendar-plan", { state: { selectedRanges } });
        }
    };

    const formatDay = (locale: string | undefined, date: Date) => {
        return dayjs(date).format('DD');
    };

    const tileClassName = ({ date }: { date: Date }): string | null => {
        for (const range of selectedRanges) {
            if (
                range.startDate &&
                range.endDate &&
                date >= range.startDate &&
                date <= range.endDate
            ) {
                return 'selected-date';
            }
        }
        return null;
    };

    return (
        <div className="calendar-page">
            <h2 className="Calendar-Title">여정 계획하기</h2>
            <Link to="/" className="back-home">뒤로가기</Link>

            <div className="calendar-container">
                <Calendar
                    onChange={handleRangeChange}
                    selectRange={true}
                    formatDay={formatDay}
                    className="custom-calendar"
                    tileClassName={tileClassName}
                />
            </div>

            <div>
                <p>선택한 날짜 범위: </p>
                {selectedRanges.map((range, index) => (
                    <p key={index}>
                        {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString() || '진행 중'}
                    </p>
                ))}
            </div>

            <button className="plan-button" onClick={PlanButtonClick} disabled={selectedRanges.length === 0}>
                계획 짜기
            </button>
        </div>
    );
}

export default CalendarPage;
