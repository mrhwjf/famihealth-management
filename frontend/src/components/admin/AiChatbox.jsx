// src/components/admin/AiChatbox.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, List, Avatar, Spin, Typography } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import './AiChatbox.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

const { Text } = Typography;

const AiChatbox = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (value) => {
        if (!value.trim()) return;

        const userMessage = { sender: 'user', text: value };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        // --- Giả lập gọi API đến AI ---
        // Trong dự án thật, bạn sẽ thay thế setTimeout bằng một API call (ví dụ: đến Google Gemini API)
        setTimeout(() => {
            let aiResponseText = `Xin lỗi, tôi chưa được huấn luyện về điều này.`;
            if (value.toLowerCase().includes('tóm tắt')) {
                aiResponseText = 'Để tóm tắt phản hồi, bạn có thể lọc theo trạng thái "Mới" và xem các nội dung chính.';
            } else if (value.toLowerCase().includes('xin chào')) {
                aiResponseText = 'Chào bạn, quản trị viên tuyệt vời!';
            }

            const aiMessage = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
            setLoading(false);
        }, 1500);
    };

    return (
        <Card title="AI Assistant" headStyle={{ background: '#001529', color: '#fff' }}>
            <div className="chat-display">
                <List
                    itemLayout="horizontal"
                    dataSource={messages}
                    renderItem={item => (
                        <List.Item className={`chat-message ${item.sender}`}>
                            <List.Item.Meta
                                avatar={
                                    item.sender === 'ai' ? 
                                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1677ff' }} /> : 
                                    <Avatar icon={<UserOutlined />} />
                                }
                                title={item.sender === 'ai' ? 'AI Assistant' : 'Bạn'}
                                description={item.text}
                            />
                        </List.Item>
                    )}
                />
                {loading && (
                    <div className="typing-indicator">
                        <Spin size="small" />
                        <Text type="secondary" style={{ marginLeft: 8 }}>AI is typing...</Text>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <Input.Search
                placeholder="Nhập câu hỏi cho AI..."
                enterButton="Gửi"
                size="large"
                onSearch={handleSend}
                loading={loading}
                disabled={loading}
            />
        </Card>
    );
};

export default AiChatbox;