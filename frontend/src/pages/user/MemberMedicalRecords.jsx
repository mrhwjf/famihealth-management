// MemberMedicalRecord.jsx
import React from "react";
import { Card, Descriptions, Typography, Space, Button } from "antd";
import { FileOutlined } from "@ant-design/icons";

const { Title } = Typography;

// =============================
// 🔥 FAKE DATA (FULL VERSION)
// =============================
const fakeMedicalRecords = [
  {
    id: 1,
    family_member_id: 10,
    date: "2025-01-10",
    diagnosis: "X-quang phổi, xét nghiệm máu",
    treatment: "Kê thuốc kháng sinh, tái khám sau 2 tuần",
    follow_up_date: "2025-01-24",
    doctorName: "Bs. Lê Văn Long",
    facility: "BV Chợ Rẫy",
    documents: [
      {
        id: 1001,
        file_name: "xray_chest.jpg",
        file_url:
          "https://images.pexels.com/photos/4226268/pexels-photo-4226268.jpeg",
      },
      {
        id: 1002,
        file_name: "blood_test.pdf",
        file_url:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  },
  {
    id: 2,
    family_member_id: 10,
    date: "2024-12-05",
    diagnosis: "Đau đầu Migraine",
    treatment: "Thuốc giảm đau, nghỉ ngơi, giảm stress",
    follow_up_date: "2024-12-20",
    doctorName: "Bs. Nguyễn Minh Anh",
    facility: "Phòng khám Hòa Hảo",
    documents: [
      {
        id: 2001,
        file_name: "scan_results.pdf",
        file_url:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 2002,
        file_name: "medicine_plan.jpg",
        file_url:
          "https://images.pexels.com/photos/4021772/pexels-photo-4021772.jpeg",
      },
    ],
  },
];

// =============================
// 🔥 COMPONENT RENDER MEDICAL RECORDS
// =============================
export default function MemberMedicalRecord() {
  return (
    <>
      <Title level={3} style={{ marginBottom: 20 }}>
        Hồ sơ y tế thành viên
      </Title>

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

            <Descriptions.Item label="Ngày tái khám">
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
                target="_blank">
                {doc.file_name}
              </Button>
            ))}
          </Space>
        </Card>
      ))}
    </>
  );
}
