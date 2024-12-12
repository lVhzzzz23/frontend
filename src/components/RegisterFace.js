import React, { useRef, useState } from 'react';
import axios from 'axios';

const RegisterFace = ({ userInfo = {} }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photoList, setPhotoList] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const hostName = "Host mặc định"; // Tên host mặc định
  const email = userInfo.email || "email@mactinh.com"; // Email lấy từ userInfo

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsWebcamActive(true);
    } catch (err) {
      alert('Không thể bật webcam. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoUrl = canvas.toDataURL('image/png');
    setPhotoList([...photoList, photoUrl]);

    // Gửi ảnh đến Flask API
    try {
      setUploadStatus('Đang tải lên...');
      const response = await axios.post(
        `http://localhost:5000/capture/${encodeURIComponent(email)}`, 
        {
          image: photoUrl,
          host: hostName, // Gửi tên host
        }
      );
      setUploadStatus('Tải lên thành công!');
      console.log('URL Ảnh:', response.data.url);
    } catch (error) {
      console.error(error);
      setUploadStatus('Tải lên thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Bước 2: Chụp Ảnh</h2>
      <p>Chào, {email}. Vui lòng chụp ảnh khuôn mặt của bạn.</p>
      <p><b>Host:</b> {hostName}</p>

      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', maxWidth: '640px', border: '1px solid #ddd' }}
        ></video>
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
      </div>

      {!isWebcamActive && (
        <button
          onClick={startWebcam}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Bật Webcam
        </button>
      )}

      {isWebcamActive && (
        <button
          onClick={capturePhoto}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Chụp & Tải Lên
        </button>
      )}

      {uploadStatus && <p style={{ marginTop: '10px', color: 'green' }}>{uploadStatus}</p>}

      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {photoList.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Ảnh ${index + 1}`}
            style={{ maxWidth: '150px', margin: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default RegisterFace;
