// ContactDoctor.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  Empty,
  Spin,
  message,
} from "antd";
import { SearchOutlined, PhoneOutlined } from "@ant-design/icons";
import { searchDoctors } from "../../services/contactDoctor";
import { Navigate, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

export default function ContactDoctor() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // UI page (1-based)
  const [pageSize] = useState(6);
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // optional session header if your backend needs it
  const sessionId = sessionStorage.getItem("session_id") || "3d2c4b28-1bed-4aa2-9298-2fcad169182b";

  const fetchDoctors = useCallback(
    async (page = 1, keyword = "") => {
      setLoading(true);
      try {
        // backend expects 0-based page index
        const resp = await searchDoctors({
          field: "",
          keyword: keyword || "",
          roleId: 2, // bác sĩ
          page: 0,
          size: pageSize,
          sessionId,
        });

        // defensive: support a few possible shapes
        const payload = resp ?? {};
        const items = payload.items ?? payload.data?.items ?? [];
        const totalElements =
          payload.totalElements ?? payload.data?.totalElements ?? items.length;

        const mapped = (items || []).map((it) => {
          // fields may vary, so normalize
          const id =
            it.id ?? it.user?.id ?? `${Math.random().toString(36).slice(2, 9)}`;
          const name =
            it.name ??
            it.fullName ??
            it.user?.name ??
            it.displayName ??
            "Không tên";
          const specialty =
            it.specialty ?? it.title ?? it.profession ?? "Bác sĩ đa khoa";
          const phone =
            it.phone ?? it.phoneNumber ?? it.user?.phone ?? "Không có";
          const profileUrl = it.profileUrl ?? it.user?.profileUrl ?? undefined;
          const rating = typeof it.rating === "number" ? it.rating : 4.2;
          const numberOfReviews =
            typeof it.numberOfReviews === "number"
              ? it.numberOfReviews
              : Math.floor(Math.random() * 50 + 5);

          return {
            id,
            doctorName: name,
            specialty,
            contact: phone,
            profileUrl,
            rating,
            numberOfReviews,
          };
        });

        setDoctors(mapped);
        setTotal(totalElements);
      } catch (err) {
        console.error("fetchDoctors unexpected error:", err);
        message.error(
          "Lỗi khi tải danh sách bác sĩ. Kiểm tra console để biết thêm chi tiết."
        );
        setDoctors([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, sessionId]
  );

  // initial load and when page/search change
  useEffect(() => {
    fetchDoctors(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchDoctors]);

  const onSearchClick = () => {
    setCurrentPage(1);
    fetchDoctors(1, searchTerm);
  };

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
            boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
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
                setCurrentPage(1);
              }}
              onPressEnter={onSearchClick}
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
              onClick={onSearchClick}>
              Tìm kiếm
            </Button>
          </Space.Compact>
        </Card>

        {/* Doctor List */}
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {!loading && doctors.length === 0 ? (
              <Col span={24}>
                <Empty description="Không tìm thấy bác sĩ phù hợp." />
              </Col>
            ) : (
              doctors.map((doctor) => (
                <Col xs={24} sm={12} md={8} key={doctor.id}>
                  <Card hoverable title={doctor.doctorName}>
                    <Text strong>Chuyên khoa: </Text>
                    <Text>{doctor.specialty}</Text>
                    <br />
                    <Text strong>Đánh giá: </Text>
                    <Rate allowHalf disabled value={doctor.rating} />
                    <Text style={{ marginLeft: 6 }}>
                      ({doctor.numberOfReviews})
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
                      }}
                      onClick={() => {
                        navigate("/user_family/appointments", {
                          state: {
                            openModal: true,
                            doctorId: doctor.id,
                            doctorName: doctor.doctorName,
                          },
                        });
                      }}>
                      Đặt lịch hẹn
                    </Button>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Spin>

        {/* Pagination */}
        {total > pageSize && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
            }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </Card>
    </Layout>
  );
}
