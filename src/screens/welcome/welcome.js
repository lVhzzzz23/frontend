import React, { useState } from "react";
import './css/WelcomePage.css';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState(""); 

  const handleHostButtonClick = () => {
    navigate('/create-meeting'); 
  };

  const handleJoinButtonClick = async () => {
    if (roomCode.trim() === "") {
      alert("Vui lòng nhập mã phòng!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/conference/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation_code: roomCode }),
      });

      const data = await response.json();  

      if (response.ok) {
        localStorage.setItem('conferenceId', data.conference_info.id);
        console.log(data.conference_info.id);
        navigate(`/dashboard/${data.conference_info.id}`);
      } else {
        // Nếu có lỗi, hiển thị thông báo lỗi
        setError(data.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Không thể kết nối với máy chủ. Vui lòng thử lại.");
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <h1>Chào mừng bạn!</h1>
        <p>Hãy nhập mã phòng để tham gia hoặc tạo một phòng mới.</p>
      </div>
      <div className="role-selection">
        <button className="role-button" onClick={handleHostButtonClick}>
          Chủ phòng
        </button>
        <div className="join-section">
          <input
            type="text"
            placeholder="Nhập mã phòng"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="room-input"
          />
          <button className="role-button" onClick={handleJoinButtonClick}>
            Tham gia
          </button>
        </div>
        {error && <div className="error-message">{error}</div>} {/* Hiển thị thông báo lỗi nếu có */}
      </div>
    </div>
  );
}

export default WelcomePage;
