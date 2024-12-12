import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PendingApproval.css';

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="pending-approval">
      <h2>Vui lòng chờ</h2>
      <p>Thông tin đăng ký của bạn đang chờ được duyệt. Thông báo sẽ được gửi về email của bạn khi hoàn tất.</p>
      <button onClick={() => navigate('/')}>Quay lại Trang Chủ</button>
    </div>
  );
};

export default PendingApproval;
