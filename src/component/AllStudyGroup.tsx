import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudyGroupBox from "./StudyGroupBox";
import './AllStudyGroup.css';

interface Member {
    id: number;
    email: string;
    studyGroups: StudyGroup[];
    online: boolean;
    subjects: string[];
}

interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    createdAt: string;
    members: Member[];
}

const AllStudyGroup = () => {
    const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/studygroup')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setStudyGroups(response.data);
                } else {
                    console.error('Response data is not an array:', response.data);
                }
            })
            .catch(error => console.error('There was an error fetching the study groups!', error));
    }, []);

    return (
        <div className="study-group-container">
            {studyGroups.map((studyGroup) => (
                <StudyGroupBox
                    key={studyGroup.id}
                    id={studyGroup.id}
                    name={studyGroup.name}
                    description={studyGroup.description}
                    createdAt={studyGroup.createdAt}
                    memberCount={studyGroup.memberCount}
                />
            ))}
        </div>
    );
};

export default AllStudyGroup;
