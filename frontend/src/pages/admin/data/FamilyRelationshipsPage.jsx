import React from 'react';
import GenericDataManagementPage from '../shared/GenericDataManagementPage';

// Dữ liệu giả lập khớp với database
const initialRelationships = [
    { id: 1, relationship_name: 'Vợ', description: 'Người vợ của người tạo' },
    { id: 2, relationship_name: 'Chồng', description: 'Người chồng của người tạo' },
    { id: 3, relationship_name: 'Con trai', description: 'Con trai của người tạo' },
    { id: 4, relationship_name: 'Con gái', description: 'Con gái của người tạo' },
    { id: 5, relationship_name: 'Cha', description: 'Bố của người tạo' },
    { id: 6, relationship_name: 'Mẹ', description: 'Mẹ của người tạo' },
];

// Cấu hình form khớp với tên cột trong database
const formFields = [
    { name: 'relationship_name', label: 'Tên mối quan hệ', rules: [{ required: true, message: 'Vui lòng nhập tên mối quan hệ!' }] },
    { name: 'description', label: 'Mô tả', type: 'textarea', rules: [{ required: false }] },
];

const FamilyRelationshipsPage = () => {
    return (
        <GenericDataManagementPage
            pageTitle="Quản lý Mối quan hệ gia đình"
            itemName="mối quan hệ"
            initialData={initialRelationships}
            formFields={formFields}
        />
    );
};

export default FamilyRelationshipsPage;