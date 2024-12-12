import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./css/DashboardAdmin.css";

const DashboardAdmin = () => {
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [totalFormsCreated, setTotalFormsCreated] = useState(0);
  const [totalRegisteredPeople, setTotalRegisteredPeople] = useState(0);
  const [meetingsByMonth, setMeetingsByMonth] = useState([["Tháng", "Số cuộc họp"]]);

  const peopleInRoomStats = [
    ["Thời gian", "Số lượng form"],
    ["01/12/2024", 10],
    ["02/12/2024", 15],
    ["03/12/2024", 20],
    ["04/12/2024", 25],
    ["05/12/2024", 18],
  ];

  useEffect(() => {
    // Lấy số liệu tổng quan
    axios
      .get("http://localhost:5000/get_stats")
      .then((response) => {
        const data = response.data;
        setTotalMeetings(data.total_meetings || 0);
        setTotalFormsCreated(data.total_forms_created || 0);
        setTotalRegisteredPeople(data.total_registered_people || 0);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API get_stats:", error);
      });

    // Lấy số liệu cuộc họp theo tháng
    axios
      .get("http://localhost:5000/get_meetings_by_month")
      .then((response) => {
        const meetingsData = response.data;

        // Format lại dữ liệu
        const formattedData = [
          ["Tháng", "Số cuộc họp"],
          ...meetingsData.map((item) => {
            const monthString = String(item[0]); // Tháng dạng chuỗi
            const meetingCount = Number(item[1]); // Số cuộc họp dạng số
            return [monthString, meetingCount];
          }),
        ];

        setMeetingsByMonth(formattedData);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gọi API get_meetings_by_month:", error);
        setMeetingsByMonth([["Tháng", "Số cuộc họp"]]); // Dữ liệu mặc định
      });
  }, []);

  return (
    <div className="container-fluid dashboard-container">
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
                <h4>Tổng Số Form Đã Tạo</h4>
              </div>
              <div className="card-body text-center">
                <h2 className="text-success">{totalFormsCreated}</h2>
                <p>Form đã được tạo</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow border-info">
              <div className="card-header bg-info text-white">
                <h4>Tổng Số Cuộc Họp</h4>
              </div>
              <div className="card-body text-center">
                <h2 className="text-info">{totalMeetings}</h2>
                <p>Cuộc họp đã tổ chức</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow p-3">
              <h4>Số lượng form theo ngày</h4>
              <Chart
                chartType="LineChart"
                data={peopleInRoomStats}
                options={{
                  hAxis: { title: "Ngày" },
                  vAxis: { title: "Số lượng form" },
                  series: { 0: { color: "#4CAF50" } },
                }}
                width="100%"
                height="300px"
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow p-3">
              <h4>Số cuộc họp theo tháng</h4>
              {meetingsByMonth.length > 1 ? (
                <Chart
                  chartType="ColumnChart"
                  data={meetingsByMonth}
                  options={{
                    hAxis: { title: "Tháng" },
                    vAxis: { title: "Số cuộc họp" },
                    legend: { position: "none" },
                  }}
                  width="100%"
                  height="300px"
                />
              ) : (
                <p>Không có dữ liệu để hiển thị.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
