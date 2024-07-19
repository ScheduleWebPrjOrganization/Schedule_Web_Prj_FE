import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    width: 400px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.h5`
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
`;

const ModalBody = styled.div`
    padding: 16px;
    text-align: center;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    border-top: 1px solid #eee;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:first-child {
        background-color: #ccc;
        color: white;
        margin-right: 8px;
    }

    &:last-child {
        background-color: #28a745;
        color: white;
    }
`;

interface ReportModalProps {
    show: boolean;
    handleClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, handleClose }) => {
    const [reportedUserId, setReportedUserId] = useState('');
    const [reporterId, setReporterId] = useState('');
    const [chatId, setChatId] = useState<number | null>(null);
    const [status, setStatus] = useState('WAITING');

    const handleSubmit = async () => {
        try {
            const report = {
                chatId,
                reportedUserId,
                reporterId,
                status,
                date: new Date().toISOString()
            };

            const response = await axios.post('http://localhost:8080/api/reports/post', report);
            if (response.status === 200) {
                alert('Report submitted');
                handleClose();
            }
        } catch (error) {
            console.error('There was an error submitting the report!', error);
        }
    };

    if (!show) return null;

    return (
        <ModalBackground onClick={handleClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Report</ModalTitle>
                    <CloseButton onClick={handleClose}>&times;</CloseButton>
                </ModalHeader>
                <ModalBody>
                    <input
                        type="text"
                        placeholder="Reported User ID"
                        value={reportedUserId}
                        onChange={(e) => setReportedUserId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Reporter ID"
                        value={reporterId}
                        onChange={(e) => setReporterId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Chat ID"
                        value={chatId || ''}
                        onChange={(e) => setChatId(Number(e.target.value))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </ModalFooter>
            </ModalContainer>
        </ModalBackground>
    );
};

export default ReportModal;
