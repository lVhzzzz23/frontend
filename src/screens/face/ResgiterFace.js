import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/FaceRecognition.css";

const RegisterFace = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = location.state || {};
  const [faces, setFaces] = useState({ boxes: [], names: [] });
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState("in");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startCamera = (mode) => {
    setAttendanceMode(mode);
    setIsCameraStarted(true);
    setFailedAttempts(0);
    console.log("Camera started in mode:", mode);
  };

  const stopCamera = () => {
    const videoTracks = webcamRef.current?.stream?.getTracks();
    if (videoTracks) videoTracks.forEach((track) => track.stop());
    setIsCameraStarted(false);
    clearCanvas();
    console.log("Camera stopped");
    updateRoomData(); // Update room data when stopping the camera
  };

  const updateRoomData = () => {
    // Example function that could update room data or notify other components
    console.log("Updating room data with current recognized faces:", recognizedFaces);
    axios.post("http://localhost:5000/update-room-data", { recognizedFaces })
      .then(response => {
        console.log("Room data updated successfully:", response.data);
      })
      .catch(error => {
        console.error("Error updating room data:", error);
      });
  };

  const sendFrameToAPI = useCallback(async () => {
    if (!webcamRef.current || !isCameraStarted) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
  
    console.log("Sending frame to API");
  
    const formData = new FormData();
    const blob = await fetch(imageSrc).then((res) => res.blob());
    formData.append("frame", blob);
  
    try {
      const response = await axios.post("http://localhost:5000/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("API Response:", response.data);
  
      if (response.data?.boxes && response.data?.names) {
        setFaces(response.data);
        let faceRecognizedInThisFrame = false;
  
        response.data.names.forEach((name, index) => {
          if (name !== "Unknown") {
              faceRecognizedInThisFrame = true;
              setFailedAttempts(0);
              const newFace = {
                name,
                time: new Date().toLocaleString(),
                mode: attendanceMode,
                image: imageSrc,
              };
  
              setRecognizedFaces((prev) => {
                const updatedFaces = [...prev, newFace];
                sessionStorage.setItem("recognizedFaces", JSON.stringify(updatedFaces));
                return updatedFaces;
              });
  
              if (attendanceMode === "in" || attendanceMode === "out") {
                setShowSuccessDialog(true);
              }
            
          }
        });
  
        if (!faceRecognizedInThisFrame) {
          setFailedAttempts((prev) => prev + 1);
          setDialogMessage(`Nhận diện không thành công lần thứ ${failedAttempts + 1}`);
          setOpenDialog(true);
  
          if (failedAttempts + 1 >= 3) {
            setDialogMessage("Nhận diện thất bại sau 3 lần. Bạn chưa đăng ký khuôn mặt.");
            setOpenDialog(true);
            stopCamera();
          }
        }
      }
    } catch (error) {
      console.error("Error recognizing frame:", error);
    }
  }, [isCameraStarted, attendanceMode, failedAttempts, userInfo]);
  
  useEffect(() => {
    const storedFaces = JSON.parse(sessionStorage.getItem("recognizedFaces")) || [];
    setRecognizedFaces(storedFaces);
    console.log("Stored recognized faces:", storedFaces);
  }, []);

  useEffect(() => {
    if (isCameraStarted) {
      const interval = setInterval(() => sendFrameToAPI(), 5000);
      return () => clearInterval(interval);
    }
  }, [sendFrameToAPI, isCameraStarted]);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/input");
    setIsCameraStarted(false);
    console.log("Navigating to input page and stopping camera");
  };

  return (
    <div className="face-recognition-container">
      <Dialog open={showSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle>Đăng ký thành công</DialogTitle>
        <DialogContent>
          <p>Khuôn mặt của bạn đã được nhận diện thành công. Bạn sẽ được chuyển đến trang nhập liệu ngay.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <p>{dialogMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <div className="split-container">
        <div className="camera-section">
          <h3>Đăng ký khuôn mặt thời gian thực</h3>
          <div className="webcam-wrapper">
            {isCameraStarted ? (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded shadow"
                />
                <canvas ref={canvasRef} />
              </>
            ) : (
              <div className="camera-placeholder rounded shadow">
                <p className="text-muted">Camera chưa được bật</p>
              </div>
            )}
          </div>
          <div className="buttons-container">
            <button className="face-button" onClick={() => startCamera("in")} disabled={isCameraStarted}>
              Đăng ký vào
            </button>
            <button className="face-button" onClick={() => startCamera("out")} disabled={isCameraStarted}>
              Đăng ký ra
            </button>
          </div>
        </div>

        {/* Recognized Faces List */}
        <div className="list-section">
          <h4>Danh sách người check-in/out</h4>
          {recognizedFaces.length === 0 ? (
            <p>Chưa có người nào được nhận diện. Mời bạn vào!</p>
          ) : (
            <ul className="face-list">
              {recognizedFaces.map((face, index) => (
                <li key={index} className={`face-item ${face.mode === "in" ? "in" : "out"}`}>
                  <div className="face-info">
                    <img src={face.image} alt={face.name} className="face-image" />
                    <div>
                      <div className="face-name">{face.name}</div>
                      <div className="time">{face.time}</div>
                    </div>
                  </div>
                  <div className="mode">{face.mode}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterFace;
