import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import '../style/Calendar.css';
import { Link, useNavigate } from "react-router-dom";

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

function CalendarPage() {
    const [selectedRanges, setSelectedRanges] = useState<DateRange[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRangeChange = (dates: any) => {
        setErrorMessage(null); // 오류 메시지 초기화
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            if (start && end) {
                const isOverlap = selectedRanges.some(range =>
                    range.startDate && range.endDate && start <= range.endDate && end >= range.startDate
                );
                if (isOverlap) {
                    setErrorMessage("선택한 기간이 이미 선택된 기간과 겹칩니다.");
                } else {
                    setSelectedRanges([...selectedRanges, { startDate: start, endDate: end }]);
                }
            }
        } else {
            const isOverlap = selectedRanges.some(range =>
                range.startDate && range.endDate && dates <= range.endDate && dates >= range.startDate
            );
            if (isOverlap) {
                setErrorMessage("선택한 날짜가 이미 선택된 기간과 겹칩니다.");
            } else {
                setSelectedRanges([...selectedRanges, { startDate: dates, endDate: null }]);
            }
        }
    };

    const handleClearSelection = () => {
        setSelectedRanges([]);
        setErrorMessage(null); // 오류 메시지 초기화
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
            <div className="calendar-section">
                <h2 className="Calendar-Title">계획 날짜 선택</h2>
                <div className="calendar-container">
                    <Calendar
                        onChange={handleRangeChange}
                        selectRange={true}
                        formatDay={formatDay}
                        className="custom-calendar"
                        tileClassName={tileClassName}
                    />
                </div>
            </div>
            <div className="selected-date-section">
                <p>   &nbsp;&nbsp;&nbsp;&nbsp; 선택한 날짜 범위: </p>
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
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
            <div className="button-group">
                <button className="page-button" onClick={PlanButtonClick} disabled={selectedRanges.length === 0}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        version="1.1"
                        width="256"
                        height="256"
                        viewBox="0 0 256 256"
                        xmlSpace="preserve"
                    >
                        <defs></defs>
                        <g
                            style={{
                                stroke: "none",
                                strokeWidth: 0,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 10,
                                fill: "none",
                                fillRule: "nonzero",
                                opacity: 1,
                            }}
                            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                        >
                            <path
                                d="M 71.79 34.614 c -0.334 -0.497 -0.926 -0.745 -1.513 -0.63 l -18.311 3.528 l 3.718 -35.877 c 0.071 -0.682 -0.332 -1.32 -0.979 -1.55 c -0.648 -0.229 -1.362 0.011 -1.738 0.585 L 18.202 53.746 c -0.328 0.5 -0.325 1.144 0.008 1.639 c 0.33 0.493 0.922 0.742 1.513 0.632 l 18.312 -3.529 l -3.718 35.876 c -0.071 0.684 0.332 1.322 0.979 1.551 C 35.455 89.971 35.622 90 35.792 90 c 0.502 0 0.965 -0.251 1.241 -0.67 l 34.765 -53.076 C 72.126 35.754 72.122 35.11 71.79 34.614 z"
                                style={{
                                    stroke: "none",
                                    strokeWidth: 1,
                                    strokeDasharray: "none",
                                    strokeLinecap: "butt",
                                    strokeLinejoin: "miter",
                                    strokeMiterlimit: 10,
                                    fill: "rgb(0,0,0)",
                                    fillRule: "nonzero",
                                    opacity: 1,
                                }}
                                transform="matrix(1 0 0 1 0 0)"
                                strokeLinecap="round"
                            ></path>
                        </g>
                    </svg>
                    계획 짜기
                </button>
                <button className="page-button" onClick={handleClearSelection} disabled={selectedRanges.length === 0}>
                    선택 초기화
                </button>
            </div>
            <Link to="/" className="back-home">뒤로가기</Link>
        </div>
    );
}

export default CalendarPage;
