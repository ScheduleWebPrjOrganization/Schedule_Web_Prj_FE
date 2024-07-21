import React, {useEffect, useState} from 'react';
import axios from '../config/AxiosConfig';
import '../Timer.css';

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
const Timer: React.FC<TimerProps> = () => {
    // 타이머의 현재 시간을 문자열로 저장하는 상태
    // const [time, setTime] = useState<string>('00:00:00');
    // 초를 저장하는 상태
    const [seconds, setSeconds] = useState<number>(0);

    // 타이머가 실행 중인지 여부를 나타내는 불리언 상태
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    // setInterval ID를 저장
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    // 마지막으로 정지된 시간을 저장하는 상태
    const [lastStoppedTime, setLastStoppedTime] = useState<string>('00:00:00');
    // 모든 Subject 목록을 저장하는 상태
    const [subjects, setSubjects] = useState<Subject[]>([]);
    // 선택된 Subject의 ID를 저장하는 상태
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

    // 모든 Subject 를 불러오는 함수
    const fetchSubjects = async () => {
        try {
            const response = await axios.get('/api/subjects');
            const subjectsData = Array.isArray(response.data) ? response.data : [];  // 수정: 배열 확인 로직 추가
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setSubjects([]);  // 에러 발생 시 빈 배열로 설정
        }
    };
    // 타이머 시작 함수
    const startTimer = async (): Promise<void> => {
        // Subject가 선택되지 않았을 경우 알림
        if (selectedSubjectId === null) {
            alert('Please select a subject first');
            return;
        }

        try {
            await axios.get(`${apiUrl}/start`, { params: { subject_id: selectedSubjectId } });
            // 타이머가 실행 중이지 않을 경우 setInterval 설정
            if (!intervalId) {
                const newIntervalId = setInterval(() => {
                    setSeconds(prevSeconds => prevSeconds + 1);
                }, 1000);
                setIntervalId(newIntervalId);
            }
            setTimerRunning(true);
            // setTimerRunning(true);  // 타이머를 시작 상태로 설정
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
            setTimerRunning(false);  // 타이머를 일시 정지 상태로 설정
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
            setTimerRunning(true);  // 타이머를 재개 상태로 설정
        } catch (error) {
            console.error('Error resuming the timer:', error);
        }
    };

    // 타이머 정지 및 현재 시간 표시 함수
    const stopTimer = async (): Promise<void> => {
        // Subject가 선택되지 않았을 경우 알림
        if (selectedSubjectId === null) {
            alert('Please select a subject first');
            return;
        }
        try {
            await axios.get(`${apiUrl}/stop`, { params: { subject_id: selectedSubjectId } });
            if (intervalId) clearInterval(intervalId);
            setIntervalId(null);
            setLastStoppedTime(formatTime(seconds)); // 시간 초기화 전 정지된 시간 업데이트
            setSeconds(0); // 시간 초기화
            // const response = await axios.get(`/stop`);
            // setTime(response.data);  // 서버로부터 받은 시간 데이터로 시간을 업데이트
            setTimerRunning(false);  // 타이머를 정지 상태로 설정
        } catch (error) {
            console.error('Error stopping the timer:', error);
        }
    };

    // 컴포넌트가 마운트될 때 모든 Subject를 불러오기
    useEffect(() => {
        fetchSubjects();
    }, []);

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
                    {/*{Array.isArray(subjects) && subjects.map((subject) => (*/}
                    {/*    <option key={subject.id} value={subject.id}>{subject.name}</option>*/}
                    {/*))}*/}
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
            {/*<h1>Timer: {formatTime(seconds)}</h1>*/}

            {/*<h2>마지막 공부시간은: {lastStoppedTime}</h2>  /!* 마지막으로 정지된 시간을 표시 *!/*/}
            {/*/!*<h1>Timer: {time}/</h1>  /!* 화면에 현재 타이머 시간을 표시 *!/*!/*/}
            {/*<button onClick={startTimer} disabled={timerRunning}>Start</button>*/}
            {/*<button onClick={pauseTimer} disabled={!timerRunning}>Pause</button>*/}
            {/*<button onClick={resumeTimer} disabled={timerRunning}>Resume</button>*/}
            {/*<button onClick={stopTimer}>Stop</button>*/}
        </div>
    );
}

export default Timer;


// import React, { useState } from 'react'; // React와 useState 훅을 임포트합니다.
// import axios from '../config/AxiosConfig'; // 프로젝트에 설정된 axios 인스턴스를 임포트합니다.
//
// const Timer = () => { // Timer 컴포넌트를 정의합니다.
//     const [seconds, setSeconds] = useState(0); // 타이머의 시간을 관리하는 state, 초 단위로 저장합니다.
//     const [isActive, setIsActive] = useState(false); // 타이머가 활성화 상태인지 확인하는 state
//
//     // 타이머를 시작하는 함수
//     const startTimer = () => {
//         axios.post('/api/timer/start') // 서버에 타이머 시작을 요청하는 POST 요청을 보냅니다.
//             .then(response => {
//                 console.log('타이머가 시작했습니다'); // 요청이 성공하면 콘솔에 로그를 출력합니다.
//                 setSeconds(0); // 타이머의 시간을 0으로 리셋합니다.
//                 setIsActive(true); // 타이머를 활성 상태로 설정합니다.
//             })
//             .catch(error => {
//                 console.error('Error starting timer', error); // 요청이 실패하면 오류를 콘솔에 로그합니다.
//             });
//     };
//
//     // 타이머를 일시 정지하는 함수
//     const pauseTimer = () => {
//         axios.post('/api/timer/pause') // 서버에 타이머 일시 정지를 요청하는 POST 요청을 보냅니다.
//             .then(response => {
//                 console.log('타이머가 일시정지 했습니다.'); // 요청이 성공하면 콘솔에 로그를 출력합니다.
//                 setIsActive(false); // 타이머를 비활성 상태로 설정합니다.
//             })
//             .catch(error => {
//                 console.error('Error pausing timer', error); // 요청이 실패하면 오류를 콘솔에 로그합니다.
//             });
//     };
//
//     // 타이머를 재개하는 함수
//     const resumeTimer = () => {
//         axios.post('/api/timer/resume') // 서버에 타이머 재개를 요청하는 POST 요청을 보냅니다.
//             .then(response => {
//                 console.log('타이머를 재개합니다.'); // 요청이 성공하면 콘솔에 로그를 출력합니다.
//                 setIsActive(true); // 타이머를 활성 상태로 설정합니다.
//             })
//             .catch(error => {
//                 console.error('Error resuming timer', error); // 요청이 실패하면 오류를 콘솔에 로그합니다.
//             });
//     };
//
//     // 타이머를 중지하는 함수
//     const stopTimer = () => {
//         axios.post('/api/timer/stop') // 서버에 타이머 리셋을 요청하는 POST 요청을 보냅니다.
//             .then(response => {
//                 console.log('타이머를 중지합니다.'); // 요청이 성공하면 콘솔에 로그를 출력합니다.
//                 setIsActive(false); // 타이머를 비활성 상태로 설정합니다.
//                 // setSeconds(0); // 타이머의 시간을 0으로 리셋합니다.
//             })
//             .catch(error => {
//                 console.error('Error resetting timer', error); // 요청이 실패하면 오류를 콘솔에 로그합니다.
//             });
//     };
//
//     // 컴포넌트의 UI 부분
//     return (
//         <div>
//             <h1>Timer: {seconds}s</h1> // 화면에 타이머의 현재 시간을 초 단위로 표시합니다.
//             <button onClick={startTimer}>Start</button> // 'Start' 버튼을 클릭하면 startTimer 함수가 호출됩니다.
//             <button onClick={pauseTimer}>Pause</button> // 'Pause' 버튼을 클릭하면 pauseTimer 함수가 호출됩니다.
//             <button onClick={resumeTimer}>Resume</button> // 'Resume' 버튼을 클릭하면 resumeTimer 함수가 호출됩니다.
//             <button onClick={stopTimer}>Stop</button> // 'Stop' 버튼을 클릭하면 resetTimer 함수가 호출됩니다.
//         </div>
//     );
// };
//
// export default Timer; // Timer 컴포넌트를 내보냅니다.
