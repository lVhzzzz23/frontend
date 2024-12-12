import React, { useState } from 'react';
import axios from 'axios';
import './css/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.phone) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      setSuccessMessage('Đăng nhập thành công!');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Đăng nhập thất bại, vui lòng thử lại.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Đăng Nhập</h2>
        {errorMessage && <div className="alert error">{errorMessage}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Số Điện Thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
