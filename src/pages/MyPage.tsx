import React, { useState, ChangeEvent, useEffect } from "react";
import "../style/MyPage.css";
import Snow from "../component/decoration/Snow"; // Snow 컴포넌트를 올바른 경로로 임포트
import axios from 'axios';
import { Box, Button, Modal, Typography } from "@mui/material";

interface UserDetails {
    email: string;
    nickname: string;
    joinedDate: string;
    avatarUrl: string;
    emailUpdates?: boolean;
}

const baseURL = 'http://localhost:8080';

const MyPage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        email: '',
        nickname: '',
        joinedDate: '',
        avatarUrl: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(
                `${baseURL}/api/members/mypage`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            const data = await response.json();
            setUserDetails({
                email: data.email,
                nickname: data.nickname,
                joinedDate: data.createdAt.split('T')[0],
                avatarUrl: data.profileImageUrl
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, nickname: event.target.value });
    };

    const handlePasswordChange = () => {
        alert("비밀번호 변경");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleProfileImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${baseURL}/api/members/mypage/update-profile-image`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            if (response.status === 200) {
                setUserDetails(prev => (
                    { ...prev, avatarUrl: response.data.avatarUrl }
                ));
                closeModal(); // 모달 닫기
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };

    const saveUserInfo = async () => {
        try {
            const response = await fetch(
                `${baseURL}/api/members/mypage/update-user-info`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userDetails),
                    credentials: 'include'
                }
            );
            if (response.ok) {
                console.log('User info saved successfully');
                fetchUserInfo();
            } else {
                console.error('Error saving user info');
            }
        } catch (error) {
            console.error('Error saving user info:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="mypage">
            <div className="container">
                <h2>MyPage</h2>
                <div className="profile">
                    <div className="profile-picture">
                        <img src={userDetails.avatarUrl} alt="프로필" />
                        <Button variant="contained" onClick={openModal}>프로필 사진 변경</Button>
                    </div>
                    <div className="profile-info">
                        <div className="info-item">
                            <label>유저 아이디:</label>
                            <span>{userDetails.email}</span>
                        </div>
                        <div className="info-item">
                            <label>닉네임:</label>
                            <input
                                type="text"
                                value={userDetails.nickname}
                                onChange={handleNicknameChange}
                            />
                        </div>
                        <Button variant="contained" onClick={handlePasswordChange}>
                            비밀번호 변경
                        </Button>
                    </div>
                    <Button variant="contained" onClick={saveUserInfo}>
                        회원정보 저장
                    </Button>
                </div>
            </div>
            <Modal open={isModalOpen} onClose={closeModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography variant="h6" component="h2">
                        프로필 사진 업로드
                    </Typography>
                    <input type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleProfileImageUpload(file);
                        }
                    }} />
                </Box>
            </Modal>
        </div>
    );
};

export default MyPage;
