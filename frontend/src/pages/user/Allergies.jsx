import React, { useEffect, useMemo, useState } from "react";
import { Layout, Card, Table, Typography, Tag, message } from "antd";
import useIsMobile from "../../hooks/useIsMobile";
import { allergiesService } from "../../services/allergiesService";

const { Title } = Typography;

const DEFAULT_SESSION_ID = sessionStorage.getItem("sessionId") || "TEST_SESSION_ID";
const DEFAULT_FAMILY_ID = 1;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const normalizeRecord = (item = {}, index) => {
  const rawAllergens =
    item.allergies ?? item.allergens ?? item.allergers ?? item.allergen ?? [];

  const normalizedAllergies = (() => {
    if (Array.isArray(rawAllergens)) {
      return rawAllergens
        .map((entry) => {
          if (typeof entry === "string") return entry.trim();
          if (!entry) return "";
          if (typeof entry === "object") {
            return (
              entry.name ??
              entry.allergen ??
              entry.allergenName ??
              entry.title ??
              ""
            ).trim();
          }
          return String(entry).trim();
        })
        .filter(Boolean);
    }

    if (typeof rawAllergens === "string") {
      return rawAllergens
        .split(/[,;|]/)
        .map((token) => token.trim())
        .filter(Boolean);
    }

    return [];
  })();

  return {
    key: item.id ?? item.familyMemberId ?? index,
    id: item.familyMemberId ?? item.id ?? index,
    name: item.familyMemberName ?? item.name ?? "Chưa rõ tên",
    allergies: normalizedAllergies,
    notes: item.notes ?? item.note ?? "",
  };
};

export default function Allergies() {
  const isMobile = useIsMobile();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionId = useMemo(
    () => sessionStorage.getItem("sessionId") || DEFAULT_SESSION_ID,
    []
  );

  const familyId = useMemo(() => {
    const stored = Number(sessionStorage.getItem("family_id"));
    return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_FAMILY_ID;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllergies() {
      try {
        setLoading(true);
        const response = await allergiesService.getFamilyAllergies(
          sessionId,
          familyId
        );
        if (!cancelled) {
          const normalized = Array.isArray(response)
            ? response.map((item, index) => normalizeRecord(item, index))
            : [];
          setData(normalized);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch family allergies", error);
          message.error("Không thể tải dữ liệu dị ứng của gia đình.");
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAllergies();

    return () => {
      cancelled = true;
    };
  }, [familyId, sessionId]);

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Dị ứng",
      dataIndex: "allergies",
      key: "allergies",
      render: (list) => {
        if (!Array.isArray(list) || list.length === 0) {
          return (
            <span style={{ color: "rgba(0,0,0,0.45)" }}>Không có dữ liệu</span>
          );
        }
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              fontWeight: "bold",
            }}>
            {list.map((name, idx) => (
              <Tag color="blue" key={`${name}-${idx}`}>
                {name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <Layout style={layoutStyle}>
      <Card>
        <Title level={isMobile ? 5 : 4}>Quản lý dị ứng trong gia đình</Title>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          loading={loading}
          locale={{
            emptyText: loading ? "" : "Chưa có dữ liệu dị ứng",
          }}
        />
      </Card>
    </Layout>
  );
}
