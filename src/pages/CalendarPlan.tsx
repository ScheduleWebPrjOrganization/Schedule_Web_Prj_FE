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

export interface Subject {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    name: string;
    hours_to_complete: number;
    member_id: number;
    status: string;
    subject_id: number;
    date_key: string;
}

// 날짜별 과목 및 과제 인터페이스 정의
export interface DateTasks {
    [date: string]: {
        subjects: {
            [subjectName: string]: {
                subjectId: number;
                tasks: Task[];
            };
        };
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

async function addSubject(memberId: number, subjectName: string, dateKey: string): Promise<Subject> {
    const response = await axios.post<Subject>(`${API_URL}/subjects/members/${memberId}`, null, {
        params: {
            subjectName: subjectName,
            dateKey: dateKey
        }
    });
    console.log('과목 추가 성공:', response.data);
    return response.data;
}

async function addTaskToSubject(subjectId: number, taskName: string, dateKey: string, plannedTime: number): Promise<void> {
    try {
        const response = await axios.post(`${API_URL}/subjects/${subjectId}/tasks`, {
            name: taskName,
            status: "NOT_DONE", // 기본 상태 설정
            hoursToComplete: plannedTime,
            dateKey: dateKey
        });
        console.log("Task 추가 성공:", response.data);
    } catch (error) {
        console.error("Task 추가 오류:", error);
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
    const location = useLocation(); // 라우터를 통해 전달된 상태에서 선택된 날짜 범위 및 중요 일정 정보 가져옴
    const { selectedRanges, newDay } = location.state || {}; // 현재 선택된 날짜의 인덱스 상태
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

    // memberId 임의의 값 넣음 실제로는 로그인꺼 사용
    const [memberId, setMemberId] = useState<number>(1); // 추후 수정 필요.
    const currentDate = allDates[currentDateIndex];
    const currentDateKey = currentDate ? dayjs(currentDate).format("YYYY-MM-DD") : null;

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

    // 날짜 범위 선택 후 currentDateKey가 변경될 때마다 데이터를 다시 불러오기
    useEffect(() => {
        if (currentDateKey) {
            fetchSubjects(currentDateKey);
        }
    }, [currentDateKey]);

    const fetchSubjects = async (dateKey: string) => {
        try {
            const subjects = await getSubjectsByMemberId(memberId);
            const initialDateTasks = { ...dateTasks };
            if (!initialDateTasks[dateKey]) {
                initialDateTasks[dateKey] = { subjects: {} };
            }
            for (const subject of subjects) {
                if (!initialDateTasks[dateKey].subjects[subject.name]) {
                    initialDateTasks[dateKey].subjects[subject.name] = { subjectId: subject.id, tasks: [] };
                }
                const tasks = await getTasksBySubjectId(subject.id);
                initialDateTasks[dateKey].subjects[subject.name].tasks = tasks;
            }
            setDateTasks(initialDateTasks);
            setSubjects(subjects);
        } catch (error) {
            console.error("날짜별 과목 및 과제 불러오기 오류:", error);
        }
    };

    // 새 과목 추가 처리 함수
    const addNewSubject = async () => {
        try {
            if (!newSubject.trim()) {
                alert("과목 이름을 입력해주세요.");
                return;
            }

            const subjectExists = subjects.some(subject => subject.name.toLowerCase() === newSubject.trim().toLowerCase());
            if (subjectExists) {
                alert("이미 존재하는 과목입니다.");
                return;
            }

            if (newSubject && currentDateKey) {
                const addedSubject = await addSubject(memberId, newSubject, currentDateKey);
                const updatedDateTasks = { ...dateTasks };
                updatedDateTasks[currentDateKey] = {
                    subjects: {
                        ...updatedDateTasks[currentDateKey]?.subjects,
                        [newSubject]: { subjectId: addedSubject.id, tasks: [] },
                    },
                };
                setDateTasks(updatedDateTasks);
                setNewSubject(""); // 입력 필드 값 초기화
            }
        } catch (error) {
            console.error('Failed to add new subject:', error);
            alert("과목 추가에 실패했습니다.");
        }
    };


    // 새 과제 추가 처리 함수
    const addNewTask = async () => {
        try {
            if (newTask && currentDateKey && currentSubject !== null && Object.keys(dateTasks[currentDateKey]?.subjects).length > 0) {
                // 현재 선택된 과목의 이름을 가져오기
                const subjectNames = Object.keys(dateTasks[currentDateKey].subjects);
                const selectedSubjectName = subjectNames[currentSubject];
                const subjectId = dateTasks[currentDateKey].subjects[selectedSubjectName].subjectId;

                // Subject 에 Task 추가 API 호출
                const hoursToComplete = parseInt(hours) * 60 + parseInt(minutes);
                await addTaskToSubject(subjectId, newTask, currentDateKey, hoursToComplete);

                // 과제 추가 후 업데이트된 tasks 배열 생성
                const updatedTasks = await getTasksBySubjectId(subjectId);

                const updatedDateTasks = { ...dateTasks };
                updatedDateTasks[currentDateKey] = {
                    subjects: {
                        ...updatedDateTasks[currentDateKey].subjects,
                        [selectedSubjectName]: {
                            ...updatedDateTasks[currentDateKey].subjects[selectedSubjectName],
                            tasks: updatedTasks
                        },
                    },
                };
                setDateTasks(updatedDateTasks);
                setNewTask(""); // 과제 입력 필드 초기화
                setHours("");   // 시간 입력 필드 초기화
                setMinutes(""); // 분 입력 필드 초기화
            } else {
                alert("과목을 선택해주세요.");
            }
        } catch (error) {
            console.error("과제 추가 오류:", error);
        }
    };

    // 과목 삭제
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
                        <select
                            onChange={(e) => setCurrentSubject(e.target.value === '' ? null : parseInt(e.target.value))}
                            value={currentSubject === null ? '' : currentSubject}
                        >
                            <option value="">과목 선택</option>
                            {currentDateKey &&
                                Object.keys(dateTasks[currentDateKey]?.subjects || {}).map((subjectName, index) => (
                                    <option key={index} value={index}>
                                        {subjectName}
                                    </option>
                                ))}
                        </select>

                        <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="새 과제"/>
                        <button onClick={addNewTask} disabled={currentSubject === null || newTask.trim() === ''}>과제 추가</button>
                        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="시간"/>
                        <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)}
                               placeholder="분"/>
                    </div>
                </div>
                {currentDateKey &&
                    dateTasks[currentDateKey] &&
                    Object.entries(dateTasks[currentDateKey].subjects).map(([subject, subjectData]) => (
                        <div className="day-plan" key={subject}>
                            <h3>{subject}
                                <button onClick={() => handleDeleteSubject(subjectData.subjectId)}>과목 삭제</button>
                            </h3>
                            <ul>
                                {subjectData.tasks.map((task, index) => (
                                    <li key={index}>
                                        {task.name}
                                        <button onClick={() => handleDeleteTask(task.id)}>과제 삭제</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default CalendarPlan;
