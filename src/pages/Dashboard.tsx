import React, { useState, useEffect } from "react";
import "../style/Dashboard.css";
import axios from "axios";
import dayjs from "dayjs";
import { Task, Subject, DateTasks } from "./CalendarPlan"; // CalendarPlan에서 Subject와 Task 인터페이스 임포트
import Timer from "../component/Timer"

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

    useEffect(() => {
        fetchSubjectsAndTasks();
    }, [currentDate]);

    // API를 통해 과목 및 과제 가져오기
    const fetchSubjectsAndTasks = async () => {
        try {
            const dateKey = dayjs(currentDate).format("YYYY-MM-DD");
            const memberId = 1; // 임시로 멤버 ID를 1로 설정

            // API 요청 보내기
            const response = await axios.get<{ subjects: Subject[], tasks: Task[] }>(`${API_URL}/tasks/members/${memberId}/tasks?date=${dateKey}`);
            const subjects = response.data.subjects;
            const tasks = response.data.tasks;

            const initialDateTasks: DateTasks = {};
            initialDateTasks[dateKey] = { subjects: {} };

            // 과목 및 해당 과제 설정
            for (const subject of subjects) {
                initialDateTasks[dateKey].subjects[subject.name] = {
                    subjectId: subject.id,
                    tasks: tasks.filter(task => task.subject_id === subject.id),
                };
            }

            setDateTasks(initialDateTasks);
        } catch (error) {
            console.error("과목 및 과제 불러오기 오류:", error);
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
                                {Object.entries(dateTasks[dateKey].subjects).map(([subject, subjectData]) => (
                                    <li key={subjectData.subjectId}>
                                        <h4>{subject}</h4>
                                        <ul>
                                            {subjectData.tasks.map(task => (
                                                <li key={task.id}>{task.name}</li>
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
