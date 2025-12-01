import React, { useState, useEffect } from 'react';
import { Row, Col, List, Typography, Tag, Dropdown, Menu, message, Empty, Button } from 'antd';
import { MoreOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import AiChatbox from '../../components/admin/AiChatBox';

const { Title, Text, Paragraph } = Typography;

const initialFeedbackData = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', content: 'Ứng dụng rất hữu ích, tuy nhiên giao diện phần đặt lịch hẹn hơi khó dùng. Mong team cải thiện.', date: '2025-10-12', status: 'new' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', content: 'Tính năng nhắc nhở uống thuốc hoạt động không ổn định, đôi khi bị trễ thông báo.', date: '2025-10-11', status: 'new' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', content: 'Cảm ơn đội ngũ đã tạo ra một sản phẩm tuyệt vời cho gia đình!', date: '2025-10-10', status: 'resolved' },
];

const FeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setFeedbackList(initialFeedbackData);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMenuClick = (e, item) => {
        if (e.key === 'resolve') {
            const newList = feedbackList.map(fb => fb.id === item.id ? { ...fb, status: 'resolved' } : fb);
            setFeedbackList(newList);
            message.success(`Đã giải quyết phản hồi từ ${item.name}`);
        } else if (e.key === 'delete') {
            const newList = feedbackList.filter(fb => fb.id !== item.id);
            setFeedbackList(newList);
            message.success(`Đã xóa phản hồi từ ${item.name}`);
        }
    };

    const menu = (item) => (
        <Menu onClick={(e) => handleMenuClick(e, item)}>
            {item.status === 'new' && (
                 <Menu.Item key="resolve" icon={<CheckCircleOutlined />}>
                    Đánh dấu đã giải quyết
                </Menu.Item>
            )}
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Xóa
            </Menu.Item>
        </Menu>
    );

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
                <Title level={2}>Hòm thư Phản hồi</Title>
                <List
                    loading={loading}
                    itemLayout="vertical"
                    dataSource={feedbackList}
                    locale={{ emptyText: <Empty description="Chưa có phản hồi nào." /> }}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <Tag color={item.status === 'new' ? 'blue' : 'green'}>
                                    {item.status === 'new' ? 'Mới' : 'Đã giải quyết'}
                                </Tag>
                            ]}
                            extra={
                                <Dropdown overlay={menu(item)} trigger={['click']}>
                                    <Button shape="circle" icon={<MoreOutlined />} />
                                </Dropdown>
                            }
                        >
                            <List.Item.Meta
                                title={<a href={`mailto:${item.email}`}>{item.name}</a>}
                                description={`Gửi lúc: ${item.date}`}
                            />
                            <Paragraph>{item.content}</Paragraph>
                        </List.Item>
                    )}
                />
            </Col>
            <Col xs={24} lg={8}>
                 <div style={{ position: 'sticky', top: '24px' }}>
                    <AiChatbox />
                </div>
            </Col>
        </Row>
    );
};

export default FeedbackPage;