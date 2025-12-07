// MyFamily.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFamily } from "../../services/myFamily";
import {
  List,
  Avatar,
  Input,
  Button,
  Tooltip,
  Card,
  Layout,
  Modal,
  Form,
  Upload,
} from "antd";
import {
  ProfileOutlined,
  UserAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Search } = Input;

const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const DEFAULT_SESSION_ID = "3d2c4b28-1bed-4aa2-9298-2fcad169182b";

/**
 * NOTE:
 * - No mock list — only one minimal test member is kept in initial state so you can open MemberProfile.
 * - Real data from API (getMyFamily) will replace this when available.
 */

const TEST_MEMBER = {
  id: "TEST_MEMBER_ID",
  name: "Test Member", // visible for manual testing
  relationship: "_",
  cardImage: "_",
};

const normalizeMember = (member = {}) => {
  const relationshipValue =
    member.relationship ?? member.relationshipToCreator ?? "";

  return {
    id: member.id ?? "",
    name: member.name ?? "",
    relationship: relationshipValue,
    relationshipToCreator:
      member.relationshipToCreator ?? relationshipValue ?? "",
    age: member.age ?? null,
    gender: member.gender ?? "",
    bloodType: member.bloodType ?? "",
    cardImage: member.cardImage ?? "",
  };
};

function AddMemberForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const beforeUpload = (file) => {
    if (!file.type.startsWith("image/")) return Upload.LIST_IGNORE;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
      form.setFieldsValue({ cardImage: e.target.result });
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
  };

  const handleFinish = (values) => {
    const newMember = {
      id: String(Date.now()),
      ...values,
      cardImage: values.cardImage || "_",
    };
    onSubmit(newMember);
    form.resetFields();
    setAvatarUrl(null);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Quan hệ"
        name="relationship"
        rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Tuổi" name="age">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Ngày sinh" name="dateofBirth">
        <Input placeholder="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phoneNumber">
        <Input />
      </Form.Item>
      <Form.Item label="Avatar">
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept="image/*">
          <Button icon={<UploadOutlined />}>Change avatar</Button>
        </Upload>
        {avatarUrl && (
          <Avatar src={avatarUrl} size={56} style={{ marginTop: 10 }} />
        )}
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        Add Member
      </Button>
    </Form>
  );
}

export default function MyFamily() {
  const navigate = useNavigate();
  const storedSessionId =
    sessionStorage.getItem("sessionId") ||
    sessionStorage.getItem("session_id") ||
    "";
  const sessionID = storedSessionId || DEFAULT_SESSION_ID;
  const familyID = 1;

  // start with single test member only (no other fake data)
  const [members, setMembers] = useState([TEST_MEMBER]);
  const [filteredMembers, setFilteredMembers] = useState([TEST_MEMBER]);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const membersFromApi = await getMyFamily(sessionID); // now returns array
        if (Array.isArray(membersFromApi) && membersFromApi.length > 0) {
          const normalized = membersFromApi.map(normalizeMember);
          setMembers(normalized);
          setFilteredMembers(normalized);
        } else {
          // no members returned -> keep TEST_MEMBER
          setMembers([TEST_MEMBER]);
          setFilteredMembers([TEST_MEMBER]);
        }
      } catch (err) {
        console.error("fetchMembers error (network/auth/CORS):", err);
        setMembers([TEST_MEMBER]);
        setFilteredMembers([TEST_MEMBER]);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [sessionID]);

  const handleSearch = (value) => {
    setSearchText(value || "");
    const v = (value || "").toLowerCase();
    setFilteredMembers(
      members.filter((m) => (m.name || "_").toLowerCase().includes(v))
    );
  };

  const addMember = (newMember) => {
    const normalizedNewMember = normalizeMember(newMember);
    const updated = [normalizedNewMember, ...members];
    setMembers(updated);
    setFilteredMembers(
      searchText
        ? updated.filter((m) =>
            (m.name || "").toLowerCase().includes(searchText.toLowerCase())
          )
        : updated
    );
    setIsAddModalOpen(false);
  };

  const goToMemberProfile = (member) => {
    // member.id should be valid; MemberProfile will attempt to use location.state first, else call API.
    navigate(`/user_family/memberprofile/${member.id}`, { state: { member } });
  };
  return (
    <Layout style={layoutStyle}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "12px 0",
          }}>
          <h3>My Family Page ({members.length})</h3>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsAddModalOpen(true)}>
            Add
          </Button>
        </div>

        <Search
          placeholder="Search by name"
          allowClear
          enterButton="Search"
          size="large"
          value={searchText}
          style={{ marginTop: 15 }}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
        />

        <Content style={{ marginTop: 20 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
          ) : filteredMembers.length === 0 ? (
            <div>No members</div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredMembers}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tooltip key="profile" title="View profile">
                      <Button
                        type="link"
                        icon={<ProfileOutlined />}
                        onClick={() => goToMemberProfile(item)}
                      />
                    </Tooltip>,
                  ]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.cardImage || undefined}>
                        {!item.cardImage && item.name
                          ? item.name.charAt(0)
                          : null}
                      </Avatar>
                    }
                    title={item.name || "Chủ gia đình"}
                    description={
                      item.relationshipToCreator ||
                      item.relationship ||
                      "Chủ gia đình"
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Content>
      </Card>

      <Modal
        title="Thêm người"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        centered>
        <AddMemberForm onSubmit={addMember} />
      </Modal>
    </Layout>
  );
}
