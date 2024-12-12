import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Paper, Divider, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Delete, CheckCircle, Cancel } from "@mui/icons-material";
import "./css/ParticipantDashboard.css";

const ParticipantDashboard = () => {
  const [conferences, setConferences] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ type: "", id: null });
  const [dialogMessage, setDialogMessage] = useState("");

  // Fetch conferences
  useEffect(() => {
    fetch("http://localhost:5000/list_conferences")
      .then((response) => response.json())
      .then((data) => setConferences(data.conferences || []))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu hội nghị:", error));
  }, []);

  const handleApproveConference = (conferenceId, status) => {
    const endpoint = status === "approved"
      ? `http://localhost:5000/cancel_conference/${conferenceId}`
      : `http://localhost:5000/approve_conference/${conferenceId}`;
    fetch(endpoint, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setDialogMessage(data.message);
          setConferences((prevConferences) =>
            prevConferences.map((conference) =>
              conference._id === conferenceId
                ? { ...conference, status: status === "approved" ? "pending" : "approved" }
                : conference
            )
          );
        }
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật trạng thái hội nghị:", error);
        setDialogMessage("Đã xảy ra lỗi khi cập nhật trạng thái hội nghị.");
      });
  };

  const handleDelete = (type, id) => {
    setConfirmDelete({ type, id });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.type === "conference") {
      fetch(`http://localhost:5000/delete_conference/${confirmDelete.id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setDialogMessage(data.message);
            setConferences((prev) =>
              prev.filter((conf) => conf._id !== confirmDelete.id)
            );
          }
        })
        .catch((error) => {
          console.error("Lỗi khi xóa hội nghị:", error);
          setDialogMessage("Đã xảy ra lỗi khi xóa hội nghị.");
        });
    }
    setConfirmDelete({ type: "", id: null });
  };

  const cancelDeleteAction = () => {
    setConfirmDelete({ type: "", id: null });
  };

  return (
    <Box className="dashboard-container">
      {/* Sidebar */}
      <div className="col-md-3 dashboard-sidebar bg-primary text-white p-3">
        <div className="sidebar-header text-center mb-4">
          <h3>Quản lý Admin</h3>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/admin" className="nav-link text-black">
              <i className="fas fa-calendar-plus"></i> Trang chủ
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/participant-dashboard" className="nav-link text-black">
              <i className="fas fa-user-check"></i> Quản lý hội nghị
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/users" className="nav-link text-black">
              <i className="fas fa-users"></i> Quản lý Người Dùng
            </Link>
            </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link text-black">
              <i className="fas fa-cog"></i> Cài Đặt
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <Box className="main-content">
        <Typography variant="h4" className="main-title">
          Quản Lý Hội Nghị
        </Typography>

        <Paper elevation={3} className="content-box">
          <Typography variant="h6" className="content-title">
            Danh sách Hội Nghị
          </Typography>
          <Divider />

          {conferences.length === 0 ? (
            <Typography className="empty-state">Chưa có hội nghị nào</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Hội Nghị</TableCell>
                    <TableCell>Email Người Tạo</TableCell>
                    <TableCell>Ngày Tổ Chức</TableCell>
                    <TableCell>Thời Gian</TableCell>
                    <TableCell>Địa Điểm</TableCell>
                    <TableCell>Mã Xác Nhận</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Thao Tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conferences.map((conference) => (
                    <TableRow key={conference._id}>
                      <TableCell>{conference.conference_name}</TableCell>
                      <TableCell>{conference.creator_email}</TableCell>
                      <TableCell>{conference.event_date}</TableCell>
                      <TableCell>{conference.event_time}</TableCell>
                      <TableCell>{conference.location}</TableCell>
                      <TableCell>{conference.confirmation_code}</TableCell>
                      <TableCell>{conference.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color={conference.status === "approved" ? "error" : "primary"}
                          startIcon={conference.status === "approved" ? <Cancel /> : <CheckCircle />}
                          onClick={() => handleApproveConference(conference._id, conference.status)}
                        >
                          {conference.status === "approved" ? "Hủy Duyệt" : "Duyệt"}
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete("conference", conference._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={Boolean(confirmDelete.id)} onClose={cancelDeleteAction}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa hội nghị này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteAction}>Hủy</Button>
          <Button onClick={confirmDeleteAction} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Message */}
      <Dialog open={dialogMessage.length > 0} onClose={() => setDialogMessage("")}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogMessage("")}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParticipantDashboard;
