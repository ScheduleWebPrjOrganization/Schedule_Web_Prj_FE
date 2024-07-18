
export interface Member {
    id: number;
    email: string;
    studyGroups: StudyGroup[];
    online: boolean;
};

export interface StudyGroup {
    id: number;
    memberCount: number;
    description: string;
    name: string;
    created_at: string;
    members: Member[];
};