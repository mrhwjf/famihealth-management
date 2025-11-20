// MyProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Typography,
  Modal,
  Upload,
  message,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Props:
 *  - currentUser: { id, displayName, email, phone, address, dob, gender, nationality, pob, citizenId, avatar }
 * If you use an auth hook, pass the logged-in user object instead of prop.
 */
export default function MyProfile({ currentUser }) {
  const fallback = {
    displayName: "Nguyễn Grass",
    email: "thisisarandomassemail.com",
    phone: "0912345678",
    address: "273 An Dương Vương",
    dob: "2005-07-04",
    gender: "Alpha Male",
    nationality: "Việt Nam",
    pob: "TPHCM",
    citizenId: "0123456789",
    avatar: "/mnt/data/edb255b6-1cd7-4750-81e9-09ae48dcb8d8.png",
  };

  const user = currentUser || fallback;
  const [visible, setVisible] = useState(false); // edit modal
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  useEffect(() => {
    form.setFieldsValue({
      displayName: user.displayName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      dob: user.dob,
      gender: user.gender,
      nationality: user.nationality,
      pob: user.pob,
      citizenId: user.citizenId,
    });
    setAvatarUrl(user.avatar);
  }, [user, form]);

  // simple client-side preview, no upload to server here
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setVisible(false);
        message.success("Profile đã được lưu.");
      }, 800);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Card
        bordered={false}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 10,
          boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
          background: "#fff",
        }}>
        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} sm={8} md={6} style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: 8,
                borderRadius: 12,
                background: "linear-gradient(180deg, #f7fafc, #ffffff)",
              }}>
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{
                  border: "4px solid #fff",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <Title level={4} style={{ marginBottom: 2 }}>
                {user.displayName}
              </Title>
              <Text type="secondary">Member • Primary contact</Text>
            </div>

            <div style={{ marginTop: 14 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setVisible(true)}>
                Edit profile
              </Button>
            </div>
          </Col>

          <Col xs={24} sm={16} md={18}>
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Text strong style={{ display: "block" }}>
                  Email
                </Text>
                <Text>{user.email || "—"}</Text>
              </Col>

              <Col span={12}>
                <Text strong style={{ display: "block" }}>
                  Phone
                </Text>
                <Text>{user.phone || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Address
                </Text>
                <Text>{user.address || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Date of Birth
                </Text>
                <Text>{user.dob || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Gender
                </Text>
                <Text>{user.gender || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Nationality
                </Text>
                <Text>{user.nationality || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Place of Origin
                </Text>
                <Text>{user.pob || "—"}</Text>
              </Col>

              <Col span={12} style={{ marginTop: 12 }}>
                <Text strong style={{ display: "block" }}>
                  Citizen ID
                </Text>
                <Text>{user.citizenId || "—"}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Edit profile"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered>
        <Form layout="vertical" form={form}>
          <Form.Item label="Avatar">
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/*">
              <Button icon={<UploadOutlined />}>Change avatar</Button>
            </Upload>
            <div style={{ marginTop: 10 }}>
              <Avatar src={avatarUrl} size={56} />
            </div>
          </Form.Item>

          <Form.Item
            name="displayName"
            label="Full name"
            rules={[{ required: true, message: "Nhập tên đi bro" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button
              onClick={() => setVisible(false)}
              style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={onSave}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
