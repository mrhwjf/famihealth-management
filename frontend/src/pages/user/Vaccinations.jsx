import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Layout,
  Card,
  Table,
  Tag,
  Typography,
  Empty,
  Row,
  Col,
  Space,
  Button,
} from "antd";
import useIsMobile from "../../hooks/useIsMobile";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

// sample data shape:
// {
//   id: "evt-1",
//   memberId: "member-01",
//   vaccineId: "vax-009",
//   vaccineName: "Hepatitis B (HBV)",
//   administered_date: "2025-06-10",
//   interval_days: 365, // days until next due (optional)
//   note: "First dose"
// }
const SAMPLE_DATA = [
  {
    id: "1",
    memberId: "3123410288",
    vaccineId: "V-101",
    vaccineName: "MMR (Measles, Mumps, Rubella)",
    administered_date: "2024-11-10",
    interval_days: 365,
    note: "Keep record",
  },
  {
    id: "2",
    memberId: "3123410289",
    vaccineId: "V-102",
    vaccineName: "Tetanus (Td)",
    administered_date: "2023-05-20",
    interval_days: 365 * 10,
  },
  {
    id: "3",
    memberId: "3123410290",
    vaccineId: "V-201",
    vaccineName: "Influenza (Annual)",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "4",
    memberId: "3123410290",
    vaccineId: "V-203",
    vaccineName: "Covid-19 Booster (2nd Dose)",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
];

export default function Vaccinations({ initialData = null }) {
  const isMobile = useIsMobile();
  const [data, setData] = useState(initialData ?? SAMPLE_DATA);

  // compute next_due_date from administered_date + interval_days (fallback: null)
  const enriched = useMemo(
    () =>
      data.map((r) => {
        const administered = r.administered_date
          ? dayjs(r.administered_date)
          : null;
        const nextDue =
          administered && r.interval_days
            ? administered.add(r.interval_days, "day")
            : null;
        const today = dayjs();
        let status = "ok";
        if (!nextDue) status = "unknown";
        else if (nextDue.isBefore(today, "day")) status = "overdue";
        else if (nextDue.diff(today, "day") <= 7) status = "due_soon";
        else status = "ok";

        return {
          ...r, //Tên biến đại diện cho từng bản ghi trong mảng data
          administered: administered, // trả về ngày đã tiêm dưới dạng đối tượng dayjs
          nextDue, // trả về ngày tiêm tiếp theo dưới dạng đối tượng dayjs
          status, // trạng thái dựa trên ngày tiêm tiếp theo so với ngày hiện tại
        };
      }),
    [data]
  );

  const columns = [
    {
      title: "Member ID",
      dataIndex: "memberId",
      key: "memberId",
      width: 110,
      sorter: (a, b) => (a.memberId > b.memberId ? 1 : -1),
      render: (t) => <Text>{t}</Text>,
    },
    {
      title: "Vaccine ID",
      dataIndex: "vaccineId",
      key: "vaccineId",
      width: 120,
      render: (t) => <Text>{t}</Text>,
    },
    {
      title: "Vaccine",
      dataIndex: "vaccineName",
      key: "vaccineName",
      ellipsis: true,
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Administered",
      dataIndex: "administered",
      key: "administered",
      width: 140,
      sorter: (a, b) =>
        (a.administered?.unix() || 0) - (b.administered?.unix() || 0),
      render: (d) =>
        d ? dayjs(d).format("DD/MM/YYYY") : <Text type="secondary">—</Text>,
    },
    {
      title: "Next due",
      dataIndex: "nextDue",
      key: "nextDue",
      width: 140,
      sorter: (a, b) => (a.nextDue?.unix() || 0) - (b.nextDue?.unix() || 0),
      render: (d, row) =>
        d ? (
          <div>
            <div>{dayjs(d).format("DD/MM/YYYY")}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(d).fromNow()}
            </Text>
          </div>
        ) : (
          <Text type="secondary">N/A</Text>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      filters: [
        { text: "Overdue", value: "overdue" },
        { text: "Due soon", value: "due_soon" },
        { text: "OK", value: "ok" },
        { text: "Unknown", value: "unknown" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (s) => {
        if (s === "overdue") return <Tag color="red">Overdue</Tag>;
        if (s === "due_soon") return <Tag color="orange">Due soon</Tag>;
        if (s === "ok") return <Tag color="green">OK</Tag>;
        return <Tag color="default">Unknown</Tag>;
      },
    },
  ];

  // mobile card layout
  const MobileCard = ({ item }) => (
    <Card type="inner" style={{ marginBottom: 12 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Text code>{item.memberId}</Text> —{" "}
          <Text strong>{item.vaccineName}</Text>
          <div style={{ marginTop: 6 }}>
            <div>
              <Text type="secondary">Administered: </Text>
              {item.administered ? (
                dayjs(item.administered).format("DD/MM/YYYY")
              ) : (
                <Text type="secondary">—</Text>
              )}
            </div>
            <div>
              <Text type="secondary">Next due: </Text>
              {item.nextDue ? (
                <>
                  {dayjs(item.nextDue).format("DD/MM/YYYY")}{" "}
                  <Text type="secondary">
                    ({dayjs(item.nextDue).fromNow()})
                  </Text>
                </>
              ) : (
                <Text type="secondary">N/A</Text>
              )}
            </div>
          </div>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            {renderStatusTag(item.status)}
          </div>
        </Col>
      </Row>
    </Card>
  );

  function renderStatusTag(status) {
    if (status === "overdue") return <Tag color="red">Overdue</Tag>;
    if (status === "due_soon") return <Tag color="orange">Due soon</Tag>;
    if (status === "ok") return <Tag color="green">OK</Tag>;
    return <Tag>Unknown</Tag>;
  }

  return (
    <Layout style={layoutStyle}>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
              Lịch tiêm chủng & hồ sơ vaccine
            </Title>
            <Text type="secondary">
              Hiển thị ID thành viên, ID vaccine, ngày tiêm và hạn tiêm tiếp
              theo.
            </Text>
          </Col>
        </Row>
      </Card>

      <Card>
        {enriched.length === 0 ? (
          <Empty description="Chưa có dữ liệu tiêm chủng" />
        ) : isMobile ? (
          // mobile: show stacked cards
          <div>
            {enriched.map((it) => (
              <MobileCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <Table
            rowKey="id"
            dataSource={enriched}
            columns={columns}
            pagination={{ pageSize: 8 }}
            bordered
            size="middle"
          />
        )}
      </Card>
    </Layout>
  );
}
