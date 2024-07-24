import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 스타일
import '../style/Calendar.css'; // 커스텀 스타일

const MyCalendar: React.FC = () => {
    const [value, setValue] = useState<Date | [Date, Date]>(new Date());

    const onChange: CalendarProps['onChange'] = (value) => {
        setValue(value as Date | [Date, Date]);
    };

    const formatValue = (value: Date | [Date, Date]): string => {
        if (Array.isArray(value)) {
            return value.map(date => date.toDateString()).join(' - ');
        }
        return value.toDateString();
    };

    // 날짜 칸에 추가 정보를 렌더링하는 함수
    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        // view가 'month'인 경우에만 추가 정보를 표시
        if (view === 'month') {
            return (
                <div className="custom-tile-content">
                    <p>추가 정보</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <Calendar
                onChange={onChange}
                value={value}
                tileContent={tileContent} // tileContent prop 추가
            />
            <p>Selected Date: {formatValue(value)}</p>
        </div>
    );
};

export default MyCalendar;
