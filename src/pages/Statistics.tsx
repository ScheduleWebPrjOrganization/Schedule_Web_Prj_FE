import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import axios from 'axios';
import '../style/StatisticsPage.css';

const API_URL = 'http://localhost:8080/api';

// 통계 데이터 가져오기
async function getTaskStatistics(memberId: number, startDate: string, endDate: string) {
    const response = await axios.post(`${API_URL}/tasks/statistics`, {
        memberId,
        startDate,
        endDate
    });
    return response.data;
}

const Statistics: React.FC = () => {
    const [selectedRanges, setSelectedRanges] = useState<{ startDate: Date | null, endDate: Date | null }[]>([]);
    const [statistics, setStatistics] = useState<{ subjectName: string; totalHours: number; }[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [years, setYears] = useState<number[]>([]);
    const [timePeriod, setTimePeriod] = useState<string>('yearly');
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const generatedYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
        setYears(generatedYears);
    }, []);

    const fetchStatistics = async (startDate: string, endDate: string) => {
        try {
            const stats = await getTaskStatistics(1, startDate, endDate);
            setStatistics(stats);
        } catch (error) {
            console.error("통계 데이터 불러오기 오류:", error);
        }
    };

    const handleRangeChange = (dates: any) => {
        if (Array.isArray(dates)) {
            const [start, end] = dates;
            setCustomStartDate(start);
            setCustomEndDate(end);
        } else {
            setCustomStartDate(dates);
            setCustomEndDate(null);
        }
    };

    const handleCustomDateFetch = () => {
        if (customStartDate && customEndDate) {
            fetchStatistics(dayjs(customStartDate).format('YYYY-MM-DD'), dayjs(customEndDate).format('YYYY-MM-DD'));
        } else if (customStartDate) {
            fetchStatistics(dayjs(customStartDate).format('YYYY-MM-DD'), dayjs(customStartDate).format('YYYY-MM-DD'));
        }
    };

    const handleTimePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const period = event.target.value;
        setTimePeriod(period);

        let startDate = new Date();
        let endDate = new Date();

        switch (period) {
            case 'weekly':
                startDate = dayjs().subtract(1, 'week').toDate();
                break;
            case 'monthly':
                startDate = dayjs().subtract(1, 'month').toDate();
                break;
            case 'yearly':
                startDate = dayjs().subtract(1, 'year').toDate();
                break;
        }

        fetchStatistics(dayjs(startDate).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD'));
    };

    const handleResetSelection = () => {
        setCustomStartDate(null);
        setCustomEndDate(null);
        setSelectedRanges([]);
    };

    function convertMinutesToHoursAndMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return { hours, remainingMinutes };
    }

    return (
        <div className="statistics-page">
            <div className="statistics-content">
                <div className="statistics-summary">
                    <h2>통계</h2>
                    <div className="time-period-selector">
                        <label htmlFor="timePeriod">시간 선택: </label>
                        <select id="timePeriod" value={timePeriod} onChange={handleTimePeriodChange}>
                            <option value="weekly">지난 주간</option>
                            <option value="monthly">지난 월간</option>
                            <option value="yearly">지난 년간</option>
                        </select>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Subject</th>
                            <th>누적 공부시간</th>
                        </tr>
                        </thead>
                        <tbody>
                        {statistics.map(stat => {
                            const { hours, remainingMinutes } = convertMinutesToHoursAndMinutes(stat.totalHours);
                            return (
                                <tr key={stat.subjectName}>
                                    <td>{stat.subjectName}</td>
                                    <td>{hours} 시간 {remainingMinutes} 분</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="calendar-container">
                    <Calendar
                        onChange={handleRangeChange}
                        selectRange={true}
                        formatDay={(locale, date) => dayjs(date).format('DD')}
                        className="custom-calendar"
                        tileClassName={({ date }) => {
                            for (const range of selectedRanges) {
                                if (range.startDate && range.endDate && date >= range.startDate && date <= range.endDate) {
                                    return 'selected-date';
                                }
                            }
                            return null;
                        }}
                        value={customStartDate && customEndDate ? [customStartDate, customEndDate] : undefined}
                    />
                    <div className="calendar-buttons">
                        <button onClick={handleCustomDateFetch}>통계 조회</button>
                        <button onClick={handleResetSelection}>초기화</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
