import React, { useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import {
  Layout,
  Card,
  Typography,
  Input,
  Button,
  Space,
  Row,
  Col,
  Rate,
  Pagination,
} from "antd";
import { SearchOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

// Tạo thêm dữ liệu ví dụ
const example_data = Array.from({ length: 30 }, (_, i) => ({
  rating: parseFloat((4 + Math.random() * 1).toFixed(1)),
  numberOfReviews: Math.floor(Math.random() * 200 + 20),
  doctorName: `BS. Demo ${i + 1}`,
  specialty: ["Tim mạch", "Nội tiết", "Tai mũi họng", "Da liễu"][i % 4],
  contact: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
}));

export default function ContactDoctor() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // số bác sĩ trên mỗi trang

  const filteredData = example_data.filter(
    (d) =>
      d.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Layout style={layoutStyle}>
      <Card>
        <Title
          level={isMobile ? 4 : 2}
          style={{ fontWeight: "bold", textAlign: "center", marginBottom: 24 }}>
          Tìm kiếm Bác sĩ & Chuyên gia Y tế
        </Title>
        <Text
          type="secondary"
          style={{
            fontSize: 16,
            textAlign: "center",
            display: "block",
            marginBottom: 24,
          }}>
          Đặt lịch hẹn với bác sĩ phù hợp nhất cho sức khỏe gia đình bạn một
          cách dễ dàng và nhanh chóng.
        </Text>

        {/* Search Bar */}
        <Card
          style={{
            margin: "auto",
            width: isMobile ? "100%" : "fit-content",
            boxShadow:
              "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
            marginBottom: 32,
          }}>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Bác sĩ, chuyên khoa, ..."
              prefix={
                <SearchOutlined style={{ fontSize: 16, marginRight: 4 }} />
              }
              style={{
                fontSize: 16,
                border: "none",
                backgroundColor: "#f0f2f5",
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset về trang 1 khi tìm kiếm
              }}
              autoFocus={true}
              autoComplete="off"
            />
            <Button
              type="primary"
              style={{
                marginBottom: "1.5px",
                backgroundColor: "#13ec5b",
                fontSize: 16,
                fontWeight: "bold",
                color: "black",
                border: "none",
              }}
              onClick={() => {}}>
              Tìm kiếm
            </Button>
          </Space.Compact>
        </Card>

        {/* Doctor List */}
        <Row gutter={[16, 16]}>
          {paginatedData.length === 0 ? (
            <Col span={24}>
              <Text type="secondary">Không tìm thấy bác sĩ phù hợp.</Text>
            </Col>
          ) : (
            paginatedData.map((doctor, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <Card
                  hoverable
                  title={doctor.doctorName}
                  extra={
                    <Rate disabled allowHalf defaultValue={doctor.rating} />
                  }>
                  <Text strong>Chuyên khoa: </Text>
                  <Text>{doctor.specialty}</Text>
                  <br />
                  <Text strong>Đánh giá: </Text>
                  <Text>
                    {doctor.rating} ({doctor.numberOfReviews} reviews)
                  </Text>
                  <br />
                  <Text strong>Liên hệ: </Text>
                  <Text>
                    <PhoneOutlined /> {doctor.contact}
                  </Text>
                  <br />
                  <Button
                    type="primary"
                    style={{
                      marginTop: 8,
                      backgroundColor: "#13ec5b",
                      color: "black",
                      fontWeight: "bold",
                      border: "none",
                    }}>
                    Đặt lịch hẹn
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Pagination */}
        {filteredData.length > pageSize && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
            }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </Card>
    </Layout>
  );
}
