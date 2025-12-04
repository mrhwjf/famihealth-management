import React from "react";
import useIsMobile from "../../hooks/useIsMobile";
import { Layout, Card, Table, Typography, Tag } from "antd";
const { Title } = Typography;

const layoutStyle = {
  padding: "16px",
  overfMild: "hidden",
  width: "100%",
  maxWidth: "100%",
};
//BỎ mức độ
const example_data = [
  {
    id: "3123410288",
    name: "Nguyễn Hoàng Phương",
    allergies: [
      { name: "Peanuts", severity: "Severe" },
      { name: "Pollen", severity: "Moderate" },
      { name: "Penicillin", severity: "Severe" },
      { name: "Cat Danders", severity: "Mild" },
    ],
    notes: "Thành viên cần mang theo thuốc dị ứng",
  },
  {
    id: "3123410289",
    name: "Nguyễn Hữu Tâm",
    allergies: [
      { name: "Bees", severity: "Moderate" },
      { name: "Ants", severity: "Mild" },
      { name: "Dust Mites", severity: "Mild" },
    ],
    notes: "Thành viên cần tránh tiếp xúc với côn trùng",
  },
  {
    id: "3123410290",
    name: "Nguyễn Quang Huy",
    allergies: [
      { name: "Crab", severity: "Severe" },
      { name: "Shrimp", severity: "Moderate" },
      { name: "Fish", severity: "Moderate" },
    ],
    notes: "Thành viên cần thận trọng khi ăn hải sản",
  },
  {
    id: "3123410291",
    name: "Nguyễn Thị Lan",
    allergies: [
      { name: "Eggs", severity: "Moderate" },
      { name: "Milk", severity: "Moderate" },
      { name: "Wheat", severity: "Mild" },
    ],
    notes: "Thành viên cần tuân thủ chế độ ăn kiêng",
  },
];

export default function Allergies() {
  const isMobile = useIsMobile();

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Dị ứng",
      dataIndex: "allergies",
      key: "allergies",
      render: (list) => (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            fontWeight: "bold",
          }}>
          {list.map((item, idx) => {
            let color;
            switch (item.severity) {
              case "Severe":
                color = "red";
                break;
              case "Moderate":
                color = "orange";
                break;
              default:
                color = "green";
            }
            return (
              <Tag color={color} key={idx}>
                {item.name} ({item.severity})
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
    // {
    //   title: "Thao tác",
    //   dataIndex: "action",
    //   key: "action",
    // },
  ];

  return (
    <Layout style={layoutStyle}>
      <Card>
        <Title level={isMobile ? 5 : 4}>Quản lý dị ứng trong gia đình</Title>
        <Table
          columns={columns}
          dataSource={example_data}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </Layout>
  );
}
