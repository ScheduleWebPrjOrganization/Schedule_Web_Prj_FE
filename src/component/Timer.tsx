import React, { useEffect, useState } from 'react';
import axios from '../config/AxiosConfig';
import './css/Timer.css';

// TimerProps 인터페이스는 현재 비어 있지만, 필요한 경우 타이머 컴포넌트에 전달할 프로퍼티를 정의하는 데 사용할 수 있습니다.
interface TimerProps {
    subjects?: Subject[];  // subjects는 선택적으로 받도록 하고 기본값을 빈 배열로 설정할 수 있습니다.
}

// Subject 인터페이스 정의
interface Subject {
    id: number;
    name: string;
}

// Timer 컴포넌트 정의
const Timer: React.FC<TimerProps> = ({ subjects = [] }) => {
    const [seconds, setSeconds] = useState<number>(0);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [lastStoppedTime, setLastStoppedTime] = useState<string>('00:00:00');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

    // 시간을 시:분:초 형식으로 변환하는 함수
    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // 서버 API 의 기본 URL
    const apiUrl: string = '/api/timer';

    // 타이머 시작 함수
    const startTimer = async (): Promise<void> => {
        if (selectedSubjectId === null) {
            alert('Please select a subject first');
            return;
        }

        try {
            await axios.get(`${apiUrl}/start`, { params: { subject_id: selectedSubjectId } });
            if (!intervalId) {
                const newIntervalId = setInterval(() => {
                    setSeconds(prevSeconds => prevSeconds + 1);
                }, 1000);
                setIntervalId(newIntervalId);
            }
            setTimerRunning(true);
        } catch (error) {
            console.error('Error starting the timer:', error);
        }
    };

    // 타이머 일시정지 함수
    const pauseTimer = async (): Promise<void> => {
        try {
            await axios.get(`${apiUrl}/pause`);
            if (intervalId) clearInterval(intervalId);
            setIntervalId(null);
            setTimerRunning(false);
        } catch (error) {
            console.error('Error pausing the timer:', error);
        }
    };

    // 타이머 재개 함수
    const resumeTimer = async (): Promise<void> => {
        try {
            await axios.get(`${apiUrl}/resume`);
            if (!intervalId) {
                const newIntervalId = setInterval(() => {
                    setSeconds(prevSeconds => prevSeconds + 1);
                }, 1000);
                setIntervalId(newIntervalId);
            }
            setTimerRunning(true);
        } catch (error) {
            console.error('Error resuming the timer:', error);
        }
    };

    // 타이머 정지 및 현재 시간 표시 함수
    const stopTimer = async (): Promise<void> => {
        if (selectedSubjectId === null) {
            alert('Please select a subject first');
            return;
        }
        try {
            await axios.get(`${apiUrl}/stop`, { params: { subject_id: selectedSubjectId } });
            if (intervalId) clearInterval(intervalId);
            setIntervalId(null);
            setLastStoppedTime(formatTime(seconds));
            setSeconds(0);
            setTimerRunning(false);
        } catch (error) {
            console.error('Error stopping the timer:', error);
        }
    };

    // 컴포넌트가 언마운트 될 때 인터벌 정리
    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div className="timer-container">
            {/* 과목 선택 드롭다운 */}
            <div className="subject-selector">
                <label htmlFor="subject-select">과목 선택: </label>
                <select
                    id="subject-select"
                    value={selectedSubjectId ?? ''}
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                >
                    <option value="" disabled>과목을 선택하세요</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
            </div>
            {/* 타이머 디스플레이 */}
            <div className="timer-display">{formatTime(seconds)}</div>
            <div className="last-time">마지막 공부시간: {lastStoppedTime}</div>
            {/* 타이머 컨트롤 버튼 */}
            <div className="controls">
                <button onClick={startTimer} disabled={timerRunning}>시작</button>
                <button onClick={pauseTimer} disabled={!timerRunning}>일시정지</button>
                <button onClick={resumeTimer} disabled={timerRunning}>다시 시작</button>
                <button onClick={stopTimer}>정지</button>
            </div>
        </div>
    );
}

export default Timer;
