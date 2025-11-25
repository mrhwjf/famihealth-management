import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Avatar,
  Badge,
  Input,
  Button,
  Space,
  Drawer,
  Tooltip,
  Card,
  Layout,
  Modal,
  Descriptions,
  Upload,
  Form,
  Breadcrumb,
} from "antd";
import {
  PhoneOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
  ProfileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;
const LOCAL_STORAGE_KEY = "members_data";
const layoutStyle = {
  padding: "16px",
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
};

const img1 = new URL("../pages/user/namaste-dog-smiling.png", import.meta.url)
  .href;
const img2 = new URL("../pages/user/6rvsnz.jpg", import.meta.url).href;
const img3 = new URL(
  "../pages/user/2d8fda44-a143-4a14-93a7-e9d035b23fff-1676957756500.webp",
  import.meta.url
).href;
const img4 = new URL(
  "../pages/user/static-images.vnncdn.net-vps_images_publish-000001-000003-2025-11-4-_pho-anh-hai-1111.jpg",
  import.meta.url
).href;

const FamilyMembers_data = [
  {
    familyID: "1",
    id: "3123410288",
    name: "Nguyễn Grass",
    relationship: "Father",
    age: 20,
    dateofBirth: "2003-01-15",
    phoneNumber: "0912345678",
    gender: "Male",
    bloodType: "O+",
    cardImage: img3,
  },
  {
    familyID: "1",
    id: "3123410289",
    name: "Nguyễn Hữu Phong",
    relationship: "Wife",
    age: 19,
    dateofBirth: "2004-05-12",
    phoneNumber: "0912345678",
    gender: "Female",
    bloodType: "A-",
    cardImage: img1,
  },
  {
    familyID: "1",
    id: "3123410290",
    name: "Hồ Thanh Thái",
    relationship: "Son",
    age: 18,
    gender: "Male",
    phoneNumber: "0912345678",
    dateofBirth: "2005-09-08",
    bloodType: "B+",
    cardImage: img4,
  },
  {
    familyID: "1",
    id: "3123410291",
    name: "Đỗ Thiên Phú",
    relationship: "Daughter",
    dateofBirth: "2006-03-22",
    phoneNumber: "0912345678",
    age: 17,
    gender: "Female",
    bloodType: "AB-",
    cardImage: img2,
  },
];
function AddMemberForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setAvatarUrl(dataUrl);
      form.setFieldsValue({ cardImage: dataUrl });
    };
    reader.readAsDataURL(file);
    return Upload.LIST_IGNORE;
  };
  const handleFinish = (values) => {
    // auto generate ID
    const newMember = {
      familyID: String(Date.now()),
      id: String(Date.now()),
      ...values,
      cardImage: values.cardImage || "",
    };
    onSubmit(newMember);
    form.resetFields();
    setAvatarUrl(null);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Tên"
        name="name"
        rules={[
          { required: true, message: "Please input your name!" },
          { min: 3, message: "Name must be at least 3 characters!" },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Quan hệ"
        name="relationship"
        rules={[
          { required: true, message: "Please input your relationship!" },
        ]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Tuổi"
        name="age"
        rules={[
          { required: true, message: "Please input your age!" },
          // { type: "number", message: "Age must be a number!" },
          { min: 1, message: "Age must be greater than 0!" },
        ]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="dateofBirth"
        rules={[
          {
            pattern: new RegExp(
              /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/
            ),
            message: "Date of birth must be in format YYYY-MM-DD!",
          },
        ]}>
        <Input placeholder="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item label="Giới tính" name="gender">
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phoneNumber">
        <Input />
      </Form.Item>

      <Form.Item label="Nhóm máu" name="bloodType">
        <Input />
      </Form.Item>
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
      <Button type="primary" htmlType="submit" block>
        Add Member
      </Button>
    </Form>
  );
}

export default function MyFamily() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [Members, setMembers] = useState(FamilyMembers_data);
  const [filteredMembers, setFilteredMembers] = useState(FamilyMembers_data);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const addMember = (newMember) => {
    const updatedMembers = [...Members, newMember];
    setMembers(updatedMembers);

    // respect current searchText: if user has a filter, keep it applied
    if (searchText && searchText.trim() !== "") {
      const filtered = updatedMembers.filter((member) =>
        member.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(updatedMembers);
    }

    setIsAddModalOpen(false); 
  };

  const handleSearch = (value) => {
    setSearchText(value || "");

    const filtered = Members.filter((member) =>
      member.name.toLowerCase().includes((value || "").toLowerCase())
    );

    setFilteredMembers(filtered);
  };

  const goToMemberProfile = (member) => {
    navigate(`/user_family/memberprofile/${member.id}`, { state: { member } });
  };

  return (
    <Layout style={layoutStyle}>
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            marginTop: 12,
          }}>
          <Meta
            title="My Family Page"
            description={`Total family members: ${Members.length}`}
          />
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
          style={{ marginTop: "15px" }}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={(v) => handleSearch(v)}
        />

        <Content style={{ marginTop: "20px" }}>
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
                      onClick={() =>
                        goToMemberProfile(item)
                      }
                    />
                  </Tooltip>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.cardImage} alt={item.name}>
                      {(!item.cardImage || item.cardImage === "") && item.name
                        ? item.name[0]
                        : null}
                    </Avatar>
                  }
                  title={item.name}
                  description={item.relationship}
                />
              </List.Item>
            )}
          />
        </Content>
      </Card>

      {/* Member detail modal */}
      <Modal
        title={
          selectedMember
            ? `Thông tin: ${selectedMember.name}`
            : "Thông tin thành viên"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        footer={null}>
        {selectedMember ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Ảnh">
              <Avatar
                size={80}
                src={selectedMember.cardImage}
                alt={selectedMember.name}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              {selectedMember.name}
            </Descriptions.Item>
            <Descriptions.Item label="Quan hệ">
              {selectedMember.relationship}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {selectedMember.dateofBirth}
            </Descriptions.Item>
            <Descriptions.Item label="Tuổi">
              {selectedMember.age}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {selectedMember.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <PhoneOutlined style={{ marginRight: 8 }} />
              {selectedMember.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">
              {selectedMember.bloodType}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>

      {/* Add member modal */}
      <Modal
        title="Thêm người"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        centered
        footer={null}>
        <AddMemberForm onSubmit={addMember} />
      </Modal>
    </Layout>
  );
}
