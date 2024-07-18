import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Simulate} from "react-dom/test-utils";
import StudyGroupBox from "./StudyGroupBox";
import './AllStudyGroup.css';


interface Member {
    id: number;
    email: string;
    studyGroups: StudyGroup[];
    online: boolean;
};

interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    created_at: string;
    members: Member[];
};

const AllStudyGroup = () => {
    const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

    useEffect(() => {
        // 모든 스터디 그룹을 가져와서 state에 저장
        axios.get('http://localhost:8080/studygroup')
            .then(response=> setStudyGroups(response.data))
            .catch(error => console.error('There was an error fetching the study groups!', error));

    }, []);


    return (
        <div className="study-group-container">
            {studyGroups.map((studyGroup) => (
                <StudyGroupBox key={studyGroup.id} {...studyGroup} />
            ))}
        </div>
    );
};

export default AllStudyGroup;