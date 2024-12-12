import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './css/Step2.css';
import { useLocation } from 'react-router-dom';


const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photoList, setPhotoList] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null); // Store the avatar URL
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const location = useLocation();
    const { userInfo } = location.state || {};
    // Bật webcam
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setIsWebcamActive(true);
        } catch (err) {
            console.error("Lỗi bật webcam:", err);
            alert('Không thể bật webcam. Vui lòng kiểm tra quyền truy cập.');
        }
    };

    // Chụp ảnh và thêm vào danh sách
    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        if (!videoRef.current.srcObject) {
            alert("Vui lòng bật webcam trước khi chụp ảnh.");
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/png');

        setPhotoList(prevPhotos => {
            const updatedPhotos = [...prevPhotos, photoUrl];
            return updatedPhotos.length > 5 ? updatedPhotos.slice(0, 5) : updatedPhotos;
        });
    };

    // Tải ảnh lên server khi đủ 5 ảnh
    const uploadPhotos = async () => {
        if (photoList.length < 5) {
            alert('Cần đủ 5 ảnh để tải lên.');
            return;
        }

        try {
            setIsLoading(true);
            setUploadStatus('Đang tải lên và huấn luyện...');
            console.log(userInfo.fullName);
            const response = await axios.post(
                `http://localhost:5000/capture/${encodeURIComponent(userInfo.fullName)}`,
                { images: photoList }
            );

            setIsLoading(false);
            setUploadStatus(response.data.message);

            if (response.data.message.includes('huấn luyện thành công')) {
                setAvatarUrl(response.data.avatar_url);
                setIsModalOpen(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Lỗi khi tải ảnh lên:", error);
            setUploadStatus('Tải lên thất bại. Vui lòng thử lại.');
            alert("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
        }
    };

    // Xử lý tự động tải lên khi danh sách ảnh đủ
    useEffect(() => {
        if (photoList.length === 5) {
            uploadPhotos();
        }
    }, [photoList]);

    return (
        <div className="step-container">
            <h2>Bước 3: Chụp Ảnh</h2>
            <p>Chào, {userInfo.fullName}. Vui lòng chụp ảnh khuôn mặt của bạn. Nhớ nhìn vào camera và quay sang trái, phải, và nhìn thẳng trước mặt.</p>

            <div className="guidelines">
                <div>
                    <img src="/images/straight.png" alt="Nhìn thẳng" />
                    <p>Nhìn thẳng vào camera</p>
                </div>
                <div>
                    <img src="/images/left.png" alt="Quay trái" />
                    <p>Quay sang trái</p>
                </div>
                <div>
                    <img src="/images/right.png" alt="Quay phải" />
                    <p>Quay sang phải</p>
                </div>
                <div>
                    <img src="/images/top.png" alt="Quay lên trên" />
                    <p>Quay lên trên</p>
                </div>
                <div>
                    <img src="/images/bottom.png" alt="Quay xuống dưới" />
                    <p>Quay xuống dưới</p>
                </div>
            </div>

            <div className="video-container">
                <video ref={videoRef} autoPlay playsInline></video>
                <canvas ref={canvasRef} width="640" height="480"></canvas>
            </div>

            {!isWebcamActive && (
                <button onClick={startWebcam} className="button button-primary">
                    Bật Webcam
                </button>
            )}

            {isWebcamActive && photoList.length < 5 && (
                <button onClick={capturePhoto} className="button button-success">
                    Chụp Ảnh
                </button>
            )}

            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

            <div className="photo-list">
                {photoList.map((photo, index) => (
                    <img key={index} src={photo} alt={`Ảnh ${index + 1}`} />
                ))}
            </div>

            {isLoading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <h2 className="loading-title">Đang tải lên...</h2>
                </div>
            )}

            {/* Modal Dialog */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Thông Báo Thành Công"
                className="modal"
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    <h3>Chúc mừng {userInfo.fullName}!</h3>
                    {avatarUrl && <img src={avatarUrl} alt="Avatar" className="avatar-img" />}
                    <p>Tên đã đăng ký: {userInfo.fullName}</p>
                    <button onClick={() => setIsModalOpen(false)} className="button button-primary">
                        Đóng
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Camera;
