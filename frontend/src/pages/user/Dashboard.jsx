// StoreLayout.jsx
import React, { useState } from "react";
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
    name: "Nguyễn Grass",
    relationship: "Father",
    age: 20,
    gender: "Male",
    bloodType: "O+",
    cardImage: "src/pages/user/namaste-dog-smiling.png", //add image later
  },
  {
    name: "Nguyễn Hữu Phong",
    relationship: "Mother",
    age: 19,
    gender: "Female",
    bloodType: "A-",

    cardImage:
      "src/pages/user/2d8fda44-a143-4a14-93a7-e9d035b23fff-1676957756500.webp",
  },
  {
    name: "Hồ Thanh Thái",
    relationship: "Son",
    age: 18,
    gender: "Male",
    bloodType: "B+",
    cardImage:
      "src/pages/user/static-images.vnncdn.net-vps_images_publish-000001-000003-2025-11-4-_pho-anh-hai-1111.jpg", //add image later
  },
  {
    name: "Đỗ Thiên Phú",
    relationship: "Daughter",
    age: 17,
    gender: "Female",
    bloodType: "AB-",
    cardImage: "src/pages/user/6rvsnz.jpg", //add image later
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
const UpcomingAppointments_data = [
  {
    name: "Nguyễn Grass",
    doctorName: "Dr. Lê Văn Long",
    date: "20/11/2023",
    time: "9:00 AM",
    status: "Scheduled",
    //Book new appointment button can be added later
  },
  {
    name: "Nguyễn Hữu Phong",
    doctorName: "Dr. Lê Văn Long",
    date: "05/12/2023",
    time: "3:00 PM",
    status: "Scheduled",
    //Book new appointment button can be added later
  },
  {
    name: "Đỗ Thiên Phú",
    doctorName: "Dr. Trần Thị Hương",
    date: "15/12/2023",
    time: "11:00 AM",
    status: "Cancelled",
    //Book new appointment button can be added later
  },
  {
    name: "Hồ Thanh Thái",
    doctorName: "Dr. Trần Thị Hương",
    date: "25/12/2023",
    time: "2:00 PM",
    status: "Completed",
    //Book new appointment button can be added later
  },
];
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

  return (
    console.log(FamilyMembers_data.length),
    (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px" }}>
            <Row gutter={[16, 16]}>
              {/* Family Overview Cards Grid */}
              <Col span={24}>
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
              {/* Family Members Cards Grid */}
              <Col span={24}>
                <Card className="hover-expand-card" hoverable>
                  <Meta title="Family Members" description={null} />

                  <Row gutter={[16, 16]} style={{ marginTop: "12px" }}>
                    {FamilyMembers_data.slice(0, 4).map((member, index) => (
                      <Col key={index} span={12}>
                        <Card className="hover-expand-card" hoverable>
                          <img
                            src={member.cardImage}
                            className="card-image"
                            alt=""
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

              {/* Upcoming Appointments Cards Grid */}
              <Col span={12}>
                <Card className="hover-expand-card" hoverable>
                  <Meta title="Upcoming Appointments" description={null} />
                  <ul className="list-disc ml-5 mt-2">
                    {UpcomingAppointments_data.map((appointment, index) => (
                      <li key={index}>
                        {appointment.name} have an appointment with <br />{" "}
                        {appointment.doctorName} - {appointment.date} at{" "}
                        {appointment.time} - {appointment.status}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
              {/* Vaccination Summary Cards Grid */}
              <Col span={12}>
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
              {/* Recent Medical Records Cards Grid */}
              <Col span={12}>
                <Card className="hover-expand-card" hoverable>
                  <Meta title="Recent Medical Records" description={null} />
                  <div>
                    <ul className="list-disc ml-5 mt-2">
                      {RecentMedicalRecords_data.map((record) => (
                        <li>
                          {record.name} - {record.visitDate} - {record.facility}{" "}
                          - {record.diagnosis} - {record.doctor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    )
  );
}
