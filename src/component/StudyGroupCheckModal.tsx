import React from 'react';
import './StudyGroupCheckModal.css';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const StudyGroupCheckModal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default StudyGroupCheckModal;
