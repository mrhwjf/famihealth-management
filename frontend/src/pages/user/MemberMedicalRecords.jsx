//MemberMedicalRecords.jsx
import React from "react";
import { Card, Avatar, Descriptions, Layout } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
const { Meta } = Card;

export default function MemberMedicalRecords({ member }) {

  if (!member) {
    return (
      <Layout style={layoutStyle}>
        <Card style={{ textAlign: "center" }}>
          Không tìm thấy dữ liệu thành viên
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <Meta title={`Hồ sơ: ${member.name}`} style={{marginBottom: 16}}/>
        <hr style={{opacity: 0.1}}/>
        <br />
        <Avatar size={120} src={member.cardImage} />
        <Descriptions column={1} bordered style={{ marginTop: 20 }}>
          <Descriptions.Item label="Họ tên">{member.name}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{member.dateofBirth}</Descriptions.Item>
          <Descriptions.Item label="Tuổi">{member.age}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{member.gender}</Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">{member.bloodType}</Descriptions.Item>

          <Descriptions.Item label="Chẩn đoán">X-Ray, xét nghiệm máu</Descriptions.Item>
          <Descriptions.Item label="Điều trị">Chôn he died</Descriptions.Item>
        </Descriptions>
      </Card>
    </Layout>
  );
}
