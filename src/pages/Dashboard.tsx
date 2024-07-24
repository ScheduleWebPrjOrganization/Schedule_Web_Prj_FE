import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./css/dashboard.css";
import { Task, DateTasks } from "./CalendarPlan";
import Timer from "../component/Timer";
import { Button, Modal } from "react-bootstrap";

const API_URL = 'http://localhost:8080/api';

function Dashboard() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [dateTasks, setDateTasks] = useState<DateTasks>({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{ dateKey: string, subjectName: string, taskId: number, taskName: string } | null>(null);

    const goToPreviousDate = () => {
        const previousDate = dayjs(currentDate).subtract(1, 'day');
        setCurrentDate(previousDate.toDate());
    };

    const goToNextDate = () => {
        const nextDate = dayjs(currentDate).add(1, 'day');
        setCurrentDate(nextDate.toDate());
    };

    useEffect(() => {
        fetchSubjectsAndTasks();
    }, [currentDate]);

    const fetchSubjectsAndTasks = async () => {
        try {
            const dateKey = dayjs(currentDate).format("YYYY-MM-DD");
            const memberId = 1;

            const response = await axios.get<Task[]>(`${API_URL}/tasks/members/${memberId}/date/${dateKey}`);
            const tasks: Task[] = response.data;

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

                initialDateTasks[dateKey].subjects[subjectName].tasks.push(task);
            });

            setDateTasks(initialDateTasks);
        } catch (error) {
            console.error("과목 및 과제 불러오기 오류:", error);
        }
    };

    const openModal = (dateKey: string, subjectName: string, taskId: number, taskName: string) => {
        setTaskToDelete({ dateKey, subjectName, taskId, taskName });
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setTaskToDelete(null);
    };

    const confirmDeleteTask = async () => {
        if (taskToDelete) {
            const { dateKey, subjectName, taskId } = taskToDelete;

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

                closeModal();
            } catch (error) {
                console.error("과제 삭제 오류:", error);
            }
        }
    };

    const subjects = dateTasks[dayjs(currentDate).format("YYYY-MM-DD")]
        ? Object.keys(dateTasks[dayjs(currentDate).format("YYYY-MM-DD")].subjects).map(subjectName => ({
            id: dateTasks[dayjs(currentDate).format("YYYY-MM-DD")].subjects[subjectName].subjectId,
            name: subjectName
        }))
        : [];

    return (
        <div className="dashboard">
            <Timer subjects={subjects} />
            <div className="large-container">
                <div className="top-bar">
                    <div className="arrow left-arrow" onClick={goToPreviousDate}>{"<<"}</div>
                    <div className="current-date">{dayjs(currentDate).format("YYYY-MM-DD")}</div>
                    <div className="arrow right-arrow" onClick={goToNextDate}>{">>"}</div>
                </div>
                <div className="subjects-container">
                    {dateTasks[dayjs(currentDate).format("YYYY-MM-DD")] && Object.keys(dateTasks[dayjs(currentDate).format("YYYY-MM-DD")].subjects).map(subjectName => (
                        <div className="subject-card" key={subjectName}>
                            <h3>{subjectName}</h3>
                            <ul>
                                {dateTasks[dayjs(currentDate).format("YYYY-MM-DD")].subjects[subjectName].tasks.map(task => (
                                    <li key={task.id}>
                                        <div>{task.name}</div>
                                        <div>목표 시간: {task.hoursToComplete} 분</div>
                                        <div>실제 시간: {task.actualHours} 분</div>
                                        <div>상태: {task.status}</div>
                                        <Button
                                            variant="danger"
                                            onClick={() => openModal(dayjs(currentDate).format("YYYY-MM-DD"), subjectName, task.id, task.name)}>포기하기
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <Modal show={modalIsOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>과제 삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> 해당 날짜 {taskToDelete && `${taskToDelete.dateKey} - ${taskToDelete.subjectName} - ${taskToDelete.taskName} 과제를 진짜 포기하겠습니까?`}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={confirmDeleteTask}>예</Button>
                    <Button variant="secondary" onClick={closeModal}>아니오</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Dashboard;
