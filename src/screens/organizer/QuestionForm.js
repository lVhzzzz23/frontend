import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/QuestionForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const QuestionForm = ({ conferenceId }) => {
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showDescriptions, setShowDescriptions] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false); // Trạng thái mở dialog
  const [conference, setConference] = useState(null); // Trạng thái lưu thông tin hội nghị
  const { userInfo } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/get_questions/${conferenceId}`
        );
        console.log("Questions: ", response.data.questions); 
        setQuestions(response.data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err); 
        setError("Không thể tải câu hỏi.");
      }
    };
    const fetchConference = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/conference/${conferenceId}`);
        setConference(response.data.conference);
      } catch (err) {
        console.error("Error fetching conference:", err);
        setError("Không thể tải thông tin hội nghị.");
      }
    };
    

    fetchQuestions();
    fetchConference();
  }, [conferenceId]);

  const toggleDescription = (questionId) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/submit_answers", {
        conferenceId,
        userInfo,
        answers,
      });
      setMessage(response.data.message);
      setDialogOpen(true);

      navigate("/camera", { state: { userInfo } });
    } catch (err) {
      setError("Không thể gửi câu trả lời.");
    }
  };

  const closeDialog = () => {
    setDialogOpen(false); // Đóng dialog
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="question-form-container">
      <h2 className="form-title">Form Trả Lời Câu Hỏi</h2>
      <p>
        <strong>Người trả lời:</strong> {userInfo?.fullName || "N/A"}
      </p>

      {conference && conference.image_url && (
        <div className="conference-image">
          <img
            src={conference.image_url}
            alt={conference.name || "Conference Image"}
            className="conference-image"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="question-form">
        {questions.map((question) => (
          <div key={question.question_id} className="question">
            <label className="question-label">
              <strong>Câu hỏi: {question.question_text}</strong>
            </label>
            <button
              type="button"
              className="toggle-description"
              onClick={() => toggleDescription(question.question_id)}
            >
              {showDescriptions[question.question_id] ? "Ẩn mô tả" : "Xem mô tả"}
            </button>
            {showDescriptions[question.question_id] && question.description && (
              <p className="description">{question.description}</p>
            )}

            {question.question_type === "text" && (
              <input
                type="text"
                value={answers[question.question_id] || ""}
                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                placeholder="Nhập câu trả lời"
                className="input-field"
              />
            )}

            {question.question_type === "textarea" && (
              <textarea
                value={answers[question.question_id] || ""}
                onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                placeholder="Nhập câu trả lời"
                className="textarea-field"
              />
            )}

            {question.question_type === "radio" && question.options && (
              <div className="options-container">
                {question.options.map((option, index) => (
                  <label key={index} className="option">
                    <input
                      type="radio"
                      name={question.question_id}
                      value={option}
                      checked={answers[question.question_id] === option}
                      onChange={(e) => handleAnswerChange(question.question_id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.question_type === "checkbox" && question.options && (
              <div className="options-container">
                {question.options.map((option, index) => (
                  <label key={index} className="option">
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers[question.question_id]?.includes(option)}
                      onChange={(e) => {
                        const newAnswers = { ...answers };
                        if (e.target.checked) {
                          newAnswers[question.question_id] = [
                            ...(answers[question.question_id] || []),
                            option,
                          ];
                        } else {
                          newAnswers[question.question_id] = (answers[question.question_id] || []).filter(
                            (ans) => ans !== option
                          );
                        }
                        setAnswers(newAnswers);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="submit-button">
          Gửi câu trả lời
        </button>
      </form>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <p>{message}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuestionForm;
