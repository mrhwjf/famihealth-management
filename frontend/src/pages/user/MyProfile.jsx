// src/components/MyProfile.jsx  (hoặc đường dẫn bạn đang dùng)
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
  Spin,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { getMyProfiles } from "../../services/myProfiles"; // giữ path như bạn đang dùng

const { Title, Text } = Typography;
const User_Id = 3;

export default function MyProfile() {
  const [visible, setVisible] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [form] = Form.useForm(); // sửa: dùng đúng cách
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoadingFetch(true);
        const res = await getMyProfiles(User_Id);
        // res có thể là:
        // 1) wrapper { success, data: { ...user... } }
        // 2) trực tiếp user object
        const payload = res?.data ?? res; // nếu res là wrapper thì payload = res.data
        if (!payload) {
          setUser(null);
          return;
        }
        // backend có thể dùng phoneNumber tên khác, profileURL, ...
        const userObj = {
          id: payload.userId ?? payload.id ?? payload.user_id,
          displayName: payload.name ?? payload.displayName ?? "",
          phone: payload.phoneNumber ?? payload.phone ?? "",
          email: payload.email ?? "",
          avatar: payload.profileURL ?? payload.avatar ?? null,
          createdAt: payload.createdAt ?? payload.created_at ?? "",
          updatedAt: payload.updatedAt ?? payload.updated_at ?? "",
        };
        setUser(userObj);
        setAvatarUrl(userObj.avatar);
      } catch (err) {
        console.error("Lỗi khi fetch myProfiles:", err);
        setUser(null);
      } finally {
        setLoadingFetch(false);
      }
    }
    fetchUserProfile();
  }, []);

  // sync form khi user thay đổi (có guard)
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      displayName: user?.displayName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    });
    if (user?.avatar) setAvatarUrl(user.avatar);
  }, [user, form]);

  const beforeUpload = (file) => {
    const isImage = file.type && file.type.startsWith && file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ chấp nhận ảnh.");
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
      setLoadingSave(true);
      // TODO: gọi API update profile nếu có endpoint (hiện demo dùng timeout)
      setTimeout(() => {
        setLoadingSave(false);
        setVisible(false);
        // cập nhật local state để UI phản ánh thay đổi ngay
        setUser((prev) => ({
          ...prev,
          displayName: values.displayName,
          email: values.email,
          phone: values.phone,
          avatar: avatarUrl ?? prev?.avatar,
        }));
        message.success("Profile đã được lưu.");
      }, 700);
    } catch (err) {
      console.log("Validate failed:", err);
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
        {loadingFetch ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Spin />
          </div>
        ) : (
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
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  style={{
                    border: "4px solid #fff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  }}
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <Title level={4} style={{ marginBottom: 2 }}>
                  {user?.displayName ?? "Không có tên"}
                </Title>
                <Text type="secondary">Family</Text>
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
                    Name
                  </Text>
                  <Text>{user?.displayName || "No name"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ display: "block" }}>
                    Phone
                  </Text>
                  <Text>{user?.phone || "No phone"}</Text>
                </Col>
                <Col span={12} style={{ marginTop: 12 }}>
                  <Text strong style={{ display: "block" }}>
                    Email
                  </Text>
                  <Text>{user?.email || "No email"}</Text>
                </Col>
                <Col span={12} style={{ marginTop: 12 }}>
                  <Text strong style={{ display: "block" }}>
                    Created at
                  </Text>
                  <Text>{user?.createdAt || "No date"}</Text>
                </Col>
                <Col span={12} style={{ marginTop: 12 }}>
                  <Text strong style={{ display: "block" }}>
                    Updated at
                  </Text>
                  <Text>{user?.updatedAt || "No date"}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Card>

      <Modal
        title="Edit profile"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        centered>
        <Form layout="vertical" form={form}>
          <Form.Item label="Avatar">
            <Upload showUploadList={false} beforeUpload={beforeUpload} accept="image/*">
              <Button icon={<UploadOutlined />}>Change avatar</Button>
            </Upload>
            <div style={{ marginTop: 10 }}>
              <Avatar src={avatarUrl} size={56} icon={!avatarUrl ? <UserOutlined /> : undefined} />
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

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loadingSave} onClick={onSave}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
