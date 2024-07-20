export interface Member {
    id: number;
    name: string;
    email: string;
    online: boolean;
    subjects: Subject[];
}

export interface Subject {
    id: number;
    name: string;
    dateKey: string;
}

export interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    createdAt: string;
    members?: Member[];
}
