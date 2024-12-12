import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Chart } from "react-google-charts";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./css/DashboardManage.css";

const DashboardManage = () => {
  const [peopleInRoomStats, setPeopleInRoomStats] = useState([["Thời gian", "Số người"]]);
  const [totalPeopleInRoom, setTotalPeopleInRoom] = useState(0);
  const [totalRegisteredPeople, setTotalRegisteredPeople] = useState(0);
  const [registeredPeopleByDay, setRegisteredPeopleByDay] = useState([["Ngày", "Số lượng"]]);
  const [conferenceId, setConferenceId] = useState(localStorage.getItem("conferenceId"));
  const [email, setEmail] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchStats = async () => {
    if (!conferenceId) {
      console.error("Conference ID not found in localStorage.");
      showModal("Không tìm thấy Conference ID.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/statistics/${conferenceId}`);
      if (response.status === 200) {
        const { statistics } = response.data;
        if (statistics && statistics.length > 0) {
          setTotalRegisteredPeople(statistics[0].userCount);

          const peopleInRoom = [
            ["Thời gian", "Số người"],
            ...statistics.map((stat) => [stat.time, stat.userCount]),
          ];
          setPeopleInRoomStats(peopleInRoom);
          setTotalPeopleInRoom(statistics.reduce((sum, stat) => sum + stat.userCount, 0));
        } else {
          showModal("Không tìm thấy dữ liệu cho Conference ID này.");
        }

        // Giả lập dữ liệu cho người tham gia theo ngày
        setRegisteredPeopleByDay([
          ["Ngày", "Số lượng"],
          ["2024-12-01", 10],
          ["2024-12-02", 20],
          ["2024-12-03", 15],
        ]);
      } else {
        showModal("Có lỗi xảy ra khi lấy dữ liệu.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showModal("Đã xảy ra lỗi khi lấy thống kê.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [conferenceId]);

  const handleAddParticipant = async () => {
    if (!email) {
      showModal("Vui lòng nhập email người tham gia.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/add-participant", {
        conferenceId,
        email,
      });

      if (response.status === 200) {
        const { invitationLink } = response.data;
        showModal(`Thêm người tham gia thành công. Link tham gia: ${invitationLink}`);
        setEmail("");
        fetchStats(); // Tải lại dữ liệu sau khi thêm người tham gia
      } else {
        showModal(response.data.error || "Có lỗi xảy ra khi thêm người tham gia.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        showModal(error.response.data.error);
      } else {
        showModal("Đã xảy ra lỗi không xác định khi thêm người tham gia.");
      }
      console.error(error);
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalShow(true);
  };

  return (
    <div className="container-fluid dashboard-container">
      {/* Sidebar */}
      <div className="col-md-3 dashboard-sidebar bg-primary text-black p-3">
        <div className="sidebar-header text-center mb-4">
          <h3>Quản lý Phòng</h3>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/create-meeting" className="nav-link text-black">
              <i className="fas fa-calendar-plus"></i> Tạo Cuộc Họp Mới
            </Link>
          </li>
          <li className="nav-item">
            <Link to={`/create-form/${conferenceId}`} className="nav-link text-black">
              <i className="fas fa-calendar-plus"></i> Tạo form hội nghị
            </Link>
          </li>
          <li className="nav-item">
            <Link to={`/update-conference/${conferenceId}`} className="nav-link text-black">
              <i className="fas fa-edit"></i> Quản lý cuộc họp
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/attendancemanager" className="nav-link text-black">
              <i className="fas fa-user-check"></i> Quản lý người điểm danh
            </Link>
          </li>
          <li className="nav-item">
            <Link to={`/users/${conferenceId}`} className="nav-link text-black">
              <i className="fas fa-users"></i> Quản lý Người Dùng
            </Link>
          </li>
          <li className="nav-item">
            <Link to={`/settings/${conferenceId}`} className="nav-link text-black">
              <i className="fas fa-cog"></i> Quản lý câu hỏi
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-md-9 dashboard-main p-4">
        <div className="dashboard-header mb-4">
          <h2 className="text-primary">Tổng Quan Dashboard</h2>
          <p>Hiển thị các số liệu thống kê chi tiết về hoạt động quản lý.</p>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow border-primary">
              <div className="card-header bg-primary text-white">
                <h4>Tổng Số Người Đã Đăng Ký</h4>
              </div>
              <div className="card-body text-center">
                <h2 className="text-primary">{totalRegisteredPeople}</h2>
                <p>Người đã đăng ký tham gia</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow border-success">
              <div className="card-header bg-success text-white">
                <h4>Tổng Người Trong Phòng</h4>
              </div>
              <div className="card-body text-center">
                <h2 className="text-success">{totalPeopleInRoom}</h2>
                <p>Người đang có mặt</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card shadow p-3">
              <h4>Thêm Người Tham Gia</h4>
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Nhập email người tham gia"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAddParticipant}>
                Gửi Link Tham Gia
              </button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow p-3">
              <h4>Theo dõi số người trong phòng</h4>
              <Chart
                chartType="LineChart"
                data={peopleInRoomStats}
                options={{
                  hAxis: { title: "Thời gian" },
                  vAxis: { title: "Số người" },
                  series: { 0: { color: "#4CAF50" } },
                }}
                width="100%"
                height="300px"
              />
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow p-3">
              <h4>Thống kê người dùng đăng ký theo ngày</h4>
              <Chart
                chartType="LineChart"
                data={registeredPeopleByDay}
                options={{
                  hAxis: { title: "Ngày" },
                  vAxis: { title: "Số lượng" },
                  series: { 0: { color: "#FF5722" } },
                }}
                width="100%"
                height="300px"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setModalShow(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashboardManage;
