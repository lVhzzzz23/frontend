import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UserEditForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}`);
                console.log("Dữ liệu từ API:", response.data);
                setUser({
                    fullName: response.data.fullName || "",
                    email: response.data.email || "",
                    phone: response.data.phone || "",
                });
                setLoading(false);
            } catch (err) {
                setError("Không thể tải thông tin người dùng.");
                setLoading(false);
                console.error("Lỗi khi tải người dùng:", err);
            }
        };
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/users/update/${userId}`, user);
            if (response.status === 200) {
                alert("Thông tin người dùng đã được cập nhật.");
                navigate("/users");
            }
        } catch (err) {
            alert("Không thể cập nhật thông tin người dùng.");
            console.error("Lỗi khi cập nhật thông tin người dùng:", err);
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h2>Chỉnh Sửa Thông Tin Người Dùng</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Tên đầy đủ</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="form-control"
                        value={user.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={user.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default UserEditForm;
