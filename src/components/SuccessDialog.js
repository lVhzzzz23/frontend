import React from 'react';

const SuccessDialog = ({ message, onClose }) => {
  return (
    <div className="dialog-overlay d-flex align-items-center justify-content-center">
      <div className="dialog bg-white border rounded p-4 shadow">
        <p className="text-success mb-4">{message}</p>
        <button className="btn btn-success" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SuccessDialog;
