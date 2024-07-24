import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import "../style/CalendarPlan.css";

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
    hoursToComplete: number;
    member_id: number;
    status: string;
    subject_id: number;
    date_key: string;
    subject: Subject;
}

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

// 과목 불러오기
async function getSubjectsByMemberId(memberId: number): Promise<Subject[]> {
    const response = await axios.get<Subject[]>(`${API_URL}/subjects/members/${memberId}`);
    return response.data;
}

// 과제 불러오기
async function getTasksBySubjectId(subjectId: number): Promise<Task[]> {
    const response = await axios.get<Task[]>(`${API_URL}/subjects/${subjectId}/tasks`);
    return response.data;
}

// 새로운 과목 추가하기
async function addSubject(memberId: number, subjectName: string, dateKey: string): Promise<Subject> {
    const response = await axios.post<Subject>(`${API_URL}/subjects/members/${memberId}`, null, {
        params: {
            subjectName: subjectName,
            dateKey: dateKey
        }
    });
    return response.data;
}

// 새로운 과제 추가하기
async function addTaskToSubject(subjectId: number, taskName: string, dateKey: string, plannedTime: number): Promise<void> {
    const taskData = {
        name: taskName,
        status: "NOT_DONE",
        hoursToComplete: plannedTime,
        dateKey: dateKey
    };

    console.log("Sending Task Data:", taskData); // 디버깅 로그 추가

    await axios.post(`${API_URL}/subjects/${subjectId}/tasks`, taskData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// 과목 삭제하기
async function deleteSubject(subjectId: number): Promise<void> {
    await axios.delete(`${API_URL}/subjects/${subjectId}`);
}

// 과제 삭제하기
async function deleteTask(taskId: number): Promise<void> {
    await axios.delete(`${API_URL}/subjects/tasks/${taskId}`);
}

function CalendarPlan() {
    const location = useLocation();
    const { selectedRanges, newDay } = location.state || {};
    const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);
    const [allDates, setAllDates] = useState<Date[]>([]);
    const [dateTasks, setDateTasks] = useState<DateTasks>({});
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubject, setNewSubject] = useState<string>("");
    const [newTask, setNewTask] = useState<string>("");
    const [hours, setHours] = useState<string>("");
    const [minutes, setMinutes] = useState<string>("");
    const [currentSubject, setCurrentSubject] = useState<number | null>(null);
    const [newDayInput, setNewDayInput] = useState<string>("");

    const [memberId, setMemberId] = useState<number>(1);
    const currentDate = allDates[currentDateIndex];
    const currentDateKey = currentDate ? dayjs(currentDate).format("YYYY-MM-DD") : null;

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

                setSubjects(prevSubjects => [...prevSubjects, addedSubject]);
                const updatedDateTasks = { ...dateTasks };
                updatedDateTasks[currentDateKey] = {
                    subjects: {
                        ...updatedDateTasks[currentDateKey]?.subjects,
                        [newSubject]: { subjectId: addedSubject.id, tasks: [] },
                    },
                };
                setDateTasks(updatedDateTasks);
                setNewSubject("");
            }
        } catch (error) {
            console.error('Failed to add new subject:', error);
            alert("과목 추가에 실패했습니다.");
        }
    };

    const addNewTask = async () => {
        try {
            if (newTask && currentDateKey && currentSubject !== null && Object.keys(dateTasks[currentDateKey]?.subjects).length > 0) {
                const subjectNames = Object.keys(dateTasks[currentDateKey].subjects);
                const selectedSubjectName = subjectNames[currentSubject];
                const subjectId = dateTasks[currentDateKey].subjects[selectedSubjectName].subjectId;

                const hoursToComplete = parseInt(hours) * 60 + parseInt(minutes);

                const doesTaskExist = (tasks: Task[], taskName: string) => {
                    return tasks.some(task => task.name === taskName);
                };

                for (const date of allDates) {
                    const dateKey = dayjs(date).format("YYYY-MM-DD");

                    if (!dateTasks[dateKey]) {
                        dateTasks[dateKey] = { subjects: {} };
                    }

                    if (!dateTasks[dateKey].subjects[selectedSubjectName]) {
                        dateTasks[dateKey].subjects[selectedSubjectName] = { subjectId: subjectId, tasks: [] };
                    }

                    if (!doesTaskExist(dateTasks[dateKey].subjects[selectedSubjectName].tasks, newTask)) {
                        await addTaskToSubject(subjectId, newTask, dateKey, hoursToComplete);

                        const updatedTasks = await getTasksBySubjectId(subjectId);
                        dateTasks[dateKey].subjects[selectedSubjectName].tasks = updatedTasks;
                    }
                }

                setDateTasks({ ...dateTasks });
                setNewTask("");
                setHours("");
                setMinutes("");
            } else {
                alert("과목을 선택해주세요.");
            }
        } catch (error) {
            console.error("과제 추가 오류:", error);
            alert("과제 추가에 실패했습니다.");
        }
    };

    const handleDeleteSubject = async (subjectId: number) => {
        try {
            await deleteSubject(subjectId);

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

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId);

            const updatedDateTasks = { ...dateTasks };
            for (const dateKey in updatedDateTasks) {
                const subjects = updatedDateTasks[dateKey].subjects;
                for (const subjectName in subjects) {
                    const subject = subjects[subjectName];
                    subject.tasks = subject.tasks.filter(task => task.id !== taskId);
                }
            }

            setDateTasks(updatedDateTasks);
        } catch (error) {
            console.error("과제 삭제 오류:", error);
            alert("과제 삭제에 실패했습니다.");
        }
    };

    const handleDateChange = (index: number) => {
        setCurrentDateIndex(index);
    };

    const handleNewDayInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewDayInput(event.target.value);
    };

    const handleAddImportantEvent = () => {
        if (newDayInput && currentDateKey) {
            console.log(`중요 일정 추가: ${newDayInput} - 날짜: ${currentDateKey}`);
        }
    };

    return (
        <div className="calendar-plan-page">
            <div className="calendar-plan-container">
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
                        <button onClick={addNewTask} disabled={currentSubject === null || newTask.trim() === ''}>과제 추가
                        </button>
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
                                {Array.from(new Set(subjectData.tasks.map(task => task.name))).map((taskName, index) => (
                                    <li key={index}>
                                        {taskName}
                                        <button
                                            onClick={() => handleDeleteTask(subjectData.tasks.find(task => task.name === taskName)!.id)}>과제
                                            삭제
                                        </button>
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
