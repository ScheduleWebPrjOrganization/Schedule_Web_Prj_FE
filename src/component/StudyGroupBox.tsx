import AllStudyGroup from "./AllStudyGroup";
import axios from "axios";
import React, {useEffect, useState} from "react";
import './StudyGroupBox.css';

interface StudyGroupBoxProps {
    id: number;
}


const StudyGroupBox: React.FC<StudyGroupBoxProps> = ({ id }) => {
    const [onlyStudyGroup, setOnlyStudyGroup] = useState({
        id: 0,
        memberCount: 0,
        description: '',
        name: '',
        created_at: '',
        members: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/id/${id}`)
            .then(response => {
                setOnlyStudyGroup(response.data);
                setIsLoading(false);
                console.log(response.data); // 데이터 로딩 확인
            })
            .catch(error => {
                console.error('There was an error fetching the study group!', error);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog">
            <div className="title-box">
                <h3>
                    스터디 그룹
                </h3>
                    <hr/>
                <div className="intro">
                    스터디 그룹 설명 / study group description
                </div>
            </div>
            <div className="info">
                <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.</span>
            </div>
            <div className="footer">
                <div className="icon-holder">
                    <span>
                        <i className="fa fa-comment-o"></i>
                        <span>12</span>
                        <i className="fa fa-calendar"></i>
                        <span>03.12.2015</span>
                    </span>
                </div>
            </div>
            <div className="color-overlay"></div>
        </div>);
};

export default StudyGroupBox;