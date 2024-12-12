import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ParticipantsLogin.css";

const ParticipantsLogin = ({ conferenceId }) => {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [isEmailExists, setIsEmailExists] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    try {
      const requestData = { ...form, conferenceId };
  
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data);
        alert(
          data.message === "Thông tin đã được cập nhật thành công."
            ? "Thông tin đã được cập nhật thành công!"
            : "Đăng ký thành công!"
        );
  
        if (data.conferenceId) {
          navigate(`/conference/${data.conferenceId}`, { state: { userInfo: form } });
        } else {
          alert("Không có conferenceId. Vui lòng thử lại!");
        }
      } else {
        alert(data.message);
        if (data.message === "Cần có 'fullName' và 'phone'.") {
          setIsEmailExists(true);
        }
      
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };
   
  return (
    <div className="container">
      <h2>Bước 1: Nhập Thông Tin</h2>
      <div className="input-field">
        <label htmlFor="fullName">Họ và Tên:</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
          disabled={isEmailExists}
        />
      </div>
      <div className="input-field">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Nhập email"
        />
      </div>
      <div className="input-field">
        <label htmlFor="phone">Số Điện Thoại:</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
          disabled={isEmailExists}
        />
      </div>
      <button onClick={handleNext}>Tiếp Theo</button>
    </div>
  );
};

export default ParticipantsLogin;
