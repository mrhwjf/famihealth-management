import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMyFamily } from '../../../services/familiesService.js';
import { getFamilyMembers } from '../../../services/membersFamilyService.js';
import {
  listMedicalRecordsByFamilyMember,
  getMedicalRecordCreateFormData,
  createMedicalRecord,
  updateMedicalRecordById,
  deleteMedicalRecordById,
} from '../../../services/medicalRecordService.js';

const { TextArea } = Input;

const MedicalRecordPage = () => {
  const [loading, setLoading] = useState(false);
  const [familyId, setFamilyId] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [records, setRecords] = useState([]);
  const [createFormData, setCreateFormData] = useState({ doctors: [], facilities: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const loadFamilyAndMembers = async () => {
    setLoading(true);
    try {
      const my = await getMyFamily({ headerName: 'X-Session-Id' });
      const fid = my?.data?.id || my?.id;
      if (!fid) {
        message.warning('Không tìm thấy gia đình của bạn, dùng mock.');
        // Mock members from SQL
        const list = [
          { id: 1, name: 'Nguyễn Văn A' },
          { id: 2, name: 'Nguyễn Văn B' },
        ];
        setMembers(list);
        setSelectedMemberId(list[0].id);
        // Mock createFormData (doctors, facilities)
        setCreateFormData({
          doctors: [{ id: 2, name: 'Dr. John Doe' }],
          facilities: [
            { id: 1, name: 'Bệnh viện Chợ Rẫy' },
            { id: 2, name: 'Bệnh viện Đại học Y Dược TP.HCM' },
          ],
        });
        return;
      }
      setFamilyId(fid);
      const memResp = await getFamilyMembers({ familyId: fid, headerName: 'X-Session-Id' });
      const memData = memResp?.data || memResp;
      const list = Array.isArray(memData?.items) ? memData.items : (Array.isArray(memData) ? memData : []);
      setMembers(list);
      const firstMemberId = list[0]?.id || list[0]?.memberId;
      if (firstMemberId) {
        setSelectedMemberId(firstMemberId);
      }
      const formDataResp = await getMedicalRecordCreateFormData('X-Session-Id');
      const fd = formDataResp?.data || formDataResp;
      setCreateFormData({
        doctors: Array.isArray(fd?.doctors) ? fd.doctors : [],
        facilities: Array.isArray(fd?.facilities) ? fd.facilities : [],
      });
    } catch (e) {
      console.error(e);
      message.error(e?.message || 'Không tải được dữ liệu, dùng mock.');
      // Fallback to SQL mock when API fails
      const list = [
        { id: 1, name: 'Nguyễn Văn A' },
        { id: 2, name: 'Nguyễn Văn B' },
      ];
      setMembers(list);
      setSelectedMemberId(list[0].id);
      setCreateFormData({
        doctors: [{ id: 2, name: 'Dr. John Doe' }],
        facilities: [
          { id: 1, name: 'Bệnh viện Chợ Rẫy' },
          { id: 2, name: 'Bệnh viện Đại học Y Dược TP.HCM' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (memberId) => {
    if (!memberId) return;
    setLoading(true);
    try {
      const resp = await listMedicalRecordsByFamilyMember(memberId, { page: 0, size: 100, sort: ['date,DESC'] }, 'X-Session-Id');
      const data = resp?.data || resp;
      const rows = Array.isArray(data?.content) ? data.content : (Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
      setRecords(rows.map(r => ({
        id: r.id,
        date: r.date,
        diagnosis: r.diagnosis,
        treatment: r.treatment,
        followUpDate: r.followUpDate,
        doctor: r.doctor || r.doctorName || r.doctorId,
        facility: r.facility || r.facilityName || r.facilityId,
      })));
      // If empty, use SQL mock corresponding to selected member
      if (!rows || rows.length === 0) {
        const mock = memberId === 1
          ? [{ id: 1, date: '2023-01-15', diagnosis: 'Cảm cúm', treatment: 'Nghỉ ngơi và uống thuốc hạ sốt', followUpDate: '2023-01-22', doctor: 'Dr. John Doe', facility: 'Bệnh viện Chợ Rẫy' }]
          : [{ id: 2, date: '2023-02-10', diagnosis: 'Viêm họng', treatment: 'Uống kháng sinh và súc miệng nước muối', followUpDate: '2023-02-17', doctor: 'Dr. John Doe', facility: 'Bệnh viện Chợ Rẫy' }];
        setRecords(mock);
      }
    } catch (e) {
      console.error(e);
      message.error(e?.message || 'Không tải được hồ sơ y tế, dùng mock.');
      const mock = memberId === 1
        ? [{ id: 1, date: '2023-01-15', diagnosis: 'Cảm cúm', treatment: 'Nghỉ ngơi và uống thuốc hạ sốt', followUpDate: '2023-01-22', doctor: 'Dr. John Doe', facility: 'Bệnh viện Chợ Rẫy' }]
        : [{ id: 2, date: '2023-02-10', diagnosis: 'Viêm họng', treatment: 'Uống kháng sinh và súc miệng nước muối', followUpDate: '2023-02-17', doctor: 'Dr. John Doe', facility: 'Bệnh viện Chợ Rẫy' }];
      setRecords(mock);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFamilyAndMembers(); }, []);
  useEffect(() => { if (selectedMemberId) loadRecords(selectedMemberId); }, [selectedMemberId]);

  const showModal = (record) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        familyMemberId: selectedMemberId,
        doctorId: (typeof record.doctor === 'object' ? record.doctor.id : record.doctor) || undefined,
        facilityId: (typeof record.facility === 'object' ? record.facility.id : record.facility) || undefined,
        date: record.date ? dayjs(record.date) : undefined,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        followUpDate: record.followUpDate ? dayjs(record.followUpDate) : undefined,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
      form.setFieldsValue({ familyMemberId: selectedMemberId });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => { setIsModalVisible(false); setEditingRecord(null); form.resetFields(); };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const payload = {
          familyMemberId: values.familyMemberId,
          doctorId: values.doctorId,
          facilityId: values.facilityId,
          date: values.date?.toISOString?.() || values.date,
          diagnosis: values.diagnosis,
          treatment: values.treatment,
          followUpDate: values.followUpDate?.toISOString?.() || values.followUpDate,
        };
        if (editingRecord) {
          await updateMedicalRecordById(editingRecord.id, payload, 'X-Session-Id');
          message.success('Cập nhật hồ sơ y tế thành công');
        } else {
          await createMedicalRecord(payload, 'X-Session-Id');
          message.success('Thêm hồ sơ y tế thành công');
        }
        setIsModalVisible(false);
        await loadRecords(selectedMemberId);
      } catch (e) {
        console.error(e);
        message.error(e?.message || 'Thao tác thất bại');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteMedicalRecordById(id, 'X-Session-Id');
      message.success('Xóa hồ sơ y tế thành công');
      await loadRecords(selectedMemberId);
    } catch (e) {
      console.error(e);
      message.error(e?.message || 'Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Ngày khám', dataIndex: 'date', key: 'date' },
    { title: 'Chẩn đoán', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Điều trị', dataIndex: 'treatment', key: 'treatment' },
    { title: 'Tái khám', dataIndex: 'followUpDate', key: 'followUpDate' },
    { title: 'Bác sĩ', dataIndex: 'doctor', key: 'doctor', render: (d) => (typeof d === 'object' ? (d.name || d.id) : d) },
    { title: 'Cơ sở', dataIndex: 'facility', key: 'facility', render: (f) => (typeof f === 'object' ? (f.name || f.id) : f) },
    {
      title: 'Hành động', key: 'action', render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </Space>
      )
    },
  ];

  return (
    <div>
      <h2>Quản lý hồ sơ y tế</h2>

      <Space style={{ marginBottom: 12 }}>
        <Select
          placeholder="Chọn thành viên gia đình"
          value={selectedMemberId}
          onChange={(v) => setSelectedMemberId(v)}
          style={{ minWidth: 240 }}
          options={members.map(m => ({ label: m.name || m.fullName || `Member ${m.id}`, value: m.id || m.memberId }))}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)} disabled={!selectedMemberId}>Thêm hồ sơ</Button>
      </Space>

      <Table columns={columns} dataSource={records} loading={loading} rowKey="id" />

      <Modal
        title={editingRecord ? 'Sửa hồ sơ y tế' : 'Thêm hồ sơ y tế'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="familyMemberId" label="Thành viên" rules={[{ required: true, message: 'Chọn thành viên' }]}>
            <Select
              placeholder="Chọn thành viên"
              options={members.map(m => ({ label: m.name || m.fullName || `Member ${m.id}`, value: m.id || m.memberId }))}
            />
          </Form.Item>
          <Form.Item name="doctorId" label="Bác sĩ" rules={[{ required: true, message: 'Chọn bác sĩ' }]}>
            <Select
              placeholder="Chọn bác sĩ"
              options={(createFormData.doctors || []).map(d => ({ label: d.name || d.fullName || `Doctor ${d.id}`, value: d.id }))}
            />
          </Form.Item>
          <Form.Item name="facilityId" label="Cơ sở y tế" rules={[{ required: true, message: 'Chọn cơ sở' }]}>
            <Select
              placeholder="Chọn cơ sở"
              options={(createFormData.facilities || []).map(f => ({ label: f.name || `Facility ${f.id}`, value: f.id }))}
            />
          </Form.Item>
          <Form.Item name="date" label="Ngày khám" rules={[{ required: true, message: 'Chọn ngày khám' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="diagnosis" label="Chẩn đoán" rules={[{ required: true, message: 'Nhập chẩn đoán' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="treatment" label="Điều trị" rules={[{ required: true, message: 'Nhập điều trị' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="followUpDate" label="Ngày tái khám">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalRecordPage;