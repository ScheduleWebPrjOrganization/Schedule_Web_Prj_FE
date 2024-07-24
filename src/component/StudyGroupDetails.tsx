import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StudyGroup, Member, Subject } from "../types";
import './StudyGroupDetails.css';
import { Task } from "../pages/CalendarPlan"

const StudyGroupDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tasksBySubject, setTasksBySubject] = useState<{ [key: number]: Task[] }>({});

    useEffect(() => {
        axios.get(`http://localhost:8080/api/studygroup/id/${id}`)
            .then(response => {
                setStudyGroup(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the study group details!', error);
                setIsLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (studyGroup && studyGroup.members) {
            studyGroup.members.forEach(member => {
                if (member.subjects) {
                    member.subjects.forEach(subject => {
                        axios.get(`http://localhost:8080/api/subjects/${subject.id}/tasks`)
                            .then(response => {
                                setTasksBySubject(prev => ({
                                    ...prev,
                                    [subject.id]: response.data
                                }));
                            })
                            .catch(error => {
                                console.error(`Error fetching tasks for subject ${subject.id}`, error);
                            });
                    });
                }
            });
        }
    }, [studyGroup]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!studyGroup) {
        return <div>Study group not found.</div>;
    }

    return (
        <div className="study-group-details">
            <h2>{studyGroup.name}</h2>
            <p>{studyGroup.description}</p>
            <p>생성 날짜: {studyGroup.createdAt}</p>
            <p>멤버 수: {studyGroup.memberCount}</p>
            <h3>멤버 목록</h3>
            <ul>
                {studyGroup.members && studyGroup.members.map((member: Member) => (
                    <li key={member.id}>
                        <p>이름: {member.name}</p>
                        <p className="online-status">온라인 여부: {member.online ? '온라인' : '오프라인'}</p>
                        {member.online && member.subjects && (
                            <div>
                                <p className="subjects"></p>
                                <ul>
                                    {member.subjects.map((subject: Subject) => (
                                        <li key={subject.id}>
                                            공부 과목 : {subject.name}
                                            {tasksBySubject[subject.id] && (
                                                <ul className="tasks"> Tasks:
                                                    {tasksBySubject[subject.id].map((task: Task) => (
                                                        <p key={task.id}>{task.name}</p>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudyGroupDetails;
