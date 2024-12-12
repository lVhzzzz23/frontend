import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./css/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const { conferenceId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        console.log("conferenceId from URL:", conferenceId); // Debug conferenceId

        const fetchParticipants = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/participants/${conferenceId}`);
                setUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải danh sách người tham gia.");
                setLoading(false);
            }
        };

        if (conferenceId) {
            fetchParticipants();
        }
    }, [conferenceId]);

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người tham gia này?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:5000/users/${userId}`);
                if (response.status === 200) {
                    setUsers(users.filter((user) => user._id !== userId));
                    alert("Người tham gia đã được xóa thành công.");
                }
            } catch (err) {
                alert("Không thể xóa người tham gia. Vui lòng thử lại sau.");
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(
            (user) =>
                (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (error) return <p>{error}</p>;

    return (
        <div className="container-fluid user-management-container">
            <div className="header mb-4">
                <h2>Quản Lý Người Dùng</h2>
                <p>Quản lý và thao tác trên danh sách người tham gia hội nghị.</p>
            </div>
            <div className="search-bar mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Ngày Tạo</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{indexOfFirstUser + index + 1}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/users/edit/${user._id}`} className="btn btn-primary btn-sm mr-2">
                                        Chỉnh sửa
                                    </Link>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không có người tham gia nào khớp với tìm kiếm.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {filteredUsers.length > itemsPerPage && (
                <nav className="pagination-container">
                    <ul className="pagination justify-content-center">
                        {[...Array(totalPages).keys()].map((page) => (
                            <li key={page} className={`page-item ${currentPage === page + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => paginate(page + 1)}>
                                    {page + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default UserManagement;
