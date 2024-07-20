export interface Member {
    id: number;
    name: string;
    email: string;
    online: boolean;
    subjects?: Subject[]; // subjects 필드를 선택적으로 변경
}

//주석 처리는 공부 시간 관련임
export interface Subject {
    id: number;
    name: string;
    dateKey: string;
    // subjectRecords: SubjectRecord[];
}

// export interface SubjectRecord {
//     id: number;
//     recordedAt: string;
//     stoppedAt: string;
//     pausedAt?: string;
//     pausedDuration: number;
// }

export interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    createdAt: string;
    members?: Member[];
}
