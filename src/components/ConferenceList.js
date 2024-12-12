import React, { useEffect, useState } from "react";
import axios from "axios";

const ConferenceList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gọi API để lấy danh sách hội nghị
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await axios.get("http://localhost:5000/list_conferences");
        setConferences(response.data.conferences);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách hội nghị. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách hội nghị...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Danh Sách Hội Nghị</h2>
      {conferences.length === 0 ? (
        <p>Không có hội nghị nào được tìm thấy.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conferences.map((conference) => (
            <li
              key={conference._id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3 style={{ margin: "0 0 10px" }}>{conference.name}</h3>
              <p>
                <strong>Địa điểm:</strong> {conference.location}
              </p>
              <p>
                <strong>Thời gian:</strong> {conference.date}
              </p>
              <p>
                <strong>Mô tả:</strong> {conference.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConferenceList;
