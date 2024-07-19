import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StudyGroup, Member } from "../types";
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
            <ul>
                {studyGroup.members.map((member: Member) => (
                    <li key={member.id}>
                        {member.email}
                        {member.online ? (
                            <span> (Online, studying: {member.subjects.join(", ")})</span>
                            ) : (
                            <span> (Offline)</span>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudyGroupDetails;
