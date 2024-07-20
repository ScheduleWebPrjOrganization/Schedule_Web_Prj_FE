import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./StudyGroupCheckModal";
import StudyGroupLoading from "./StudyGroupLoading";
import './StudyGroupBox.css';
import { useNavigate } from "react-router-dom";
import { Member, StudyGroup } from "../types";

interface StudyGroupBoxProps {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    memberCount: number;
}

const StudyGroupBox: React.FC<StudyGroupBoxProps> = ({ id, name, description, createdAt, memberCount }) => {
    const [onlyStudyGroup, setOnlyStudyGroup] = useState<StudyGroup>({
        id: 0,
        memberCount: 0,
        description: '',
        name: '',
        createdAt: '',
        members: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [targetCardID, setTargetCardID] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

    useEffect(() => {
        axios.get(`http://localhost:8080/studygroup/id/${id}`)
            .then(response => {
                setOnlyStudyGroup(response.data);
                setIsLoading(false);
                const targetCardID = id % 7;
                const tempTargetCardID2 = "card_" + targetCardID;
                setTargetCardID(tempTargetCardID2);

                console.log(response.data); // 데이터 로딩 확인
            })
            .catch(error => {
                console.error('There was an error fetching the study group!', error);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <div>
                <StudyGroupLoading />
            </div>
        );
    }

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const navigateToDetails = () => {
        setShowModal(false);
        navigate(`/studygroup/${id}`);
    };

    return (
        <div className="container noselect" onClick={handleCardClick}>
            <div className="canvas">
                <div className="tracker tr-1"></div>
                <div className="tracker tr-2"></div>
                <div className="tracker tr-3"></div>
                <div className="tracker tr-4"></div>
                <div className="tracker tr-5"></div>
                <div className="tracker tr-6"></div>
                <div className="tracker tr-7"></div>
                <div className="tracker tr-8"></div>
                <div className="tracker tr-9"></div>
                <div className="tracker tr-10"></div>
                <div className="tracker tr-11"></div>
                <div className="tracker tr-12"></div>
                <div className="tracker tr-13"></div>
                <div className="tracker tr-14"></div>
                <div className="tracker tr-15"></div>
                <div className="tracker tr-16"></div>
                <div className="tracker tr-17"></div>
                <div className="tracker tr-18"></div>
                <div className="tracker tr-19"></div>
                <div className="tracker tr-20"></div>
                <div className="tracker tr-21"></div>
                <div className="tracker tr-22"></div>
                <div className="tracker tr-23"></div>
                <div className="tracker tr-24"></div>
                <div className="tracker tr-25"></div>

                <div id={targetCardID}>
                    <p id="prompt">스터디 그룹:
                        <br></br>
                        {name}
                    </p>
                    <div className="title">
                        {description}
                    </div>
                    <div className="subtitle">
                        {createdAt}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={handleCloseModal}>
                <h2>{onlyStudyGroup.name}</h2>
                <p>{onlyStudyGroup.description}</p>
                <p>생성 날짜: {onlyStudyGroup.createdAt}</p>
                <p>멤버 수: {onlyStudyGroup.memberCount}</p>
                <button onClick={navigateToDetails}>자세히 보기</button>
            </Modal>
        </div>
    );
};

export default StudyGroupBox;
