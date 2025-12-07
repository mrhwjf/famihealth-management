import React, { useEffect, useMemo, useState } from "react";
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
  message,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import useIsMobile from "../../hooks/useIsMobile";
import { getMyFamily } from "../../services/myFamily";
import { vaccineService } from "../../services/vaccineService";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const DEFAULT_SESSION_ID = "3d2c4b28-1bed-4aa2-9298-2fcad169182b";

const ensureArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const normalizeRecord = (record = {}, memberFallback = {}) => {
  const administeredRaw =
    record.administeredDate || record.administered_date || record.date;
  const intervalDays =
    record.intervalDays || record.interval_days || record.interval || null;

  return {
    key:
      record.id ??
      `${memberFallback.id ?? record.familyMemberId ?? "m"}-${
        record.vaccineId ?? record.vaccine?.id ?? Date.now()
      }`,
    id: record.id ?? "",
    familyMemberId: record.familyMemberId ?? memberFallback.id ?? "",
    familyMemberName:
      record.familyMemberName ??
      memberFallback.name ??
      memberFallback.fullName ??
      "—",
    vaccineId: record.vaccineId ?? record.vaccine?.id ?? "",
    vaccineName: record.vaccineName ?? record.vaccine?.name ?? "",
    administered_date: administeredRaw ?? "",
    interval_days: intervalDays,
    nextDueDate: record.nextDueDate ?? record.next_due_date ?? "",
    notes: record.notes ?? record.note ?? record.description ?? "",
  };
};

export default function Vaccinations() {
  const isMobile = useIsMobile();
  const storedSessionId =
    sessionStorage.getItem("sessionId") ||
    sessionStorage.getItem("session_id") ||
    "";
  const sessionId = storedSessionId || DEFAULT_SESSION_ID;
  const usingFallbackSession = !storedSessionId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState(
    "Chưa có dữ liệu tiêm chủng"
  );

  // selected vaccine filter (null = all)
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchVaccinations() {
      try {
        setLoading(true);
        if (usingFallbackSession && !cancelled) {
          setEmptyMessage(
            "Không tìm thấy session hợp lệ. Vui lòng đăng nhập lại để xem hồ sơ tiêm chủng."
          );
        }
        const members = await getMyFamily(sessionId);
        if (!Array.isArray(members) || members.length === 0) {
          if (!cancelled) {
            setData([]);
            setEmptyMessage("Chưa tìm thấy thành viên nào trong gia đình.");
          }
          return;
        }

        const recordsByMember = await Promise.all(
          members.map(async (member) => {
            try {
              const resp = await vaccineService.getMemberVaccines(
                sessionId,
                member.id
              );
              const normalized = ensureArray(resp).map((item) =>
                normalizeRecord(item, member)
              );
              return normalized;
            } catch (error) {
              console.error(
                "getMemberVaccines failed for member",
                member?.id,
                error
              );
              message.warning(
                `Không thể tải hồ sơ tiêm chủng của ${
                  member?.name ?? "thành viên"
                }`
              );
              return [];
            }
          })
        );

        if (!cancelled) {
          const flattened = recordsByMember.flat();
          setData(flattened);
          if (flattened.length === 0) {
            setEmptyMessage("Các thành viên chưa có hồ sơ tiêm chủng.");
          }
        }
      } catch (error) {
        console.error("fetchVaccinations error", error);
        if (!cancelled) {
          setData([]);
          setEmptyMessage("Không thể tải danh sách tiêm chủng.");
          message.error("Không thể tải danh sách tiêm chủng.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVaccinations();
    return () => {
      cancelled = true;
    };
  }, [sessionId, usingFallbackSession]);

  // compute enriched rows (administered dayjs, nextDue, status)
  const enriched = useMemo(() => {
    return (data || []).map((r) => {
      const administered = r.administered_date
        ? dayjs(r.administered_date)
        : null;
      const nextDue = r.nextDueDate
        ? dayjs(r.nextDueDate)
        : administered && r.interval_days
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
    });
  }, [data]);

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
      title: "Họ tên",
      dataIndex: "familyMemberName",
      key: "familyMemberName",
      width: 200,
      sorter: (a, b) =>
        (a.familyMemberName || "").localeCompare(b.familyMemberName || ""),
      render: (t, row) => (
        <Text>{t || row.familyMemberId || row.memberId || "—"}</Text>
      ),
    },
    {
      title: "Vaccine ID",
      dataIndex: "vaccineId",
      key: "vaccineId",
      width: 120,
      render: (t) => <Text>{t || "—"}</Text>,
    },
    {
      title: "Vaccine",
      dataIndex: "vaccineName",
      key: "vaccineName",
      ellipsis: true,
      render: (t) => <Text strong>{t || "—"}</Text>,
    },
    {
      title: "Đã tiêm",
      dataIndex: "administered",
      key: "administered",
      width: 140,
      sorter: (a, b) =>
        (a.administered?.unix() || 0) - (b.administered?.unix() || 0),
      render: (d) =>
        d ? dayjs(d).format("DD/MM/YYYY") : <Text type="secondary">—</Text>,
    },
    {
      title: "Hạn kế tiếp",
      dataIndex: "nextDue",
      key: "nextDue",
      width: 160,
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
          <Text code>{item.familyMemberName ?? item.familyMemberId}</Text> —{" "}
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
            {item.notes && (
              <div>
                <Text type="secondary">Ghi chú: </Text>
                {item.notes}
              </div>
            )}
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

        {loading ? (
          <div style={{ padding: 40, textAlign: "center" }}>Đang tải...</div>
        ) : filteredEnriched.length === 0 ? (
          <Empty description={emptyMessage} />
        ) : isMobile ? (
          <div>
            {filteredEnriched.map((it) => (
              <MobileCard key={it.key || it.id} item={it} />
            ))}
          </div>
        ) : (
          <Table
            rowKey={(record) => record.key}
            dataSource={filteredEnriched}
            columns={columns}
            pagination={{ pageSize: 8 }}
            bordered
            size="middle"
            loading={loading}
          />
        )}
      </Card>
    </Layout>
  );
}
