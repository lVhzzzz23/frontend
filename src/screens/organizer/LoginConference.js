import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/LoginConference.css';
const LoginConference = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!confirmationCode) {
      setMessage("Vui lòng nhập mã xác nhận!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/conference/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation_code: confirmationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Đăng nhập hội nghị thành công.");
        // Điều hướng đến trang tạo form
        navigate(`/create-form/${data.conference_info.id}`, {
          state: { conferenceName: data.conference_info.conference_name },
        });
      } else {
        setMessage(data.message || "Đã xảy ra lỗi.");
      }
    } catch (error) {
      setMessage("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Đăng nhập Hội nghị</h1>
      <input
        type="text"
        placeholder="Nhập mã xác nhận"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </button>
      <div>{message}</div>
    </div>
  );
};

export default LoginConference;
