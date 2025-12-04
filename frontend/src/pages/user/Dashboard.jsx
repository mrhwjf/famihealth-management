// StoreLayout.jsx
import React, { useState, useEffect } from "react";
import imgGrass from "./mau-anh-the-dep-lam-the-can-cuoc.jpg";
import imgPhong from "./a12f377df925c0bffdc309b91a2efcf4.jpg";
import imgThai from "./anh-the-hoc-sinh_100828479.jpg";
import imgPhu from "./anh-the-hoc-sinh-phong-xanh.jpg";
import useIsMobile from "../../hooks/useIsMobile";
import {
  Layout,
  Menu,
  Input,
  Badge,
  Drawer,
  Button,
  Row,
  Col,
  Card,
  Avatar,
  Space,
  Select,
  Flex,
  Calendar,
  theme,
  List,
  Typography,
} from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;
const { Meta } = Card;
const { Text } = Typography;
//Calendar onPanelChange function
const onPanelChange = (value, mode) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};
//fake data
//1. Family Overview data

const FamilyOverview_data = {
  familyName: "3 ae lọ chéo Family",
  address: "273 An Dương Vương",
  contactPhone: "0912345678",
  linkedDoctorsCount: "3",
  //family invite code button can be added later
};
//2. Family Members data
const FamilyMembers_data = [
  {
    familyID: "1",
    name: "Nguyễn Grass",
    relationship: "Father",
    age: 20,
    gender: "Male",
    bloodType: "O+",
    cardImage: imgGrass, //add image later
  },
  {
    familyID: "1",
    name: "Nguyễn Hữu Phong",
    relationship: "Wife",
    age: 19,
    gender: "Female",
    bloodType: "A-",
    cardImage: imgPhong,
  },
  {
    familyID: "1",
    name: "Hồ Thanh Thái",
    relationship: "Son",
    age: 18,
    gender: "Male",
    bloodType: "B+",
    cardImage: imgThai,
  },
  {
    familyID: "1",
    name: "Đỗ Thiên Phú",
    relationship: "Daughter",
    age: 17,
    gender: "Female",
    bloodType: "AB-",
    cardImage: imgPhu,
  },
];
//3. Alerts & Health Reminders data
const AlertsandHealthReminders_data = [
  {
    name: "Nguyễn Grass",
    alert: "Upcoming dental check: 20/11/2023",
  },
  {
    name: "Nguyễn Hữu Phong",
    alert: "Kid's vaccine reminder: 25/12/2023",
  },
  {
    name: "Đỗ Thiên Phú",
    alert: "Upcoming dental check: 20/11/2023",
  },
  {
    name: "Hồ Thanh Thái",
    alert: "Upcoming dental check: 20/11/2023",
  },
];
//4. Upcoming Appointments data
// const UpcomingAppointments_data = [
//   {
//     name: "Nguyễn Grass",
//     doctorName: "Dr. Lê Văn Long",
//     date: "20/11/2023",
//     time: "9:00 AM",
//     status: "Scheduled",
//     //Book new appointment button can be added later
//   },
//   {
//     name: "Nguyễn Hữu Phong",
//     doctorName: "Dr. Lê Văn Long",
//     date: "05/12/2023",
//     time: "3:00 PM",
//     status: "Scheduled",
//     //Book new appointment button can be added later
//   },
//   {
//     name: "Đỗ Thiên Phú",
//     doctorName: "Dr. Trần Thị Hương",
//     date: "15/12/2023",
//     time: "11:00 AM",
//     status: "Cancelled",
//     //Book new appointment button can be added later
//   },
// ];
//5. Recent Medical Records data
const RecentMedicalRecords_data = [
  {
    name: "Nguyễn Grass",
    visitDate: "15/10/2023",
    facility: "FV Hospital",
    diagnosis: "Blood Test",
    doctor: "Dr. Lê Văn Long",
  },
  {
    name: "Nguyễn Hữu Phong",
    visitDate: "22/10/2023",
    facility: "City Clinic",
    diagnosis: "X-Ray",
    doctor: "Dr. Trần Thị Hương",
  },
  {
    name: "Đỗ Thiên Phú",
    visitDate: "05/11/2023",
    facility: "Family Health Center",
    diagnosis: "Allergy Test",
    doctor: "Dr. Nguyễn Thị Lan",
  },
  {
    name: "Hồ Thanh Thái",
    visitDate: "10/11/2023",
    facility: "Downtown Medical",
    diagnosis: "Vision Test",
    doctor: "Dr. Phạm Văn Minh",
  },
];
//6. Vaccination Summary data
const VaccinationSummary_data = {
  TotalVaccinesCompleted: 8,
  UpcomingVaccines: 4,
  OverduesVaccines: 2,
  NextVaccineDueDates: {
    "Nguyễn Grass": "25/12/2023",
    "Nguyễn Hữu Phong": "15/01/2024",
    "Đỗ Thiên Phú": "22/01/2024",
    "Hồ Thanh Thái": "05/02/2024",
  },
};
export default function Dashboard() {
  const isMobile = useIsMobile();
  const [upcoming, setUpcoming] = useState([]);
  const sessionId = sessionStorage.getItem("session_id") || "3d2c4b28-1bed-4aa2-9298-2fcad169182b";
  const userId = Number(sessionStorage.getItem("user_id") || 0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // fetch upcoming for current user or family; adjust params to backend
        const res = await appointmentService.getAppointments(sessionId, { patientId: userId, upcoming: true });
        const items = res?.data?.items ?? [];
        if (!mounted) return;
        setUpcoming(items);
      } catch (err) {
        console.error("Load upcoming failed", err);
      }
    };
    load();
    return () => (mounted = false);
  }, [sessionId, userId]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ margin: "16px" }}>
          <Row gutter={[16, 16]}>
            {/* Family Overview Cards Grid */}
            <Col span={isMobile ? 24 : 7}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Family Overview" description={null} />
                <div>
                  <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                    <li>Family Name: {FamilyOverview_data.familyName}</li>
                    <li>Address: {FamilyOverview_data.address}</li>
                    <li>Contact Phone: {FamilyOverview_data.contactPhone}</li>
                    <li>
                      Linked Doctors Count:{" "}
                      {FamilyOverview_data.linkedDoctorsCount}
                    </li>
                  </ul>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input placeholder="Family invite code" />
                    <Button type="primary" style={{ marginBottom: "1.5px" }}>
                      Submit
                    </Button>
                  </Space.Compact>
                </div>
              </Card>
            </Col>
            {/* Upcoming Appointments Cards Grid */}
            <Col span={isMobile ? 24 : 17}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Upcoming Appointments" description={null} />

                {upcoming.length === 0 ? (
                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: 12 }}>
                    Không có lịch hẹn sắp tới.
                  </Text>
                ) : (
                  <List
                    style={{ marginTop: 16 }}
                    dataSource={upcoming}
                    renderItem={(item) => {
                      const meta = item.meta || {};

                      const doctorName =
                        DOCTOR_LIST.find((d) => d.id === Number(meta.doctorId))
                          ?.name || "_";

                      const patient =
                        meta.patientId ===
                        Number(sessionStorage.getItem("user_id"))
                          ? "Bạn"
                          : meta.patientName ||
                            (meta.patientId ? `#${meta.patientId}` : "_");

                      const dt = meta.appointmentDatetime
                        ? dayjs(meta.appointmentDatetime).format(
                            "DD/MM/YYYY HH:mm"
                          )
                        : dayjs(item.date).format("DD/MM/YYYY HH:mm");

                      const reason = meta.reason || item.content || "_";
                      const status = (meta.status || "pending").toLowerCase();

                      return (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Badge status={item.type} />}
                            title={
                              <span>
                                <strong>{patient}</strong> · {doctorName}
                              </span>
                            }
                            description={
                              <>
                                <div>{reason}</div>
                                <div style={{ color: "var(--ant-gray-6)" }}>
                                  {dt} · {status}
                                </div>
                              </>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                )}
              </Card>
            </Col>

            {/* Family Members Cards Grid */}
            <Col span={24}>
              <Card className="">
                <Meta title="Family Members" description={null} />

                <Row gutter={[16, 16]} style={{ marginTop: "12px" }}>
                  {FamilyMembers_data.slice(0, 4).map((member, index) => (
                    <Col key={index} span={isMobile ? 24 : 12}>
                      <Card className="hover-expand-card" hoverable>
                        <img
                          src={member.cardImage}
                          className="card-image"
                          alt={member.name}
                          style={{
                            width: "80%",
                            height: "280px",
                            objectFit: "cover",
                          }}
                        />
                        <h1 style={{ fontSize: "16px", fontWeight: "bold" }}>
                          {member.name}
                        </h1>
                        <div>
                          <ul
                            style={{
                              listStyle: "disc",
                              paddingLeft: "20px",
                            }}>
                            <li>FamilyID: {member.familyID}</li>
                            <li>Relationship: {member.relationship}</li>
                            <li>Age: {member.age}</li>
                            <li>Gender: {member.gender}</li>
                            <li>Blood Type: {member.bloodType}</li>
                          </ul>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
            {/* Recent Medical Records Cards Grid */}
            <Col span={isMobile ? 24 : 12}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Recent Medical Records" description={null} />
                <div>
                  <ul className="list-disc ml-5 mt-2">
                    {RecentMedicalRecords_data.map((record) => (
                      <li>
                        {record.name} - {record.visitDate} - {record.facility} -{" "}
                        {record.diagnosis} - {record.doctor}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>

            {/* Vaccination Summary Cards Grid */}
            <Col span={isMobile ? 24 : 12}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Vaccination Summary" description={null} />
                <div>
                  <ul className="list-disc ml-5 mt-2">
                    <li>
                      Total Vaccines Completed:{" "}
                      {VaccinationSummary_data.TotalVaccinesCompleted}
                    </li>
                    <li>
                      Upcoming Vaccines:{" "}
                      {VaccinationSummary_data.UpcomingVaccines}
                    </li>
                    <li>
                      Overdues Vaccines:{" "}
                      {VaccinationSummary_data.OverduesVaccines}
                    </li>
                    {Object.keys(
                      VaccinationSummary_data.NextVaccineDueDates
                    ).map((key) => (
                      <li>
                        {key}:{" "}
                        {VaccinationSummary_data.NextVaccineDueDates[key]}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>
            {/* Alerts & Health Reminders Cards Grid */}
            <Col span={24}>
              <Card className="hover-expand-card" hoverable>
                <Meta title="Alerts & Health Reminders" description={null} />
                <div>
                  <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                    <li>Upcoming dental check: 20/11</li>
                    <li>Kid's vaccine reminder: 25/12</li>
                    <li>Blood pressure recheck recommended</li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
