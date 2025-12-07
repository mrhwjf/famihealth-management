// MemberProfile.jsx
import React, { useState, useEffect } from "react";
import { getMyFamilyMember } from "../../services/myFamily";
import {
  Card,
  Avatar,
  Descriptions,
  Layout,
  Empty,
  Row,
  Col,
  Table,
  Tabs,
  Typography,
  message,
} from "antd";
import { PhoneOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import MemberMedicalRecords from "./MemberMedicalRecords"; // keep if exists

const { Title } = Typography;
const { Content } = Layout;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const DEFAULT_SESSION_ID = "3d2c4b28-1bed-4aa2-9298-2fcad169182b";

const FALLBACK_TEXT = "Chủ hộ";

const toDisplayText = (value, fallback = FALLBACK_TEXT) =>
  value === null || value === undefined || value === "" ? fallback : value;

const formatGender = (gender) => {
  const map = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };
  return map[gender] || gender || "";
};

const formatBloodType = (bloodType) => {
  const map = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };
  return map[bloodType] || bloodType || "";
};

const calculateAgeFromDob = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return null;
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  const calculated = Math.abs(ageDate.getUTCFullYear() - 1970);
  return Number.isFinite(calculated) ? calculated : null;
};

/**
 * Normalize the shape returned by swagger (or partial shapes from navigation).
 * Swagger sample: response.data.data = { id, user: {...}, name, dob, gender, profileUrl, allergies: [...], vaccinationRecords: [...] }
 */
const normalizeMemberProfile = (raw) => {
  if (!raw) return null;

  const relationshipValue = raw.relationship ?? raw.relationshipToCreator ?? "";

  const allergies = Array.isArray(raw.allergies) ? raw.allergies : [];
  const normalizedAllergies = allergies.map((item) => ({
    ...item,
    name: item.name ?? item.allergens ?? item.allergen ?? "",
    note: item.note ?? item.notes ?? item.notesText ?? "",
  }));

  const vaccinationSource = Array.isArray(raw.vaccinations)
    ? raw.vaccinations
    : Array.isArray(raw.vaccinationRecords)
    ? raw.vaccinationRecords
    : Array.isArray(raw.vaccination_record)
    ? raw.vaccination_record
    : [];
  const normalizedVaccinations = vaccinationSource.map((item) => ({
    ...item,
    name: item.name ?? item.vaccineName ?? item.vaccine_name ?? "",
    date: item.date ?? item.administeredDate ?? item.administered_date ?? "",
    nextDue:
      item.nextDue ??
      item.nextDueDate ??
      item.next_due_date ??
      item.nextDueDate,
  }));

  const normalizedDob = raw.dateofBirth ?? raw.dob ?? raw.birthDate ?? "";
  const computedAge =
    raw.age ?? calculateAgeFromDob(normalizedDob) ?? raw.user?.age ?? null;
  const normalizedBloodType =
    raw.bloodType ?? raw.blood_type ?? raw.user?.bloodType ?? "";

  return {
    ...raw,
    name:
      raw.name ??
      raw.user?.name ??
      `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim(),
    relationship: relationshipValue,
    relationshipToCreator: raw.relationshipToCreator ?? relationshipValue ?? "",
    dateofBirth: normalizedDob,
    phoneNumber:
      raw.phoneNumber ??
      raw.phone ??
      raw.user?.phone ??
      raw.user?.phoneNumber ??
      "",
    cardImage:
      raw.cardImage ??
      raw.profileUrl ??
      raw.user?.profileUrl ??
      raw.user?.profileUrl ??
      "",
    allergies: normalizedAllergies,
    vaccinations: normalizedVaccinations,
    age: computedAge,
    bloodType: formatBloodType(normalizedBloodType),
  };
};

export default function MemberProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const storedSessionId =
    sessionStorage.getItem("sessionId") ||
    sessionStorage.getItem("sessionId") ||
    "";
  const sessionID = storedSessionId || DEFAULT_SESSION_ID;
  const familyID = 1;

  // Use location.state for immediate UI, but still fetch authoritative data below.
  const optimistic = location.state?.member
    ? normalizeMemberProfile(location.state.member)
    : null;

  const [member, setMember] = useState(optimistic);
  const [loading, setLoading] = useState(!optimistic);

  useEffect(() => {
    let cancelled = false;

    async function fetchMember() {
      try {
        setLoading(true);
        const apiResult = await getMyFamilyMember(familyID, sessionID, id);
        if (!cancelled) {
          if (apiResult) {
            // apiResult may be from detail endpoint or fallback (list)
            const normalized = normalizeMemberProfile(apiResult);
            setMember(normalized);

            // If fallback used (no detailed fields present), inform dev/user briefly
            const hasDetailFields =
              (apiResult.allergies && apiResult.allergies.length > 0) ||
              (apiResult.vaccinationRecords &&
                apiResult.vaccinationRecords.length > 0) ||
              (apiResult.vaccinations && apiResult.vaccinations.length > 0);

            if (!hasDetailFields) {
              // minor UX hint — use message.warning if you want user-visible notification
              console.warn(
                "MemberProfile: loaded fallback/summary data (detail endpoint may have failed)."
              );
              message.warning(
                "Chi tiết thành viên chưa tải đầy đủ — đang hiển thị dữ liệu tóm tắt."
              );
            }
          } else {
            // API returned null and no fallback found
            if (!optimistic) {
              setMember(null);
              message.error(
                "Không thể tải dữ liệu thành viên (server trả về lỗi)."
              );
            } else {
              // keep optimistic, but notify
              console.warn(
                "MemberProfile: API returned no data, using optimistic navigation state."
              );
              message.warning(
                "Không thể tải dữ liệu chi tiết từ server — hiển thị dữ liệu tạm thời."
              );
            }
          }
        }
      } catch (err) {
        console.error("fetch member error (unexpected):", err);
        if (!optimistic) {
          setMember(null);
          message.error("Lỗi khi tải dữ liệu thành viên.");
        } else {
          message.warning("Lỗi khi gọi server — hiển thị dữ liệu tạm thời.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMember();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sessionID]); // intentionally not depending on `member` so we always fetch

  if (loading) {
    return (
      <Layout style={layoutStyle}>
        <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout style={layoutStyle}>
        <Card style={{ textAlign: "center" }}>
          <Empty description="Không tìm thấy dữ liệu thành viên" />
        </Card>
      </Layout>
    );
  }

  // ensure arrays
  const allergies = Array.isArray(member.allergies) ? member.allergies : [];
  const vaccinations = Array.isArray(member.vaccinations)
    ? member.vaccinations
    : [];

  const displayName = toDisplayText(member.name);
  const displayRelationship = toDisplayText(
    member.relationshipToCreator || member.relationship
  );
  const displayDob = toDisplayText(member.dateofBirth);
  const displayAge =
    member.age === null || member.age === undefined
      ? FALLBACK_TEXT
      : member.age;
  const displayGender = toDisplayText(formatGender(member.gender));
  const displayPhone = toDisplayText(member.phoneNumber);
  const displayBloodType = toDisplayText(member.bloodType);
  const avatarSrc = member.cardImage || undefined;

  const allergyColumns = [
    { title: "Tên dị ứng", dataIndex: "name", key: "name" },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (v) => toDisplayText(v),
    },
  ];
  const allergyData =
    allergies.length > 0
      ? allergies.map((a, i) => ({
          key: a.id ?? i,
          name: toDisplayText(a.name, "Không xác định"),
          note: toDisplayText(a.note),
        }))
      : [];

  const vaccineColumns = [
    { title: "Tên vaccine", dataIndex: "name", key: "name" },
    { title: "Ngày tiêm", dataIndex: "date", key: "date" },
    {
      title: "Lần tiếp theo",
      dataIndex: "nextDue",
      key: "nextDue",
      render: (v) => toDisplayText(v),
    },
  ];
  const vaccineData =
    vaccinations.length > 0
      ? vaccinations.map((v, i) => ({
          key: v.id ?? i,
          name: toDisplayText(v.name, "Không xác định"),
          date: toDisplayText(v.date),
          nextDue: toDisplayText(v.nextDue),
        }))
      : [];

  const tabs = [
    { key: "family", label: <ArrowLeftOutlined /> },
    {
      key: "profile",
      label: (
        <span style={{ fontWeight: "bold" }}>{`Hồ sơ: ${displayName}`}</span>
      ),
      children: (
        <Content>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={10} lg={8}>
              <Card
                title={<Title level={5}>Thông tin thành viên</Title>}
                bordered
                style={{ height: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <Avatar size={120} src={avatarSrc} />
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Họ tên">
                    {displayName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Quan hệ">
                    {displayRelationship}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {displayDob}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tuổi">
                    {displayAge}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {displayGender}
                  </Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {displayPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhóm máu">
                    {displayBloodType}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} md={14} lg={16}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    title={<Title level={5}>Dị ứng</Title>}
                    extra={
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        {allergyData.length} mục
                      </span>
                    }>
                    <Table
                      columns={allergyColumns}
                      dataSource={allergyData}
                      pagination={false}
                      size="small"
                      locale={{ emptyText: "Không có bản ghi dị ứng" }}
                    />
                  </Card>
                </Col>

                <Col span={24}>
                  <Card
                    title={<Title level={5}>Tiêm chủng</Title>}
                    extra={
                      <span style={{ color: "rgba(0,0,0,0.45)" }}>
                        {vaccineData.length} mũi
                      </span>
                    }>
                    <Table
                      columns={vaccineColumns}
                      dataSource={vaccineData}
                      pagination={false}
                      size="small"
                      locale={{ emptyText: "Không có bản ghi tiêm chủng" }}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      ),
    },
    {
      key: "medical",
      label: <span style={{ fontWeight: "bold" }}>Lịch sử khám chữa bệnh</span>,
      children: <MemberMedicalRecords member={member} />,
    },
  ];

  const onTabChange = (key) => {
    if (key === "family") {
      navigate(-1);
    }
  };

  return (
    <Layout style={layoutStyle}>
      <Tabs items={tabs} defaultActiveKey="profile" onChange={onTabChange} />
    </Layout>
  );
}
