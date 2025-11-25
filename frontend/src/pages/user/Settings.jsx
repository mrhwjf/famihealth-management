// src/pages/user/Settings.jsx
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Modal,
  Switch,
  Select,
  Radio,
  Divider,
  List,
  Space,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  LockOutlined,
  TeamOutlined,
  BellOutlined,
  BgColorsOutlined,
  GlobalOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const LOCAL_KEY = "myfamily_settings_v1";

const defaultState = {
  personal: {
    name: "Nguyễn Grass",
    email: "grass@example.com",
    phone: "0912345678",
    avatar: "", // dataURL or URL
  },
  family: {
    familyName: "3 ae lọ chéo Family",
    members: [
      { id: "1", name: "Nguyễn Grass", role: "Owner" },
      { id: "2", name: "Nguyễn Hữu Phong", role: "Wife" },
      { id: "3", name: "Hồ Thanh Thái", role: "Son" },
      { id: "4", name: "Đỗ Thiên Phú", role: "Daughter" },
    ],
  },
  notifications: {
    vaccineReminder: true,
    appointmentReminder: true,
    medReminder: false,
  },
  preferences: {
    theme: "system", // system | light | dark
    language: "vi", // vi | en
    fontSize: "normal", // normal | large | xlarge
  },
  privacy: {
    allowDataSync: true,
    shareAnonymized: false,
  },
  system: {
    devMode: false,
    version: "1.0.0",
  },
};

export default function SettingsPage() {
  const [state, setState] = useState(defaultState);
  const [personalForm] = Form.useForm();
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);

  // load saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  }, [state]);

  // Handlers
  const handlePersonalFinish = (vals) => {
    setState((s) => ({ ...s, personal: { ...s.personal, ...vals } }));
    message.success("Personal info saved");
  };

  const handleAvatarUpload = (file, setAvatarState) => {
    const isImg = file.type.startsWith("image/");
    if (!isImg) {
      message.error("Please upload an image file");
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      // set local immediately
      setState((s) => ({ ...s, personal: { ...s.personal, avatar: dataUrl } }));
      setAvatarState && setAvatarState(dataUrl);
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
  };

  const handleToggle = (section, key, value) => {
    setState((s) => ({ ...s, [section]: { ...s[section], [key]: value } }));
  };

  const handlePrefChange = (key, value) => {
    setState((s) => ({
      ...s,
      preferences: { ...s.preferences, [key]: value },
    }));
  };

  const handleAddMember = (member) => {
    setState((s) => {
      const next = {
        ...s,
        family: { ...s.family, members: [...s.family.members, member] },
      };
      return next;
    });
    message.success("Member added");
  };

  const handleRemoveMember = (id) => {
    Modal.confirm({
      title: "Xoá thành viên",
      icon: <DeleteOutlined />,
      content:
        "Bạn có chắc muốn xoá thành viên này không? Hành động không thể hoàn tác.",
      onOk() {
        setState((s) => ({
          ...s,
          family: {
            ...s.family,
            members: s.family.members.filter((m) => m.id !== id),
          },
        }));
        message.success("Member removed");
      },
    });
  };

  const handleClearCache = () => {
    Modal.confirm({
      title: "Clear local data?",
      onOk() {
        localStorage.removeItem(LOCAL_KEY);
        setState(defaultState);
        message.success("Cache cleared");
      },
    });
  };

  // small helper for forms
  useEffect(() => {
    personalForm.setFieldsValue(state.personal);
  }, [state.personal, personalForm]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card>
            <Title level={4}>
              <UserOutlined style={{ marginRight: 8 }} />
              Personal
            </Title>

            <Form
              form={personalForm}
              layout="vertical"
              initialValues={state.personal}
              onFinish={handlePersonalFinish}>
              <Form.Item label="Avatar">
                <Space align="center">
                  <Avatar size={80} src={state.personal.avatar} />
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => handleAvatarUpload(file)}
                    accept="image/*">
                    <Button icon={<UploadOutlined />}>Upload avatar</Button>
                  </Upload>
                  <Button
                    onClick={() => {
                      setState((s) => ({
                        ...s,
                        personal: { ...s.personal, avatar: "" },
                      }));
                    }}>
                    Remove
                  </Button>
                </Space>
              </Form.Item>

              <Form.Item
                label="Full name"
                name="name"
                rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setPwModalOpen(true);
                    }}
                    icon={<LockOutlined />}>
                    Change password
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Divider />

          <Card>
            <Title level={4}>
              <BellOutlined style={{ marginRight: 8 }} />
              Notifications
            </Title>

            <Form layout="vertical">
              <Form.Item label="Vaccine reminders">
                <Switch
                  checked={state.notifications.vaccineReminder}
                  onChange={(v) =>
                    handleToggle("notifications", "vaccineReminder", v)
                  }
                />
              </Form.Item>

              <Form.Item label="Appointment reminders">
                <Switch
                  checked={state.notifications.appointmentReminder}
                  onChange={(v) =>
                    handleToggle("notifications", "appointmentReminder", v)
                  }
                />
              </Form.Item>

              <Form.Item label="Medication reminders">
                <Switch
                  checked={state.notifications.medReminder}
                  onChange={(v) =>
                    handleToggle("notifications", "medReminder", v)
                  }
                />
              </Form.Item>
            </Form>
          </Card>

          {/* <Divider />

          <Card>
            <Title level={4}>
              <TeamOutlined style={{ marginRight: 8 }} />
              Family
            </Title>

            <Form
              layout="vertical"
              initialValues={state.family}
              onFinish={(vals) =>
                setState((s) => ({
                  ...s,
                  family: { ...s.family, familyName: vals.familyName },
                }))
              }>
              <Form.Item label="Family name" name="familyName">
                <Input
                  defaultValue={state.family.familyName}
                  onBlur={(e) =>
                    setState((s) => ({
                      ...s,
                      family: { ...s.family, familyName: e.target.value },
                    }))
                  }
                />
              </Form.Item>

              <Form.Item label="Members">
                <List
                  dataSource={state.family.members}
                  bordered
                  renderItem={(m) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          onClick={() => handleRemoveMember(m.id)}>
                          Remove
                        </Button>,
                      ]}>
                      <List.Item.Meta
                        title={m.name}
                        description={m.role || "Member"}
                      />
                    </List.Item>
                  )}
                />
                <Button
                  style={{ marginTop: 8 }}
                  type="dashed"
                  onClick={() => setManageMembersOpen(true)}>
                  Manage members
                </Button>
              </Form.Item>
            </Form>
          </Card> */}

          <Divider />

          <Card>
            <Title level={4}>
              <BgColorsOutlined style={{ marginRight: 8 }} />
              Preferences
            </Title>

            <Form layout="vertical">
              <Form.Item label="Theme">
                <Radio.Group
                  value={state.preferences.theme}
                  onChange={(e) => handlePrefChange("theme", e.target.value)}>
                  <Radio value="system">System</Radio>
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Language">
                <Select
                  value={state.preferences.language}
                  onChange={(v) => handlePrefChange("language", v)}
                  style={{ width: 160 }}>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Font size">
                <Select
                  value={state.preferences.fontSize}
                  onChange={(v) => handlePrefChange("fontSize", v)}
                  style={{ width: 160 }}>
                  <Option value="normal">Small</Option>
                  <Option value="large">Medium</Option>
                  <Option value="xlarge">Large</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>

          {/* <Divider />

          <Card>
            <Title level={4}>
              <GlobalOutlined style={{ marginRight: 8 }} />
              Privacy & Data
            </Title>

            <Form layout="vertical">
              <Form.Item label="Allow data sync">
                <Switch
                  checked={state.privacy.allowDataSync}
                  onChange={(v) => handleToggle("privacy", "allowDataSync", v)}
                />
              </Form.Item>

              <Form.Item label="Share anonymized usage">
                <Switch
                  checked={state.privacy.shareAnonymized}
                  onChange={(v) =>
                    handleToggle("privacy", "shareAnonymized", v)
                  }
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleClearCache}>
                    Clear local cache
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card> */}
        </Col>

        {/* <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              App info
            </Title>
            <Text type="secondary">Version</Text>
            <div style={{ marginTop: 8, marginBottom: 8 }}>
              <Text strong>{state.system.version}</Text>
            </div>

            <Divider />

            <Form layout="vertical">
              <Form.Item label="Developer mode">
                <Switch
                  checked={state.system.devMode}
                  onChange={(v) =>
                    setState((s) => ({
                      ...s,
                      system: { ...s.system, devMode: v },
                    }))
                  }
                />
              </Form.Item>

              <Form.Item label="Support">
                <Button type="link">Open support chat</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Title level={5}>Quick actions</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                block
                onClick={() => message.info("Exporting backup... (demo)")}>
                Export backup
              </Button>
              <Button
                block
                onClick={() => message.info("Importing backup... (demo)")}>
                Import backup
              </Button>
            </Space>
          </Card>
        </Col> */}
      </Row>

      {/* Change password modal */}
      <Modal
        title="Change password"
        open={pwModalOpen}
        onCancel={() => setPwModalOpen(false)}
        footer={null}>
        <Form
          layout="vertical"
          onFinish={() => {
            message.success("Password changed (demo)");
            setPwModalOpen(false);
          }}>
          <Form.Item
            label="Current password"
            name="current"
            rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New password"
            name="new"
            rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm"
            name="confirm"
            rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setPwModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Manage members modal */}
      <Modal
        title="Manage members"
        open={manageMembersOpen}
        onCancel={() => setManageMembersOpen(false)}
        footer={null}
        width={640}>
        <Title level={5}>Members</Title>
        <List
          dataSource={state.family.members}
          renderItem={(m) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => handleRemoveMember(m.id)}>
                  Remove
                </Button>,
              ]}>
              <List.Item.Meta title={m.name} description={m.role || "Member"} />
            </List.Item>
          )}
        />
        <Divider />
        <AddMemberInline
          onAdd={(member) => {
            handleAddMember(member);
          }}
        />
      </Modal>
    </div>
  );
}

/* Small inline component to add member inside modal */
function AddMemberInline({ onAdd }) {
  const [form] = Form.useForm();

  const onFinish = (vals) => {
    const newMember = {
      id: String(Date.now()),
      name: vals.name,
      role: vals.role || "Member",
    };
    onAdd(newMember);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      style={{ marginTop: 12 }}>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item name="role">
        <Select style={{ width: 140 }} placeholder="Role">
          <Option value="Owner">Owner</Option>
          <Option value="Member">Member</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}
