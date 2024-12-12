import React, { useState, useEffect } from 'react'; 
import { Button, List, message, Row, Col, Modal, Input, Form } from 'antd'; 
import { useParams } from 'react-router-dom'; 
import './css/QuestionManagement.css';  

const QuestionManagement = () => {   
  const [questions, setQuestions] = useState([]);   
  const [editingQuestion, setEditingQuestion] = useState(null); // Để lưu câu hỏi đang sửa   
  const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển hiển thị modal   
  const { conferenceId } = useParams();    

  // Fetch danh sách câu hỏi   
  useEffect(() => {     
    fetchQuestions();   
  }, []);    

  const fetchQuestions = async () => {     
    try {       
      const response = await fetch(`http://localhost:5000/get_questions/${conferenceId}`);       
      const data = await response.json();        

      if (response.ok) {         
        setQuestions(data.questions);       
      } else {         
        message.error(data.message);       
      }     
    } catch (error) {       
      message.error("Lỗi khi tải danh sách câu hỏi!");     
    }   
  };    

  // Xóa câu hỏi   
  const handleDelete = async (questionId) => {     
    try {       
      const response = await fetch(`http://localhost:5000/delete_question/${questionId}`, { method: 'DELETE' });       
      const result = await response.json();        

      if (response.ok) {         
        message.success(result.message);         
        fetchQuestions(); // Cập nhật lại danh sách câu hỏi       
      } else {         
        message.error(result.message);       
      }     
    } catch (error) {       
      message.error("Lỗi khi xóa câu hỏi!");     
    }   
  };    

  // Mở modal chỉnh sửa câu hỏi   
  const handleEdit = (question) => {     
    setEditingQuestion(question);     
    setIsModalVisible(true);   
  };    

  // Xử lý khi sửa câu hỏi   
  const handleSaveEdit = async (values) => {     
    try {       
      const response = await fetch(`http://localhost:5000/update_question/${editingQuestion.question_id}`, {         
        method: 'PUT',         
        headers: {           
          'Content-Type': 'application/json',         
        },         
        body: JSON.stringify(values),       
      });       
      const result = await response.json();        

      if (response.ok) {         
        message.success(result.message);         
        fetchQuestions(); // Cập nhật lại danh sách câu hỏi         
        setIsModalVisible(false); // Đóng modal       
      } else {         
        message.error(result.message);       
      }     
    } catch (error) {       
      message.error("Lỗi khi sửa câu hỏi!");     
    }   
  };    

  return (     
    <div className="question-management">       
      <Row gutter={16}>         
        <Col span={24} className="header-container">           
          <h2 className="title">Quản lý câu hỏi</h2>         
        </Col>       
      </Row>        

      {/* Hiển thị danh sách câu hỏi */}       
      <List         
        dataSource={questions}         
        renderItem={item => (           
          <List.Item             
            key={item.question_id}             
            actions={[               
              <Button                 
                type="link"                 
                danger                 
                onClick={() => handleDelete(item.question_id)}                 
                style={{ color: '#ff4d4f' }}               
              >                 
                Xóa               
              </Button>,               
              <Button                 
                type="link"                 
                onClick={() => handleEdit(item)}                 
                style={{ color: '#1890ff' }}               
              >                 
                Sửa               
              </Button>             
            ]}           
          >             
            <List.Item.Meta               
              title={<strong>Câu hỏi: {item.question_text}</strong>}               
              description={`Loại: ${item.question_type} | Mô tả: ${item.description}`}             
            />           
          </List.Item>         
        )}       
      />        

      {/* Modal chỉnh sửa câu hỏi */}       
      <Modal         
        title="Chỉnh sửa câu hỏi"         
        visible={isModalVisible}         
        onCancel={() => setIsModalVisible(false)}         
        footer={null}         
        closable={true} // Đảm bảo rằng có dấu "X" để đóng       
      >         
        <Form           
          initialValues={{             
            question_text: editingQuestion?.question_text,             
            question_type: editingQuestion?.question_type,             
            description: editingQuestion?.description,             
            options: editingQuestion?.options,           
          }}           
          onFinish={handleSaveEdit}         
        >           
          <Form.Item             
            name="question_text"             
            label="Câu hỏi"             
            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}           
          >             
            <Input />           
          </Form.Item>            

          <Form.Item             
            name="question_type"             
            label="Loại câu hỏi"             
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}           
          >             
            <Input />           
          </Form.Item>            

          <Form.Item name="description" label="Mô tả">             
            <Input />           
          </Form.Item>            

          <Form.Item             
            name="options"             
            label="Tùy chọn"             
            rules={[{ type: 'array', message: 'Vui lòng nhập ít nhất một tùy chọn!' }]}>             
            <Input.TextArea />           
          </Form.Item>            

          <Form.Item>             
            <Button type="primary" htmlType="submit">               
              Lưu             
            </Button>           
          </Form.Item>         
        </Form>       
      </Modal>     
    </div>   
  ); 
};  

export default QuestionManagement; 
