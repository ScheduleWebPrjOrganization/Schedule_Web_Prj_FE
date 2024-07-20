import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StudyGroup, Member, Subject } from "../types";
import './StudyGroupDetails.css';

const StudyGroupDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/studygroup/id/${id}`)
            .then(response => {
                setStudyGroup(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the study group details!', error);
                setIsLoading(false);
            });
    }, [id]);

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
                        {member.online && (
                            <p className="subjects">공부 과목: {member.subjects.map((subject: Subject) => subject.name).join(', ')}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudyGroupDetails;
