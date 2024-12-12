import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./css/AttendanceManager.css";
import { useParams } from "react-router-dom";

const AttendanceManager = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const { conferenceId } = useParams(); // Get conferenceId from route params

  // Hàm fetch dữ liệu từ API GET
  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/attendance/${conferenceId}`);
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setAttendanceData(data); // Cập nhật state với dữ liệu trả về
      } else {
        console.error("Dữ liệu không hợp lệ hoặc không có dữ liệu");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi lấy dữ liệu:", error);
    }
  };

  // Gọi API khi component được render
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Hàm xuất dữ liệu ra file Excel
  const handleExport = () => {
    // Phân loại dữ liệu thành check-in, check-out và tổng hợp
    const checkInData = attendanceData.filter(person => person.status === "in").map((person) => ({
      Name: person.name,
      Email: person.email,
      Timestamp: person.timestamp || "N/A",
    }));

    const checkOutData = attendanceData.filter(person => person.status === "out").map((person) => ({
      Name: person.name,
      Email: person.email,
      Timestamp: person.timestamp || "N/A",
    }));

    const totalData = attendanceData.map((person) => {
      const isCheckedIn = person.status === "in" ? "Check In" : "Check Out";
      return {
        Name: person.name,
        Email: person.email,
        Status: isCheckedIn,
        Timestamp: person.timestamp || "N/A",
      };
    });

    // Tạo các sheet
    const wsCheckIn = XLSX.utils.json_to_sheet(checkInData);
    const wsCheckOut = XLSX.utils.json_to_sheet(checkOutData);
    const wsTotal = XLSX.utils.json_to_sheet(totalData);

    // Tạo workbook và thêm các sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsCheckIn, "Check-in");
    XLSX.utils.book_append_sheet(wb, wsCheckOut, "Check-out");
    XLSX.utils.book_append_sheet(wb, wsTotal, "Tổng hợp");

    // Tạo file Excel và xuất
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "attendance.xlsx");
  };

  return (
    <div className="attendance-manager">
      <h1>Quản lý điểm danh</h1>
      <div className="attendance-summary">
        <h2>Bảng tổng hợp</h2>
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Trạng thái điểm danh</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((person, index) => {
              const firstCheckIn = person.timestamp || "N/A";
              const isCheckedIn = person.status === "in" ? "Check In" : "Check Out";
              const statusColor = person.status === "in" ? "green" : "red"; // Xác định màu sắc dựa vào trạng thái

              return (
                <tr key={index}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td style={{ color: statusColor }}>{isCheckedIn}</td>
                  <td>{firstCheckIn}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={handleExport}>Xuất Excel</button>
    </div>
  );
};

export default AttendanceManager;
