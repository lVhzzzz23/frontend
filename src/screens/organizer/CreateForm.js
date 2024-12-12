import React, { useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';  
import axios from 'axios';  
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap

const CreateForm = () => {  
    const { conferenceId } = useParams();  
    const navigate = useNavigate(); // Initialize navigate  
    const [conferenceDescription, setConferenceDescription] = useState('');  
    const [questions, setQuestions] = useState([]);  
    const [conferenceImage, setConferenceImage] = useState(null);  
    const [isLoading, setIsLoading] = useState(false);  
    const [errorMessage, setErrorMessage] = useState(null);  
    const [showModal, setShowModal] = useState(false); // To control modal visibility  
    const [modalMessage, setModalMessage] = useState(''); // Message to show in the modal  

    const handleQuestionChange = (index, field, value) => {  
        const newQuestions = [...questions];  
        newQuestions[index][field] = value;  
        setQuestions(newQuestions);  
    };

    const handleAddQuestion = () => {  
        setQuestions([  
            ...questions,  
            { 
                question: '', 
                question_type: 'text', 
                options: [], 
                description: '', 
                image: null 
            }  
        ]);  
    };

    const handleRemoveQuestion = (index) => {  
        const newQuestions = questions.filter((_, i) => i !== index);  
        setQuestions(newQuestions);  
    };

    const handleImageChange = (e) => {  
        const file = e.target.files[0];  
        const reader = new FileReader();  
        reader.onloadend = () => {  
            setConferenceImage(reader.result); // Save as base64 string  
        };  
        if (file) {  
            reader.readAsDataURL(file);  
        }  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
    
        try {
            const data = {
                conference_id: conferenceId,
                conference_description: conferenceDescription,
                conference_image: conferenceImage, // This will be a base64 string
                questions: questions,
            };
    
            const response = await axios.post('http://localhost:5000/add_questions', data, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.data && response.data.inserted_ids) {
                setModalMessage('Form đã được tạo thành công!');
                setShowModal(true);
            } else {
                setModalMessage('Không thể thêm câu hỏi. Vui lòng thử lại.');
                setShowModal(true);
            }
        } catch (error) {
            setModalMessage('Đã xảy ra lỗi khi tạo form.');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (  
        <div className="container">  
            <h2>Tạo Form Hội Nghị</h2>  

            <form onSubmit={handleSubmit}>  
                <div className="form-group">  
                    <label htmlFor="conference_description">Mô tả hội nghị</label>  
                    <textarea  
                        className="form-control"  
                        id="conference_description"  
                        rows="3"  
                        value={conferenceDescription}  
                        onChange={(e) => setConferenceDescription(e.target.value)}  
                    />  
                </div>  

                <div className="form-group">  
                    <label htmlFor="conference_image">Tải lên ảnh tiêu đề</label>  
                    <input  
                        type="file"  
                        className="form-control"  
                        id="conference_image"  
                        onChange={handleImageChange}  
                    />  
                </div>  

                <h4>Các câu hỏi</h4>  
                {questions.map((question, index) => (  
                    <div key={index} className="question-form">  
                        <div className="form-group">  
                            <label>Câu hỏi</label>  
                            <input  
                                type="text"  
                                className="form-control"  
                                value={question.question}  
                                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}  
                                placeholder="Nhập câu hỏi"  
                                required  
                            />  
                        </div>  

                        <div className="form-group">  
                            <label>Loại câu hỏi</label>  
                            <select  
                                className="form-control"  
                                value={question.question_type}  
                                onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}  
                            >  
                                <option value="text">Trả lời ngắn</option>  
                                <option value="long_text">Trả lời dài</option>  
                                <option value="single_choice">Lựa chọn 1 câu trả lời</option>  
                                <option value="multiple_choice">Chọn nhiều đáp án</option>  
                                <option value="date">Chọn ngày tháng</option>  
                            </select>  
                        </div>  

                        <div className="form-group">  
                            <label>Mô tả</label>  
                            <textarea  
                                className="form-control"  
                                value={question.description}  
                                onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}  
                                placeholder="Mô tả câu hỏi"  
                                required  
                            />  
                        </div>  

                        {question.question_type === 'single_choice' || question.question_type === 'multiple_choice' ? (  
                            <div className="form-group">  
                                <label>Lựa chọn (nếu có)</label>  
                                <input  
                                    type="text"  
                                    className="form-control"  
                                    value={question.options.join(', ')}  
                                    onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(', '))}  
                                    placeholder="Nhập các lựa chọn, cách nhau bằng dấu phẩy"  
                                />  
                            </div>  
                        ) : null}

                        {question.question_type === 'date' ? (  
                            <div className="form-group">  
                                <label>Chọn ngày</label>  
                                <input  
                                    type="date"  
                                    className="form-control"  
                                    value={question.date}  
                                    onChange={(e) => handleQuestionChange(index, 'date', e.target.value)}  
                                />  
                            </div>  
                        ) : null}  

                        <div className="form-group">  
                            <label>Ảnh câu hỏi</label>  
                            <input  
                                type="file"  
                                className="form-control"  
                                onChange={(e) => handleQuestionChange(index, 'image', e.target.files[0])}  
                            />  
                        </div>  

                        <button type="button" className="btn btn-danger" onClick={() => handleRemoveQuestion(index)}>  
                            Xóa câu hỏi  
                        </button>  
                        <hr />  
                    </div>  
                ))}  

                <button type="button" className="btn btn-success" onClick={handleAddQuestion}>  
                    Thêm câu hỏi  
                </button>  

                <div className="form-group mt-3">  
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>  
                        {isLoading ? 'Đang tạo...' : 'Tạo form'}  
                    </button>  
                </div>  
            </form>  

            {/* Modal */}  
            <Modal show={showModal} onHide={() => setShowModal(false)}>  
                <Modal.Header closeButton>  
                    <Modal.Title>{modalMessage.includes('thành công') ? 'Thành công' : 'Lỗi'}</Modal.Title>  
                </Modal.Header>  
                <Modal.Body>{modalMessage}</Modal.Body>  
                <Modal.Footer>  
                    <Button variant="secondary" onClick={() => setShowModal(false)}>  
                        Đóng  
                    </Button>  
                </Modal.Footer>  
            </Modal>  
        </div>  
    );  
};

export default CreateForm;
