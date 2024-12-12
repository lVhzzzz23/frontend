import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../organizer/css/CreateMeeting.css';

Modal.setAppElement('#root');

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [meetingImage, setMeetingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,12}$/;
    return phoneRegex.test(phone);
  };

  const validateEventDate = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate >= today;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMeetingImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meetingName || !hostEmail || !eventDate || !eventTime || !description || !meetingImage) {
      setModalMessage('Tất cả các trường là bắt buộc.');
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    if (!validateEmail(hostEmail)) {
      setModalMessage('Email không hợp lệ.');
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    if (!validatePhone(hostPhone)) {
      setModalMessage('Số điện thoại không hợp lệ. Số điện thoại phải chứa 10-12 chữ số.');
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    if (!validateEventDate(eventDate)) {
      setModalMessage('Ngày sự kiện không thể là ngày trong quá khứ.');
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const combinedDateTime = `${eventDate}T${eventTime}`;
    const conferenceData = new FormData();
    conferenceData.append('conference_name', meetingName);
    conferenceData.append('creator_email', hostEmail);
    conferenceData.append('event_date', combinedDateTime.split('T')[0]);
    conferenceData.append('event_time', combinedDateTime.split('T')[1]);
    conferenceData.append('creator_phone', hostPhone);
    conferenceData.append('location', location);
    conferenceData.append('description', description);
    conferenceData.append('date', new Date().toISOString());
    conferenceData.append('file', meetingImage);

    try {
      const response = await axios.post('http://localhost:5000/register_conference', conferenceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.conference_info.status === 'pending') {
        setModalMessage('Hội nghị đang chờ duyệt. Không thể tiếp tục đến bước tiếp theo.');
        setModalType('error');
        navigate('/pending-approval');
      } else {
        setModalMessage('Hội nghị được tạo thành công!');
        setModalType('success');
        navigate('/input');
      }
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo hội nghị!');
      setModalType('error');
    } finally {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="conference-registration">
      <h2>Đăng Ký Hội Nghị</h2>

      <form onSubmit={handleSubmit}>
        {/* Ảnh Hội Nghị */}
        <div className="form-field">
          <label>Ảnh Hội Nghị</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>

        {/* Các trường khác */}
        <div className="form-field">
          <label>Tên Hội Nghị</label>
          <input
            type="text"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="Nhập tên hội nghị"
          />
        </div>

        <div className="form-field">
          <label>Email Người Tổ Chức</label>
          <input
            type="email"
            value={hostEmail}
            onChange={(e) => setHostEmail(e.target.value)}
            placeholder="Nhập email người tổ chức"
          />
        </div>

        <div className="form-field">
          <label>Số Điện Thoại Người Tổ Chức</label>
          <input
            type="text"
            value={hostPhone}
            onChange={(e) => setHostPhone(e.target.value)}
            placeholder="Nhập số điện thoại người tổ chức"
          />
        </div>

        <div className="form-field">
          <label>Ngày Sự Kiện</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Giờ Sự Kiện</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Địa Điểm</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nhập địa điểm"
          />
        </div>

        <div className="form-field">
          <label>Mô Tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả hội nghị"
          />
        </div>

        <button type="submit">Đăng Ký Hội Nghị</button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Thông báo"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h3>{modalType === 'success' ? 'Thành Công' : 'Lỗi'}</h3>
        <p>{modalMessage}</p>
        <button onClick={() => setIsModalOpen(false)}>Đóng</button>
      </Modal>
    </div>
  );
};

export default CreateMeeting;
