import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 스타일

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

    return (
        <div>
            <Calendar
                onChange={onChange}
                value={value}
            />
            <p>Selected Date: {formatValue(value)}</p>
        </div>
    );
};

export default MyCalendar;
