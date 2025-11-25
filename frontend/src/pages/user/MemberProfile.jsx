//MemberProfile.jsx
import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, Avatar, Descriptions, Layout, Empty, Tabs } from "antd";
import { PhoneOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import MyFamily from "./MyFamily";
import MemberMedicalRecords from "./MemberMedicalRecords";

const { Meta } = Card;
const { TabPane } = Tabs;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

export default function MemberProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const member = location.state?.member;

  if (!member) {
    return (
      <Layout style={layoutStyle}>
        <Card style={{ textAlign: "center" }}>
          <Empty description="Không tìm thấy dữ liệu thành viên" />
        </Card>
      </Layout>
    );
  }

  const handleTabChange = (key) => {
    if (key === "family") {
      navigate("/user_family/my-family"); 
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Tabs defaultActiveKey="profile" onChange={handleTabChange}>
        
        <TabPane tab={<ArrowLeftOutlined />} key="family">
        </TabPane>

        <TabPane tab={<span style={{fontWeight: "bold"}}>{`Hồ sơ: ${member.name}`}</span>} key="profile">
          <Card>
            <Meta title={`Hồ sơ: ${member.name}`} style={{marginBottom: 16}}/>
            <hr style={{ opacity: 0.1 }} />
            <br />
            <Avatar size={120} src={member.cardImage} />
            <Descriptions column={1} bordered style={{ marginTop: 20 }}>
              <Descriptions.Item label="Họ tên">{member.name}</Descriptions.Item>
              <Descriptions.Item label="Quan hệ">{member.relationship}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{member.dateofBirth}</Descriptions.Item>
              <Descriptions.Item label="Tuổi">{member.age}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{member.gender}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                <PhoneOutlined style={{ marginRight: 8 }} />
                {member.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Nhóm máu">{member.bloodType}</Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab={<span style={{fontWeight: "bold"}}>Lịch sử khám chữa bệnh</span>} key="medical">
          <MemberMedicalRecords member={member} />
        </TabPane>

      </Tabs>
    </Layout>
  );
}
