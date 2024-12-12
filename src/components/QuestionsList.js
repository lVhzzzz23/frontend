import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate

const QuestionsList = ({ conferenceId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({}); // Lưu trữ các câu trả lời
  const navigate = useNavigate(); // Khởi tạo navigate

  // Gọi API để lấy danh sách câu hỏi theo hội nghị
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/get_questions/674537f570bff5741057fef6`
        );
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách câu hỏi. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [conferenceId]);

  // Xử lý thay đổi câu trả lời
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Xử lý gửi câu trả lời và chuyển qua Step2
  const handleSubmit = () => {
    // Bạn có thể gửi câu trả lời qua API ở đây nếu cần, sau đó chuyển qua Step2
    console.log("Câu trả lời đã được gửi:", answers);

    // Chuyển hướng sang Step2
    navigate("/registerface");
  };

  if (loading) {
    return <p>Đang tải danh sách câu hỏi...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Câu Hỏi Theo Hội Nghị</h2>
      {questions.length === 0 ? (
        <p>Không có câu hỏi nào được tìm thấy cho hội nghị này.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {questions.map((question) => (
            <li
              key={question.question_id}
              style={{
                border: "1px solid #ddd",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Câu hỏi:</strong> {question.question_text}
              </p>
              <div>
                {/* Hiển thị tùy thuộc vào loại câu hỏi */}
                {question.question_type === "text" ? (
                  <div>
                    <label>Trả lời: </label>
                    <input
                      type="text"
                      value={answers[question.question_id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.question_id, e.target.value)
                      }
                      placeholder="Nhập câu trả lời..."
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                ) : question.question_type === "multiple_choice" ? (
                  <div>
                    <label>Trả lời: </label>
                    <select
                      value={answers[question.question_id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.question_id, e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Chọn một lựa chọn...</option>
                      {question.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p>Loại câu hỏi không xác định.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Nút Gửi ở cuối cùng */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Gửi Câu Trả Lời
        </button>
      </div>
    </div>
  );
};

export default QuestionsList;
