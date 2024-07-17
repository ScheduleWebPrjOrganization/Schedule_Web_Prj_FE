import React, { useState, useEffect } from "react";
import "../style/Dashboard.css";
import axios from "axios";
import dayjs from "dayjs";
import {Task, Subject, DateTasks} from "./CalendarPlan"; // CalendarPlan에서 Subject와 Task 인터페이스 임포트

const API_URL = 'http://localhost:8080/api';

function Dashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [dateTasks, setDateTasks] = useState<DateTasks>({});

    // 이전 날짜로 이동하는 함수
    const goToPreviousDate = () => {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(previousDate);
    };

    // 다음 날짜로 이동하는 함수
    const goToNextDate = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    // 컴포넌트가 마운트되거나 currentDate가 변경될 때 데이터를 불러오기
    useEffect(() => {
        fetchSubjectsAndTasks();
    }, [currentDate]);

    // 과목과 과제 데이터를 가져오는 함수
    const fetchSubjectsAndTasks = async () => {
        try {
            const dateKey = dayjs(currentDate).format("YYYY-MM-DD");
            const responseSubjects = await axios.get<Subject[]>(`${API_URL}/subjects/members/1`); // memberId는 임시로 1로 설정

            const initialDateTasks: DateTasks = {};
            initialDateTasks[dateKey] = { subjects: {} };

            for (const subject of responseSubjects.data) {
                const responseTasks = await axios.get<Task[]>(`${API_URL}/subjects/${subject.id}/tasks`);
                initialDateTasks[dateKey].subjects[subject.name] = {
                    subjectId: subject.id,
                    tasks: responseTasks.data,
                };
            }

            setSubjects(responseSubjects.data);
            setDateTasks(initialDateTasks);
        } catch (error) {
            console.error("과목 및 과제 불러오기 오류:", error);
        }
    };

    return (
        <div className="dashboard">
            <div className="small-container">
                <p>00 : 00 : 00</p>
            </div>
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
    )
}

export { Dashboard };
