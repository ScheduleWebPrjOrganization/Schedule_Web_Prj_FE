import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudyGroupCheckModal.css';
import { Member } from '../types';

interface ModalProps {
    onClose: () => void;
    onAddMember: (member: Member) => void;
    children: React.ReactNode;
    existingMembers: Member[];
    groupId: number;  // 그룹 ID 추가
}

const StudyGroupCheckModal: React.FC<ModalProps> = ({ onClose, onAddMember, children, existingMembers, groupId }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/members')
            .then(response => {
                const allMembers = response.data;
                const filteredMembers = allMembers.filter((member: Member) =>
                    !existingMembers.some(existingMember => existingMember.id === member.id)
                );
                setMembers(filteredMembers);
            })
            .catch(error => {
                console.error('There was an error fetching the members!', error);
            });
    }, [existingMembers]);

    const handleAddMember = () => {
        if (selectedMember) {
            axios.post(`http://localhost:8080/api/studygroup/${groupId}/addMember`, selectedMember)
                .then(response => {
                    onAddMember(response.data);
                    onClose();
                })
                .catch(error => {
                    console.error('There was an error adding the member to the group!', error);
                });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
                <h2>멤버 추가</h2>
                <div className="member-list">
                    {members.map(member => (
                        <div key={member.id}>
                            <input
                                type="radio"
                                id={`member-${member.id}`}
                                name="selectedMember"
                                value={member.id}
                                onChange={() => setSelectedMember(member)}
                            />
                            <label htmlFor={`member-${member.id}`}>{member.name} ({member.email})</label>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddMember}>멤버 추가</button>
            </div>
        </div>
    );
};

export default StudyGroupCheckModal;
