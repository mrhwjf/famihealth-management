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
  Dropdown,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import useIsMobile from "../../hooks/useIsMobile";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

// sample data
const SAMPLE_DATA = [
  {
    id: "1",
    memberName: "Nguyễn Hoàng Phương",
    vaccineId: "V-101",
    vaccineName: "MMR (Measles, Mumps, Rubella)",
    administered_date: "2024-11-10",
    interval_days: 365,
    note: "Keep record",
  },
  {
    id: "2",
    memberName: "Nguyễn Hữu Phong",
    vaccineId: "V-102",
    vaccineName: "Tetanus (Td)",
    administered_date: "2023-05-20",
    interval_days: 365 * 10,
  },
  {
    id: "3",
    memberName: "Đõ Thiên Phú",
    vaccineId: "V-201",
    vaccineName: "Influenza (Annual)",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "4",
    memberName: "Hồ Thanh Thái",
    vaccineId: "V-203",
    vaccineName: "Covid-19 Booster (2nd Dose)",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "5",
    memberName: "Khanh",
    vaccineId: "V-204",
    vaccineName: "Blablabla Vaccine",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "6",
    memberName: "An",
    vaccineId: "V-204",
    vaccineName: "Blablabla Vaccine",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "7",
    memberName: "Huy",
    vaccineId: "V-204",
    vaccineName: "Blablabla Vaccine",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "8",
    memberName: "Danh",
    vaccineId: "V-204",
    vaccineName: "Blablabla Vaccine",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  {
    id: "9",
    memberName: "Đạt",
    vaccineId: "V-204",
    vaccineName: "Blablabla Vaccine",
    administered_date: "2025-09-01",
    interval_days: 365,
  },
  // add more as needed
];

export default function Vaccinations({ initialData = null }) {
  const isMobile = useIsMobile();
  const [data, setData] = useState(initialData ?? SAMPLE_DATA);

  // selected vaccine filter (null = all)
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  // compute enriched rows (administered dayjs, nextDue, status)
  const enriched = useMemo(
    () =>
      (data || []).map((r) => {
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
          ...r,
          administered,
          nextDue,
          status,
        };
      }),
    [data]
  );

  // distinct vaccine options (order preserved)
  const vaccineOptions = useMemo(() => {
    const seen = new Set();
    const opts = [];
    for (const r of data) {
      if (!r.vaccineName) continue;
      if (!seen.has(r.vaccineName)) {
        seen.add(r.vaccineName);
        opts.push(r.vaccineName);
      }
    }
    return opts;
  }, [data]);

  // Dropdown menu items + click handler
  const menu = {
    items: [
      { key: "all", label: "All vaccines" },
      ...vaccineOptions.map((v) => ({ key: v, label: v })),
    ],
    onClick: ({ key }) => {
      if (key === "all") setSelectedVaccine(null);
      else setSelectedVaccine(key);
    },
  };

  // filtered list used by the Table / mobile cards
  const filteredEnriched = useMemo(() => {
    if (!selectedVaccine) return enriched;
    return enriched.filter((r) => r.vaccineName === selectedVaccine);
  }, [enriched, selectedVaccine]);

  const columns = [
    {
      title: "Member",
      dataIndex: "memberName",
      key: "memberName",
      width: 180,
      sorter: (a, b) => {
        const aa = (a.memberName || a.memberId || "").toLowerCase();
        const bb = (b.memberName || b.memberId || "").toLowerCase();
        return aa > bb ? 1 : -1;
      },
      render: (_t, row) => <Text>{row.memberName ?? row.memberId ?? "—"}</Text>,
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
      render: (d) =>
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
  ];

  // status tag renderer (used in mobile card)
  function renderStatusTag(status) {
    if (status === "overdue") return <Tag color="red">Overdue</Tag>;
    if (status === "due_soon") return <Tag color="orange">Due soon</Tag>;
    if (status === "ok") return <Tag color="green">OK</Tag>;
    return <Tag color="default">Unknown</Tag>;
  }

  // mobile card
  const MobileCard = ({ item }) => (
    <Card type="inner" style={{ marginBottom: 12 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Text code>{item.memberName ?? item.memberId}</Text> —{" "}
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
        <Row align="middle" style={{ marginBottom: 16 }}>
          <Space>
            <Dropdown menu={menu} placement="bottomLeft" trigger={["click"]}>
              <Button icon={<FilterOutlined />}>
                {selectedVaccine ?? "Lọc (All vaccines)"}
              </Button>
            </Dropdown>

            {/* optional: quick clear button */}
            {selectedVaccine && (
              <Button onClick={() => setSelectedVaccine(null)}>Clear</Button>
            )}
          </Space>
        </Row>

        {filteredEnriched.length === 0 ? (
          <Empty description="Chưa có dữ liệu tiêm chủng" />
        ) : isMobile ? (
          <div>
            {filteredEnriched.map((it) => (
              <MobileCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <Table
            rowKey="id"
            dataSource={filteredEnriched}
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
