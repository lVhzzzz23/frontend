import React from 'react';

const NotificationList = ({ notifications }) => {
  return (
    <div>
      <h3 className="text-center mb-4">Danh sách thông báo</h3>
      <ul className="list-group">
        {notifications.map((note, index) => (
          <li key={index} className="list-group-item">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
