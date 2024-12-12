// src/components/ParticipantItem.js

import React from 'react';

const ParticipantItem = ({ participant, onRemove }) => {
  return (
    <div className="participant-item">
      <h4>{participant.name}</h4>
      <p>{participant.email}</p>
      <button onClick={onRemove}>Xóa Người Tham Gia</button>
    </div>
  );
};

export default ParticipantItem;
