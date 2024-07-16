import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import "../style/CalendarPlan.css";

interface Range {
    startDate: string;
    endDate: string;
}

interface Subject {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
    status: string;
    hoursToComplete: number;
}

interface DateTasks {
    [date: string]: {
        subjects: { [subject: string]: { subjectId: number, tasks: Task[] } };
    };
}

const API_URL = 'http://localhost:8080/api';

async function getSubjectsByMemberId(memberId: number): Promise<Subject[]> {
    const response = await axios.get<Subject[]>(`${API_URL}/subjects/members/${memberId}`);
    return response.data;
}

async function getTasksBySubjectId(subjectId: number): Promise<Task[]> {
    const response = await axios.get<Task[]>(`${API_URL}/subjects/${subjectId}/tasks`);
    return response.data;
}

async function addSubject(memberId: number, subjectName: string): Promise<Subject> {
    const response = await axios.post<Subject>(`${API_URL}/subjects/members/${memberId}`, {
        name: subjectName
    });
    console.log('과목 추가 성공:',response.data);

    return response.data;
}

async function addTaskToSubject(subjectId: number, taskName: string): Promise<void> {
    try {
        if (!subjectId || !taskName) {
            console.error("추가 에러");
            return;
        }
        const response = await axios.post(`${API_URL}/subjects/${subjectId}/tasks`, {
            name: taskName,
            status: "NOT_DONE", // 기본 상태 설정
            hoursToComplete: 1 // 기본 시간 설정 (필요시 수정)
        });
        console.log("Task 추가 성공:", response.data);
    } catch (error) {
        console.error("Task 오류:", error);
    }
}

async function deleteSubject(subjectId: number): Promise<void> {
    try {
        // 과목과 과제 삭제 API 호출
        await axios.delete(`${API_URL}/subjects/${subjectId}`);
        console.log("과목 삭제 성공:", subjectId);
    } catch (error) {
        console.error("과목 삭제 오류:", error);
    }
}

async function deleteTask(taskId: number): Promise<void> {
    try {
        // 과제 삭제 API 호출
        await axios.delete(`${API_URL}/subjects/tasks/${taskId}`);
        console.log("과제 삭제 성공:", taskId);
    } catch (error) {
        console.error("과제 삭제 오류:", error);
    }
}



function CalendarPlan() {
    const location = useLocation();
    const {selectedRanges, newDay} = location.state || {}; // 라우터 location에서 데이터 가져오기
    const [currentDateIndex, setCurrentDateIndex] = useState(0); // 현재 날짜 인덱스 상태
    const [allDates, setAllDates] = useState<Date[]>([]); // 모든 날짜 배열 상태
    const [dateTasks, setDateTasks] = useState<DateTasks>({}); // 날짜별 작업 상태
    const [newSubject, setNewSubject] = useState(""); // 새 과목 입력 상태
    const [newTask, setNewTask] = useState(""); // 새 과제 입력 상태
    const [currentSubject, setCurrentSubject] = useState<string | null>(null); // 현재 선택된 과목 상태
    const [newDayInput, setNewDayInput] = useState<string>(""); // 새 중요 일정 입력 상태
    const [memberId, setMemberId] = useState<number>(1); // memberId 임의의 값 넣음 실제로는 로그인꺼 사용

    // 날짜 범위와 newDay 변경 시 useEffect로 실행
    useEffect(() => {
        const dates: Date[] = [];
        selectedRanges?.forEach((range: Range) => {
            const {startDate, endDate} = range;
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

    const currentDate = allDates[currentDateIndex];
    const currentDateKey = currentDate ? dayjs(currentDate).format("YYYY-MM-DD") : null;


    // 날짜 범위 선택 후 currentDateKey가 변경될 때마다 데이터를 다시 불러오기
    useEffect(() => {
        if (currentDateKey) {
            fetchSubjects(currentDateKey);
        }
    }, [currentDateKey]);

    const fetchSubjects = async (dateKey: string) => {
        try {
            const subjects = await getSubjectsByMemberId(memberId);
            const initialDateTasks = {...dateTasks};
            if (!initialDateTasks[dateKey]) {
                initialDateTasks[dateKey] = {subjects: {}};
            }
            for (const subject of subjects) {
                if (!initialDateTasks[dateKey].subjects[subject.name]) {
                    initialDateTasks[dateKey].subjects[subject.name] = {subjectId: subject.id, tasks: []};
                }
                const tasks = await getTasksBySubjectId(subject.id);
                initialDateTasks[dateKey].subjects[subject.name].tasks = tasks;
            }
            setDateTasks(initialDateTasks);
        } catch (error) {
            console.error("날짜별 과목 및 과제 불러오기 오류:", error);
        }
    };

    // 새 과목 추가 처리 함수
    const addNewSubject = async () => {
        try {
            if (newSubject && currentDateKey) {
                // 과목 추가 API 호출
                const addedSubject = await addSubject(memberId, newSubject);
                const updatedDateTasks = {...dateTasks};
                updatedDateTasks[currentDateKey] = {
                    subjects: {
                        ...updatedDateTasks[currentDateKey]?.subjects,
                        [newSubject]: {subjectId: addedSubject.id, tasks: []},
                    },
                };
                setDateTasks(updatedDateTasks);
                setNewSubject("");
            }
        } catch (error) {
            console.error("과목 추가 오류:", error);
        }
    };

    // 새 과제 추가 처리 함수
    const addNewTask = async () => {
        try {
            if (newTask && currentDateKey && currentSubject && dateTasks[currentDateKey]?.subjects[currentSubject]) {
                const subjectId = dateTasks[currentDateKey].subjects[currentSubject].subjectId;

                // Subject에 Task 추가 API 호출
                await addTaskToSubject(subjectId, newTask);

                // 과제 추가 후 업데이트된 tasks 배열 생성
                const updatedTasks = await getTasksBySubjectId(subjectId);

                const updatedDateTasks = {...dateTasks};
                updatedDateTasks[currentDateKey] = {
                    subjects: {
                        ...updatedDateTasks[currentDateKey].subjects,
                        [currentSubject]: {
                            ...updatedDateTasks[currentDateKey].subjects[currentSubject],
                            tasks: updatedTasks
                        },
                    },
                };
                setDateTasks(updatedDateTasks);
                setNewTask(""); // 입력 필드 초기화
            }
        } catch (error) {
            console.error("과제 추가 오류:", error);
        }
    };

    // 과목 삭제
    // 과목 삭제 처리 함수
    const handleDeleteSubject = async (subjectId: number) => {
        try {
            await deleteSubject(subjectId); // 과목 삭제 API 호출

            setDateTasks(prevDateTasks => {
                const updatedDateTasks = { ...prevDateTasks };

                for (const dateKey in updatedDateTasks) {
                    const subjects = updatedDateTasks[dateKey].subjects;
                    for (const subjectName in subjects) {
                        if (subjects[subjectName].subjectId === subjectId) {
                            delete subjects[subjectName];
                        }
                    }
                }
                return updatedDateTasks;
            });
        } catch (error) {
            console.error("과목 삭제 오류:", error);
        }
    };

    // 과제 삭제
    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId); // 과제 삭제 API 호출

            setDateTasks(prevDateTasks => {
                const updatedDateTasks = { ...prevDateTasks };

                // 각 날짜를 순회하면서 과제를 삭제합니다.
                for (const dateKey in updatedDateTasks) {
                    const subjects = updatedDateTasks[dateKey].subjects;
                    for (const subjectName in subjects) {
                        const subject = subjects[subjectName];
                        subject.tasks = subject.tasks.filter(task => task.id !== taskId);
                    }
                }

                return updatedDateTasks;
            });
        } catch (error) {
            console.error("과제 삭제 오류:", error);
        }
    };

    // 날짜 변경 처리 함수
    const handleDateChange = (index: number) => {
        setCurrentDateIndex(index);
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
                    <input value={newDayInput} onChange={handleNewDayInputChange} placeholder="중요 일정 입력"/>
                    <button onClick={handleAddImportantEvent}>등록</button>
                </div>
                <div className="subject-task">
                    <div className="subject">
                        <h3>과목</h3>
                        <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="새 과목"/>
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
                        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="새 과제"/>
                        <button onClick={addNewTask} disabled={!currentSubject}>과제 추가</button>
                    </div>
                </div>
                {currentDateKey &&
                    dateTasks[currentDateKey] &&
                    Object.entries(dateTasks[currentDateKey].subjects).map(([subject, subjectData]) => (
                        <div className="day-plan" key={subject}>
                            <h3>{subject}</h3>
                            <ul>
                                {subjectData.tasks.map((task, index) => (
                                    <li key={index}>
                                        {task.name}
                                        <button onClick={() => handleDeleteTask(task.id)}>과제 삭제</button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => handleDeleteSubject(subjectData.subjectId)}>과목 삭제</button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default CalendarPlan;
