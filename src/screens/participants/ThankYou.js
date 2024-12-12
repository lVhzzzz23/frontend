import React from 'react';
import { useLocation } from 'react-router-dom';
import './css/ThankYou.css';
const ThankYou = () => {
    const location = useLocation();
    const { fullName } = location.state || {};

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Cảm ơn bạn đã đăng ký!</h1>
            <p>Chúc mừng {fullName}, bạn đã đăng ký thành công.</p>
        </div>
    );
};

export default ThankYou;
