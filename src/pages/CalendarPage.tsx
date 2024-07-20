import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import '../style/Calendar.css';
import { Link, useNavigate } from "react-router-dom";

function CalendarPage() {
    const [selectedRanges, setSelectedRanges] = useState<{ startDate: Date | null, endDate: Date | null }[]>([]);
    const navigate = useNavigate();

    const handleRangeChange = (dates: any) => {
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            if (start && end) {
                setSelectedRanges([...selectedRanges, { startDate: start, endDate: end }]);
            }
        } else {
            setSelectedRanges([...selectedRanges, { startDate: dates, endDate: null }]);
        }
    };

    const handleClearSelection = () => {
        setSelectedRanges([]);
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
                {selectedRanges.length > 0 ? (
                    selectedRanges.map((range, index) => (
                        <p key={index}>
                            {range.startDate?.toLocaleDateString()} - {range.endDate?.toLocaleDateString() || '진행 중'}
                        </p>
                    ))
                ) : (
                    <p>선택된 날짜 범위가 없습니다.</p>
                )}
            </div>

            <div className="button-group">
                <button className="plan-button" onClick={PlanButtonClick} disabled={selectedRanges.length === 0}>
                    계획 짜기
                </button>
                <button className="clear-button" onClick={handleClearSelection} disabled={selectedRanges.length === 0}>
                    선택 초기화
                </button>
            </div>
        </div>
    );
}

export default CalendarPage;
