import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import "../style/CalendarPlan.css";

interface Range {
    startDate: string;
    endDate: string;
}

interface DateTasks {
    [date: string]: {
        subjects: { [subject: string]: string[] };
    };
}

interface Subject {
    id: number;
    name: string;
}

const API_URL = 'http://localhost:8080/api'

async function getSubjectsByMemberId(memberId: number) {
    const response = await axios.get(`${API_URL}/subjects/members/${memberId}`);
    return response.data;
}

async function addSubject(memberId: number, subjectName: string) {
    const response = await axios.post(`${API_URL}/subjects/members/${memberId}`, {
        name: subjectName
    });
    return response.data;
}

async function addTaskToSubject(subjectId: number, taskName: string) {
    const response = await axios.post(`${API_URL}/subjects/${subjectId}/tasks`, {
        name: taskName,
    });
    return response.data;
}

function CalendarPlan() {
    const location = useLocation();
    const { selectedRanges, newDay } = location.state || {}; // 라우터 location에서 데이터 가져오기
    const [currentDateIndex, setCurrentDateIndex] = useState(0); // 현재 날짜 인덱스 상태
    const [allDates, setAllDates] = useState<Date[]>([]); // 모든 날짜 배열 상태
    const [dateTasks, setDateTasks] = useState<DateTasks>({}); // 날짜별 작업 상태
    const [newSubject, setNewSubject] = useState(""); // 새 과목 입력 상태
    const [newTask, setNewTask] = useState(""); // 새 과제 입력 상태
    const [currentSubject, setCurrentSubject] = useState<string | null>(null); // 현재 선택된 과목 상태
    const [newDayInput, setNewDayInput] = useState<string>(""); // 새 중요 일정 입력 상태
    //memberId 임의의 값 넣음 실제로는 로그인꺼 사용
    const [memberId, setMemberId] = useState<number>(1);


    // 날짜 범위와 newDay 변경 시 useEffect로 실행
    useEffect(() => {
        const dates: Date[] = [];
        selectedRanges?.forEach((range: Range) => {
            const { startDate, endDate } = range;
            if (startDate && endDate) {
                let currentDate = new Date(startDate);
                while (currentDate <= new Date(endDate)) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
        setAllDates(dates);
        setNewDayInput(newDay || ""); // newDay 값 설정
    }, [selectedRanges, newDay]);

    // 날짜 변경 처리 함수
    const handleDateChange = (index: number) => {
        setCurrentDateIndex(index);
    };

    // 새 과목 추가 처리 함수
    const addNewSubject = async () => {
        if (newSubject && currentDateKey) {
            //과목 추가 api
            const addedSubject = await addSubject(memberId, newSubject);
            setDateTasks({
                ...dateTasks,
                [currentDateKey]: {
                    subjects: {
                        ...dateTasks[currentDateKey]?.subjects,
                        [newSubject]: [],
                    },
                },
            });
            setNewSubject("");
        }

    };

    // 새 과제 추가 처리 함수
    const addTask = async () => {
        if (newTask && currentDateKey && currentSubject && dateTasks[currentDateKey]?.subjects[currentSubject]) {
            const task = await addTaskToSubject(parseInt(currentSubject), newTask);
            const updatedTasks = [...dateTasks[currentDateKey].subjects[currentSubject], newTask];
            setDateTasks({
                ...dateTasks,
                [currentDateKey]: {
                    subjects: {
                        ...dateTasks[currentDateKey].subjects,
                        [currentSubject]: updatedTasks,
                    },
                },
            });
            setNewTask("");
        }
    };

    // 새 중요 일정 입력 핸들러
    const handleNewDayInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDayInput(event.target.value);
    };

    // 중요 일정 추가 처리 함수
    const handleAddImportantEvent = () => {
        if (newDayInput && currentDateKey) {
            console.log(`중요 일정 추가: ${newDayInput} - 날짜: ${currentDateKey}`);
        }
    };

    // 현재 선택된 날짜
    const currentDate = allDates[currentDateIndex];
    const currentDateKey = currentDate ? dayjs(currentDate).format("YYYY-MM-DD") : null;

    return (
        <div className="calendar-plan-page">
            <div className="container">
                <div className="date-bar">
                    <button
                        className="arrow left-arrow"
                        onClick={() => handleDateChange(currentDateIndex - 1)}
                        disabled={currentDateIndex === 0}
                    >
                        {"<<"}
                    </button>
                    <div className="current-date">{currentDate?.toLocaleDateString()}</div>
                    <button
                        className="arrow right-arrow"
                        onClick={() => handleDateChange(currentDateIndex + 1)}
                        disabled={currentDateIndex === allDates.length - 1}
                    >
                        {">>"}
                    </button>
                </div>
                <div className="day">
                    <input value={newDayInput} onChange={handleNewDayInputChange} placeholder="중요 일정 입력" />
                    <button onClick={handleAddImportantEvent}>등록</button>
                </div>
                <div className="subject-task">
                    <div className="subject">
                        <h3>과목</h3>
                        <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="새 과목" />
                        <button onClick={addNewSubject}>과목 추가</button>
                    </div>
                    <div className="task">
                        <h3>과제</h3>
                        <select onChange={(e) => setCurrentSubject(e.target.value)}>
                            <option>과목 선택</option>
                            {currentDateKey &&
                                Object.keys(dateTasks[currentDateKey]?.subjects || {}).map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                        </select>
                        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="새 과제" />
                        <button onClick={addTask} disabled={!currentSubject}>
                            과제 추가
                        </button>
                    </div>
                </div>
                {currentDateKey &&
                    dateTasks[currentDateKey] &&
                    Object.entries(dateTasks[currentDateKey].subjects).map(([subject, tasks]) => (
                        <div className="day-plan" key={subject}>
                            <h3>{subject}</h3>
                            <ul>
                                {tasks.map((task, index) => (
                                    <li key={index}>{task}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default CalendarPlan;
