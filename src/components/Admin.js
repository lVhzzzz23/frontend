// src/components/AdminPage.js

import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });

  return (
    <div className="admin-container">
      <h2>Quản lý Hội Nghị</h2>
      
      <div className="conference-list">
        <h3>Danh sách Hội Nghị</h3>
        {conferences.length === 0 ? (
          <p>Chưa có hội nghị nào</p>
        ) : (
          conferences.map((conference) => (
            <div className="conference-item" key={conference.id}>
              <span>{conference.name}</span>
              <button>Xóa</button>
            </div>
          ))
        )}
      </div>

      {selectedConference && (
        <div className="participant-management">
          <h3>Quản lý Người Tham Gia</h3>
          <div className="add-participant">
            <input
              type="text"
              placeholder="Tên người tham gia"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email người tham gia"
              value={newParticipant.email}
              onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
            />
            <button>Thêm Người Tham Gia</button>
          </div>

          <div className="participant-list">
            {participants.length === 0 ? (
              <p>Không có người tham gia</p>
            ) : (
              participants.map((participant) => (
                <div className="participant-item" key={participant.id}>
                  <span>{participant.name}</span>
                  <button>Xóa</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
