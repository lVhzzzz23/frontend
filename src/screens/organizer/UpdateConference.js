import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateConference = () => {
  const { conferenceId } = useParams(); // Get conferenceId from route params
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle form visibility
  const [formData, setFormData] = useState({
    conference_name: '',
    confirmation_code: '',
    creator_email: '',
    creator_phone: '',
    event_date: '',
    event_time: '',
    location: '',
    status: ''
  });

  useEffect(() => {
    if (!conferenceId || !/^[0-9a-fA-F]{24}$/.test(conferenceId)) {
      setError("ID cuộc họp không hợp lệ. Vui lòng kiểm tra lại.");
      setLoading(false);
      return;
    }

    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/conference/details/${conferenceId}`
        );
        if (response.status === 200) {
          setConferenceDetails(response.data);
          setFormData({
            conference_name: response.data.conference_name,
            confirmation_code: response.data.confirmation_code,
            creator_email: response.data.creator_email,
            creator_phone: response.data.creator_phone,
            event_date: response.data.event_date,
            event_time: response.data.event_time,
            location: response.data.location,
            status: response.data.status,
          });
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("Không tìm thấy cuộc họp với ID này.");
          } else {
            setError("Lỗi khi tìm nạp thông tin cuộc họp.");
          }
        } else {
          setError("Lỗi kết nối với máy chủ.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [conferenceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update_conference/${conferenceId}`,
        formData
      );
      if (response.status === 200) {
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false); // Hide the form after successful update
      }
    } catch (error) {
      alert("Lỗi khi cập nhật thông tin cuộc họp");
    }
  };

  if (loading) {
    return <div>Đang tải thông tin cuộc họp...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Quản lý cuộc họp</h2>
      <div className="conference-details">
        <h3>Thông tin cuộc họp</h3>
        {!isEditing ? (
          <>
            <p><strong>ID Cuộc Họp:</strong> {conferenceDetails._id}</p>
            <p><strong>Tên Cuộc Họp:</strong> {conferenceDetails.conference_name}</p>
            <p><strong>Ngày sự kiện:</strong> {conferenceDetails.event_date}</p>
            <p><strong>Giờ sự kiện:</strong> {conferenceDetails.event_time}</p>
            <p><strong>Địa điểm:</strong> {conferenceDetails.location}</p>
            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa cuộc họp
              </button>
            </div>
          </>
        ) : (
          <div>
            <h3>Chỉnh sửa thông tin cuộc họp</h3>
            <form>
              <div className="form-group">
                <label>Tên cuộc họp</label>
                <input
                  type="text"
                  name="conference_name"
                  value={formData.conference_name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Mã xác nhận</label>
                <input
                  type="text"
                  name="confirmation_code"
                  value={formData.confirmation_code}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email người tạo</label>
                <input
                  type="email"
                  name="creator_email"
                  value={formData.creator_email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại người tạo</label>
                <input
                  type="text"
                  name="creator_phone"
                  value={formData.creator_phone}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Ngày sự kiện</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Giờ sự kiện</label>
                <input
                  type="time"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Địa điểm</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleEditSubmit}
                className="btn btn-success"
              >
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateConference;
