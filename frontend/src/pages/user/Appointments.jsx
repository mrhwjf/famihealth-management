import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Badge,
  Calendar,
  Layout,
  Card,
  Space,
  Button,
  Row,
  Col,
  Modal,
  Form,
  DatePicker,
  Input,
  Select,
  List,
  Typography,
} from "antd";
import useIsMobile from "../../hooks/useIsMobile";

const { Title, Text } = Typography;
const { Option } = Select;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const STATIC_EVENTS_FOR_DAY = (date) => {
  // example static events you had before (kept for compatibility)
  const d = date.date();
  const list = [];
  if (d === 8) {
    list.push(
      { type: "warning", content: "This is warning event." },
      { type: "success", content: "This is usual event." }
    );
  } else if (d === 10) {
    list.push(
      { type: "warning", content: "This is warning event." },
      { type: "success", content: "This is usual event." },
      { type: "error", content: "This is error event." }
    );
  } else if (d === 15) {
    list.push(
      { type: "warning", content: "This is warning event" },
      { type: "success", content: "This is very long usual event......" },
      { type: "error", content: "This is error event 1." },
      { type: "error", content: "This is error event 2." },
      { type: "error", content: "This is error event 3." },
      { type: "error", content: "This is error event 4." }
    );
  }
  return list;
};

export default function Appointments() {
  // eventsByDate: { "YYYY-MM-DD": [{ type, content, source }] }
  const [eventsByDate, setEventsByDate] = useState(() => {
    // optional: seed with an example event for today
    const todayKey = dayjs().format("YYYY-MM-DD");
    return {
      [todayKey]: [
        {
          type: "success",
          content: "Welcome! Example appointment",
          source: "seed",
        },
      ],
    };
  });
  const isMobile = useIsMobile();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("appointment"); // or "medication"
  const [form] = Form.useForm();

  // helper: add event to state
  const addEvent = ({ date, content, type, source }) => {
    const key = dayjs(date).format("YYYY-MM-DD");
    setEventsByDate((prev) => {
      const prevList = prev[key] ? [...prev[key]] : [];
      return {
        ...prev,
        [key]: [...prevList, { type, content, source }],
      };
    });
  };

  // open modal from the two buttons
  // const openAddModal = (type) => {
  //   setModalType(type);
  //   form.resetFields();
  //   // prefill type-specific values
  //   form.setFieldsValue({
  //     date: dayjs(),
  //     type: type === "medication" ? "success" : "warning",
  //     title: type === "medication" ? "Uống thuốc" : "Khám / Hẹn",
  //   });
  //   setModalVisible(true);
  // };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      addEvent({
        date: values.date,
        content: values.title,
        type: values.type,
        source: modalType,
      });
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      // validation failed
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // date -> listData: include static + dynamic events
  const getListData = (value) => {
    const dateKey = dayjs(value).format("YYYY-MM-DD");
    const dynamic = eventsByDate[dateKey]
      ? eventsByDate[dateKey].map((e) => ({ ...e }))
      : [];
    const statics = STATIC_EVENTS_FOR_DAY(value);
    // ensure stable order: dynamic events first (so newly added show top)
    return [...dynamic, ...statics];
  };

  // month cell example (kept from original)
  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
    return null;
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    if (!num) return null;
    return (
      <div className="notes-month" style={{ textAlign: "center" }}>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    );
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    if (!listData || listData.length === 0) return null;
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {listData.map((item, idx) => (
          <li key={`${item.content}-${idx}`} style={{ marginBottom: 6 }}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info && info.type === "date") return dateCellRender(current);
    if (info && info.type === "month") return monthCellRender(current);
    return info?.originNode ?? null;
  };

  // compute upcoming events list (flatten, sort by date ascending, limit to N)
  const upcoming = useMemo(() => {
    const arr = [];
    Object.entries(eventsByDate).forEach(([dateKey, items]) => {
      items.forEach((it) => {
        arr.push({ date: dateKey, ...it });
      });
    });
    arr.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
    return arr.slice(0, 8); // show top 8 upcoming
  }, [eventsByDate]);

  return (
    <Layout style={layoutStyle}>
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              Lịch trình sức khỏe gia đình
            </Title>
            <Text type="secondary">
              Quản lý lịch hẹn và lịch uống thuốc của gia đình.
            </Text>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card size="small" title="Sự kiện sắp tới" style={{ marginTop: 8 }}>
              {upcoming.length === 0 ? (
                <Text type="secondary">Không có sự kiện.</Text>
              ) : (
                <List
                  dataSource={upcoming}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <span>
                            <Badge status={item.type} />{" "}
                            <Text strong>{item.content}</Text>
                          </span>
                        }
                        description={dayjs(item.date).format("DD/MM/YYYY")}
                      />
                      <Text
                        type="secondary"
                        style={{ textTransform: "capitalize" }}>
                        {item.source}
                      </Text>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      <Card>
        <div
          style={{
            overflowX: isMobile ? "auto" : "visible",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              width: isMobile ? "700px" : "100%",
              maxWidth: "100%",
            }}
          >
            <Calendar cellRender={cellRender} />
          </div>
        </div>
      </Card>

      <Modal
        title={
          modalType === "medication" ? "Thêm lịch uống thuốc" : "Thêm lịch hẹn"
        }
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ date: dayjs(), type: "success" }}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input
              placeholder={
                modalType === "medication"
                  ? "Ví dụ: Uống Paracetamol"
                  : "Ví dụ: Khám nha khoa"
              }
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: "Chọn ngày" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="type" label="Loại hiển thị">
            <Select>
              <Option value="success">Điều trị thường xuyên</Option>
              <Option value="warning">Lịch hẹn quan trọng</Option>
              <Option value="error">Khẩn cấp</Option>
              <Option value="default">Sinh hoạt nhắc nhở</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
