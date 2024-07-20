import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../style/Dashboard.css";
import { Task, DateTasks } from "./CalendarPlan";
import Timer from "../component/Timer";

const API_URL = 'http://localhost:8080/api';

function Dashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dateTasks, setDateTasks] = useState<DateTasks>({});

    // 이전 날짜로 이동
    const goToPreviousDate = () => {
        const previousDate = dayjs(currentDate).subtract(1, 'day');
        setCurrentDate(previousDate.toDate());
    };

    // 다음 날짜로 이동
    const goToNextDate = () => {
        const nextDate = dayjs(currentDate).add(1, 'day');
        setCurrentDate(nextDate.toDate());
    };

    // 날짜 변경 시 과목 및 과제 가져오기
    useEffect(() => {
        fetchSubjectsAndTasks();
    }, [currentDate]);

    // API를 통해 과목 및 과제 가져오기
    const fetchSubjectsAndTasks = async () => {
        try {
            const dateKey = dayjs(currentDate).format("YYYY-MM-DD");
            const memberId = 1; // 임시로 멤버 ID를 1로 설정

            // API 요청 보내기
            const response = await axios.get<Task[]>(`${API_URL}/tasks/members/${memberId}/date/${dateKey}`);
            const tasks: Task[] = response.data;

            // 과목 및 해당 과제 설정
            const initialDateTasks: DateTasks = {};

            tasks.forEach((task: Task) => {
                const subjectName = task.subject.name;
                const subjectId = task.subject.id;

                if (!initialDateTasks[dateKey]) {
                    initialDateTasks[dateKey] = { subjects: {} };
                }

                if (!initialDateTasks[dateKey].subjects[subjectName]) {
                    initialDateTasks[dateKey].subjects[subjectName] = {
                        subjectId: subjectId,
                        tasks: [],
                    };
                }

                // 과제 추가
                initialDateTasks[dateKey].subjects[subjectName].tasks.push(task);
            });

            console.log('Fetched tasks:', tasks);
            console.log('Initial DateTasks:', initialDateTasks);

            setDateTasks(initialDateTasks);
        } catch (error) {
            console.error("과목 및 과제 불러오기 오류:", error);
        }
    };

    // 과제 삭제 핸들러
    const handleDeleteTask = async (dateKey: string, subjectName: string, taskId: number) => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`);

            setDateTasks(prevDateTasks => {
                const updatedDateTasks = { ...prevDateTasks };

                if (updatedDateTasks[dateKey] && updatedDateTasks[dateKey].subjects[subjectName]) {
                    updatedDateTasks[dateKey].subjects[subjectName].tasks = updatedDateTasks[dateKey].subjects[subjectName].tasks.filter(task => task.id !== taskId);

                    if (updatedDateTasks[dateKey].subjects[subjectName].tasks.length === 0) {
                        delete updatedDateTasks[dateKey].subjects[subjectName];
                    }

                    if (Object.keys(updatedDateTasks[dateKey].subjects).length === 0) {
                        delete updatedDateTasks[dateKey];
                    }
                }

                return updatedDateTasks;
            });
        } catch (error) {
            console.error("과제 삭제 오류:", error);
        }
    };

    return (
        <div className="dashboard">
            <Timer />
            <div className="large-container">
                <div className="top-bar">
                    <div className="arrow left-arrow" onClick={goToPreviousDate}>{"<<"}</div>
                    <div className="current-date">{dayjs(currentDate).format("YYYY-MM-DD")}</div>
                    <div className="arrow right-arrow" onClick={goToNextDate}>{">>"}</div>
                </div>
                <div className="subject-task">
                    {Object.keys(dateTasks).map(dateKey => (
                        <div className="date-tasks" key={dateKey}>
                            <ul>
                                {Object.entries(dateTasks[dateKey].subjects).map(([subjectName, subjectData]) => (
                                    <li key={subjectData.subjectId}>
                                        <h3>{subjectName}</h3>
                                        <ul>
                                            {subjectData.tasks.map(task => (
                                                <li key={task.id}>
                                                    {task.name}
                                                    <button onClick={() => handleDeleteTask(dateKey, subjectName, task.id)}>삭제</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
