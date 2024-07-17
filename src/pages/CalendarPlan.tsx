import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import "../style/CalendarPlan.css";

// 날짜 범위 인터페이스 정의
interface Range {
    startDate: string;
    endDate: string;
}

// 날짜별 과목 및 과제 인터페이스 정의
interface DateTasks {
    [date: string]: {
        subjects: { [subjectId: number]: string[] };
    };
}

// 과제 데이터 인터페이스 정의
interface TaskData {
    name: string;
    hoursToComplete: number;
    status: 'DONE' | 'IN_PROGRESS' | 'NOT_DONE';
    memberId: number;
    subjectId: number;
    createdAt: string;
    plannedDate: string;
}

interface Subject {
    id: number;
    name: string;
}

const API_URL = 'http://localhost:8080/api';

function CalendarPlan() {
    const location = useLocation();                                             // 라우터를 통해 전달된 상태에서 선택된 날짜 범위 및 중요 일정 정보 가져옴
    const { selectedRanges, newDay } = location.state || {};                                  // 현재 선택된 날짜의 인덱스 상태
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [allDates, setAllDates] = useState<Date[]>([]);
    const [dateTasks, setDateTasks] = useState<DateTasks>({});
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubject, setNewSubject] = useState("");
    const [newTask, setNewTask] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [currentSubject, setCurrentSubject] = useState<number | null>(null);
    const [newDayInput, setNewDayInput] = useState("");
    const [memberId, setMemberId] = useState<number>(1);        // 추후 수정 필요.

    // 페이지 로드 시 과목 정보를 가져오는 useEffect
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const response = await axios.get(`${API_URL}/subjects`);
                const uniqueSubjects = new Map<number, Subject>();      // Map의 key를 number 타입으로, value를 Subject 타입으로 명시
                response.data.forEach((subject: Subject) => {                           // subject 파라미터에 Subject 타입 명시
                    uniqueSubjects.set(subject.id, subject);
                });
                setSubjects(Array.from(uniqueSubjects.values()));  // Map의 values를 배열로 변환하여 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
            }
        }
        fetchSubjects();
    }, []);


    async function fetchSubject() {
        try {
            const response = await axios.get(`${API_URL}/subjects`);
            setSubjects(response.data);
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
        }
    }

    // 날짜 범위가 변경될 때 선택된 날짜들을 업데이트하는 useEffect
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
        setNewDayInput(newDay || "");
    }, [selectedRanges, newDay]);

    // 새 과목을 추가하는 함수
    const addNewSubject = async () => {
        if (!newSubject.trim()) {
            alert("과목 이름을 입력해주세요.");    // 과목 이름이 공백일 경우 경고
            return;
        }

        // 입력된 과목 이름의 공백을 제거한 후 중복 검사 수행
        const subjectExists = subjects.some(subject => subject.name.toLowerCase() === newSubject.trim().toLowerCase());
        if (subjectExists) {
            alert("이미 존재하는 과목입니다.");
            return;
        }

        try {
            const response = await axios.post<Subject>(`${API_URL}/subjects/members/${memberId}`, { name: newSubject.trim() });
            setSubjects(prevSubjects => [...prevSubjects, response.data]); // 기존 목록에 새 과목 추가
            setNewSubject(""); // 입력 필드 초기화
        } catch (error) {
            console.error('Failed to add new subject:', error);
            alert("과목 추가에 실패했습니다.");
        }
    };
    // 현재 선택된 날짜를 포맷팅하여 plannedDate 로 저장
    const plannedDate = dayjs(allDates[currentDateIndex]).format("YYYY-MM-DD"); // 선택된 날짜를 포맷팅

    // 새로운 과제를 추가하는 함수
    const addTask = async () => {
        if (newTask && currentSubject && hours && minutes) {
            const taskData: TaskData = {
                name: newTask,
                hoursToComplete: parseInt(hours) * 60 + parseInt(minutes),
                status: 'NOT_DONE',
                memberId: memberId,
                subjectId: currentSubject,
                createdAt: new Date().toISOString().slice(0, 10),
                plannedDate: plannedDate                    // plannedDate 추가, 과제가 예정된 날짜
            };

            const response = await axios.post(`${API_URL}/subjects/${currentSubject}/tasks`, taskData);
            const newTaskName = response.data.name;
            const currentDateKey = dayjs(new Date()).format("YYYY-MM-DD");

            const updatedTasks = dateTasks[currentDateKey]?.subjects[currentSubject] || [];
            updatedTasks.push(newTaskName);

            setDateTasks({
                ...dateTasks,
                [currentDateKey]: {
                    subjects: {
                        ...dateTasks[currentDateKey]?.subjects,
                        [currentSubject]: updatedTasks,
                    }
                }
            });

            setNewTask(""); // 과제 입력 필드 초기화
            setHours("");   // 시간 입력 필드 초기화
            setMinutes(""); // 분 입력 필드 초기화
        }
    };

    // 현재 날짜 인덱스를 변경하는 함수
    const handleDateChange = (index: number) => {
        setCurrentDateIndex(index);
    };

    // 현재 선택된 날짜를 포맷팅하여 currentDateKey 로 저장
    const currentDate = allDates[currentDateIndex];
    const currentDateKey = currentDate ? dayjs(currentDate).format("YYYY-MM-DD") : null;

    return (
        <div className="calendar-plan-page">
            <div className="container">
                <div className="date-bar">
                    <button onClick={() => handleDateChange(currentDateIndex - 1)} disabled={currentDateIndex === 0}>{"<<"}</button>
                    <div className="current-date">{currentDate?.toLocaleDateString()}</div>
                    <button onClick={() => handleDateChange(currentDateIndex + 1)} disabled={currentDateIndex === allDates.length - 1}>{">>"}</button>
                </div>
                <div className="day">
                    <input value={newDayInput} onChange={(e) => setNewDayInput(e.target.value)} placeholder="중요 일정 입력" />
                    <button onClick={() => { console.log(`중요 일정 추가: ${newDayInput} - 날짜: ${currentDateKey}`); }}>등록</button>
                </div>
                <div className="subject-task">
                    <div className="subject">
                        <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="새 과목" />
                        <button onClick={addNewSubject}>과목 추가</button>
                    </div>
                    <div className="task">
                        <select onChange={(e) => setCurrentSubject(parseInt(e.target.value))} value={currentSubject || ''}>
                            <option value="">과목 선택</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                        </select>
                        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="새 과제" />
                        <button onClick={addTask} disabled={!currentSubject}>과제 추가</button>
                        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="시간" />
                        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="분" />
                    </div>
                </div>
                {currentDateKey && dateTasks[currentDateKey] && Object.entries(dateTasks[currentDateKey].subjects).map(([subjectId, tasks]) => (
                    <div key={subjectId} className="day-plan">
                        <h3>{subjects.find(s => s.id === parseInt(subjectId))?.name}</h3>
                        <ul>{tasks.map((task, index) => (<li key={index}>{task}</li>))}</ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarPlan;
