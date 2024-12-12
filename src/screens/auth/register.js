import React, { useState } from 'react'; 
import axios from 'axios'; 
import './css/Register.css'; 
import { Link } from 'react-router-dom';  

const Register = () => {   
  const [formData, setFormData] = useState({     
    fullName: '',     
    email: '',     
    phone: ''   
  });    

  const [errorMessage, setErrorMessage] = useState('');   
  const [successMessage, setSuccessMessage] = useState('');    

  // Xử lý thay đổi giá trị trong các input   
  const handleChange = (e) => {     
    const { name, value } = e.target;     
    setFormData((prevData) => ({       
      ...prevData,       
      [name]: value     
    }));   
  };    

  // Gửi yêu cầu đăng ký đến API   
  const handleSubmit = async (e) => {     
    e.preventDefault();          

    // Kiểm tra nếu các trường cần thiết đã được điền đầy đủ     
    if (!formData.fullName || !formData.email || !formData.phone) {       
      setErrorMessage('Vui lòng điền đầy đủ các trường.');       
      return;     
    }      

    try {       
      const response = await axios.post('http://localhost:5000/register', formData);       
      setSuccessMessage(response.data.message);       
      setErrorMessage('');     
    } catch (err) {       
      setErrorMessage('Đã có lỗi xảy ra khi đăng ký.');       
      setSuccessMessage('');     
    }   
  };    

  return (     
    <div className="register-container">       
      <div className="form-wrapper">         
        <h2>Đăng Ký Tài Khoản</h2>                  

        {/* Hiển thị thông báo lỗi hoặc thành công */}         
        {errorMessage && <div className="alert error">{errorMessage}</div>}         
        {successMessage && <div className="alert success">{successMessage}</div>}                  

        <form onSubmit={handleSubmit}>           
          <div className="input-group">             
            <label htmlFor="fullName">Họ và Tên</label>             
            <input               
              type="text"               
              id="fullName"               
              name="fullName"               
              value={formData.fullName}               
              onChange={handleChange}               
              required             
            />           
          </div>            

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

          <button type="submit" className="btn">Đăng Ký</button>            
          <p className="already-have-account">   
            Đã có tài khoản? <Link to="/login">Đăng Nhập</Link> 
          </p>         
        </form>       
      </div>     
    </div>   
  ); 
};  

export default Register;
