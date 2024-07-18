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
    const [targetCardID, setTargetCardID] = useState("");

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
        return <div>Loading...</div>;
    }

    return (<div className="container noselect">
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
                    {onlyStudyGroup.name}
                </p>
                <div className="title">
                    {onlyStudyGroup.description}
                </div>
                <div className="subtitle">
                    {onlyStudyGroup.created_at}
                </div>

            </div>
        </div>
    </div>)
};
export default StudyGroupBox;