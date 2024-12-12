import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./FaceRecognition.css";

const FaceRecognition = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [faces, setFaces] = useState({ boxes: [], names: [] });
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [leftFaces, setLeftFaces] = useState([]); // Danh sách người đã ra ngoài

  // Hàm gửi frame tới API nhận diện khuôn mặt
  const sendFrameToAPI = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("Failed to capture screenshot");
      return;
    }

    try {
      const byteString = atob(imageSrc.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ia], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("frame", blob);

      const response = await axios.post("http://localhost:5000/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.boxes && response.data.names) {
        setFaces(response.data);
        const currentTime = new Date().toLocaleString();
        const updatedRecognizedFaces = response.data.names.map((name) => ({
          name,
          time: currentTime,
        }));

        // Save recognized faces to localStorage
        localStorage.setItem("recognizedFaces", JSON.stringify(updatedRecognizedFaces));
        setRecognizedFaces(updatedRecognizedFaces);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error recognizing faces:", error);
    }
  };

  // Hàm vẽ khuôn mặt lên canvas
  const drawFaces = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (webcamRef.current && faces.boxes && faces.names) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const video = webcamRef.current.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      faces.boxes.forEach((box, index) => {
        const [top, right, bottom, left] = box;

        context.strokeStyle = "lime";
        context.lineWidth = 3;
        context.strokeRect(left, top, right - left, bottom - top);

        const name = faces.names[index] || "Unknown";
        context.fillStyle = "lime";
        context.font = "16px Arial";
        const textWidth = context.measureText(name).width;
        const textHeight = 16;
        context.fillRect(left, top - textHeight - 5, textWidth + 10, textHeight + 5);
        context.fillStyle = "black";
        context.fillText(name, left + 5, top - 5);
      });
    }
  }, [faces]);

  // Gửi ảnh đến API mỗi 9 giây
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToAPI();
    }, 9000); // Lấy ảnh từ webcam mỗi 9 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  // Vẽ lại faces mỗi khi faces thay đổi
  useEffect(() => {
    drawFaces(); // Vẽ lại faces sau khi nhận được dữ liệu
  }, [drawFaces, faces]);

  // Load faces from localStorage on initial load
  useEffect(() => {
    const storedRecognizedFaces = localStorage.getItem("recognizedFaces");
    const storedLeftFaces = localStorage.getItem("leftFaces");

    if (storedRecognizedFaces) {
      setRecognizedFaces(JSON.parse(storedRecognizedFaces));
    }

    if (storedLeftFaces) {
      setLeftFaces(JSON.parse(storedLeftFaces));
    }
  }, []);

  // Save left faces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("leftFaces", JSON.stringify(leftFaces));
  }, [leftFaces]);

  return (
    <div className="face-recognition-container">
      {/* Webcam và canvas */}
      <div className="face-list">
        <h3>Recognized Faces</h3>
        {recognizedFaces.length === 0 ? (
          <p>No faces recognized yet</p>
        ) : (
          <ul>
            {recognizedFaces.map((face, index) => (
              <li key={index}>
                <strong>{face.name}</strong> - <span>{face.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="video-container">
        <h1>Real-Time Face Recognition</h1>
        <div className="webcam-wrapper">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
          />
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Danh sách khuôn mặt nhận diện */}

      {/* Danh sách người đã ra ngoài */}
      <div className="left-faces-list">
        <h3>Left Faces</h3>
        {leftFaces.length === 0 ? (
          <p>No one left yet</p>
        ) : (
          <ul>
            {leftFaces.map((face, index) => (
              <li key={index}>
                <strong>{face.name}</strong> - <span>{face.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;
