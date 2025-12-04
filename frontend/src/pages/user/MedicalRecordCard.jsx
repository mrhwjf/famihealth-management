import React from "react";
import dayjs from "dayjs";
import { Card, Avatar, Descriptions, Typography, Space, Button } from "antd";
import { FileOutlined } from "@ant-design/icons";

const { Title } = Typography;

// ----- Fake member info -----
const fakeMember = {
  name: "Nguyễn Văn Demo",
  age: 28,
  gender: "Nam",
  bloodType: "O+",
  avatar:
    "https://i.pravatar.cc/300",
};

// ----- Fake data gắn thẳng vào Card -----
const fakeMedicalRecords = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  date: dayjs().add(i, "day").format("DD/MM/YYYY"),
  doctorName: `BS. Demo ${i + 1}`,
  facility: `Bệnh viện Demo ${i + 1}`,
  diagnosis: `Chẩn đoán Demo ${i + 1}`,
  treatment: `Điều trị Demo ${i + 1}`,
  follow_up_date: dayjs().add(i + 5, "day").format("DD/MM/YYYY"),
  documents: Array.from({ length: 2 }, (_, j) => ({
    id: i * 2 + j + 1,
    file_name: `File Demo ${i + 1}-${j + 1}.pdf`,
    file_url: `https://example.com/file-demo-${i + 1}-${j + 1}.pdf`,
    upload_date: dayjs().add(i + j, "day").format("DD/MM/YYYY"),
    description: `Mô tả file Demo ${i + 1}-${j + 1}`,
  })),
}));

export default function MedicalRecordCard() {
  return (
    <>
      {/* ---- Thông tin bệnh nhân ---- */}
      <Card style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar size={120} src={fakeMember.avatar} />

        <Title level={3} style={{ marginTop: 10 }}>
          {fakeMember.name}
        </Title>

        <Descriptions column={1} bordered style={{ marginTop: 20 }}>
          <Descriptions.Item label="Tuổi">{fakeMember.age}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {fakeMember.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Nhóm máu">
            {fakeMember.bloodType}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ---- Danh sách hồ sơ y tế ---- */}
      <Title level={3}>Hồ sơ khám chữa bệnh</Title>

      {fakeMedicalRecords.map((record) => (
        <Card key={record.id} style={{ marginBottom: 20 }}>
          <Title level={4}>Hồ sơ ngày {record.date}</Title>

          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Bác sĩ">
              {record.doctorName}
            </Descriptions.Item>
            <Descriptions.Item label="Cơ sở y tế">
              {record.facility}
            </Descriptions.Item>
            <Descriptions.Item label="Chẩn đoán">
              {record.diagnosis}
            </Descriptions.Item>
            <Descriptions.Item label="Điều trị">
              {record.treatment}
            </Descriptions.Item>
            <Descriptions.Item label="Tái khám">
              {record.follow_up_date}
            </Descriptions.Item>
          </Descriptions>

          <br />

          <Title level={5}>Tài liệu đính kèm</Title>
          <Space direction="vertical">
            {record.documents.map((doc) => (
              <Button
                key={doc.id}
                icon={<FileOutlined />}
                type="default"
                href={doc.file_url}
                target="_blank"
              >
                {doc.file_name}
              </Button>
            ))}
          </Space>
        </Card>
      ))}
    </>
  );
}
