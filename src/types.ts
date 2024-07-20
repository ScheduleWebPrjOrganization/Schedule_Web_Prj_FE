export interface Member {
    id: number;
    email: string;
    studyGroups: StudyGroup[];
    online: boolean;
    subjects: string[];
}

export interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    createdAt: string;
    members: Member[];
}
