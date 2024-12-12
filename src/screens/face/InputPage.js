import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './css/InputPage.css'; 

const InputPage = () => {     
    const [inputValue, setInputValue] = useState('');     
    const [error, setError] = useState('');     
    const [isSubmitted, setIsSubmitted] = useState(false);     
    const [serverResponse, setServerResponse] = useState('');     
    const [userInfo, setUserInfo] = useState({ conferenceId:'' ,fullName: '', email: '', phone: '' });     
    const navigate = useNavigate();      

    const validateInput = (value) => {         
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;         
        const phoneRegex = /^[0-9]{10,15}$/;          

        if (!value) {             
            return 'Vui lòng nhập email hoặc số điện thoại.';         
        }         
        if (!emailRegex.test(value) && !phoneRegex.test(value)) {             
            return 'Định dạng không hợp lệ. Vui lòng nhập email hoặc số điện thoại đúng.';         
        }         
        return '';     
    };      

    const handleChange = (e) => {         
        setInputValue(e.target.value);         
        setError('');     
    };      

    const handleSubmit = async (e) => {         
        e.preventDefault();         
        const validationError = validateInput(inputValue);         
        if (validationError) {             
            setError(validationError);             
            return;         
        }         
        setError('');              

        const email = inputValue.includes('@') ? inputValue : '';         
        const phone = inputValue.match(/^[0-9]+$/) ? inputValue : '';              

        try {             
            const response = await fetch('http://localhost:5000/input', {                 
                method: 'POST',                 
                headers: {                     
                    'Content-Type': 'application/json',                 
                },                 
                body: JSON.stringify({                     
                    email: email || null,                     
                    phone: phone || null,                 
                }),             
            });                  
            const result = await response.json();                  
            console.log(result);
            if (response.ok) {                 
                localStorage.setItem('email', result.email || '');                 
                localStorage.setItem('phone', result.phone || '');                 
                localStorage.setItem('full_name', result.full_name); 
                localStorage.setItem('conferenceId',result.conferenceId);
                setUserInfo({   
                    conferenceId:result.conferenceId,              
                    fullName: result.full_name,                     
                    email: result.email,                     
                    phone: result.phone,    

                });                      
                setIsSubmitted(true);                 
                setServerResponse(result.message || 'Đăng nhập thành công!');                                  
                navigate('/registerface', {                     
                    state: {                         
                        email: email || '',                         
                        phone: phone || ''                     
                    }                 
                });             
            } else {                 
                setError(result.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');             
            }         
        } catch (err) {             
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');         
        }     
    };               

    return (         
        <div className="input-page-container">             
            <h2>Nhập Email hoặc Số Điện Thoại</h2>             
            {!isSubmitted ? (                 
                <form onSubmit={handleSubmit} className="input-form">                     
                    <label htmlFor="inputField">Email hoặc Số Điện Thoại</label>                     
                    <input                         
                        id="inputField"                         
                        type="text"                         
                        value={inputValue}                         
                        onChange={handleChange}                         
                        placeholder="Nhập email hoặc số điện thoại"                     
                    />                     
                    {error && <p className="error-text">{error}</p>}                     
                    <button type="submit" className="button button-primary">                         
                        Tiếp tục                     
                    </button>                 
                </form>             
            ) : (                 
                <div className="success-message">                     
                    <h3>Chúc mừng!</h3>                     
                    <p>{serverResponse}</p>                     
                    <p><strong>Họ và tên:</strong> {userInfo.fullName}</p>                     
                    <p><strong>Email:</strong> {userInfo.email}</p>                     
                    <p><strong>Số điện thoại:</strong> {userInfo.phone}</p>                 
                </div>             
            )}         
        </div>     
    ); 
};  

export default InputPage;
