import React from 'react';
import GenericDataManagementPage from '../shared/GenericDataManagementPage';

// Dữ liệu giả lập khớp với seed data trong database của bạn
const initialVaccines = [
    { id: 1, name: 'Viêm gan B' },
    { id: 2, name: 'Bại liệt' },
    { id: 3, name: 'Sởi - Quai bị - Rubella (MMR)' },
    { id: 4, name: 'Uốn ván' },
    { id: 5, name: 'Cúm mùa' },
    { id: 6, name: 'COVID-19' },
];

// Chỉ còn trường 'name' trong form
const formFields = [
    { name: 'name', label: 'Tên Vắc xin', rules: [{ required: true, message: 'Vui lòng nhập tên vắc xin!' }] },
];

const VaccinesPage = () => {
    return (
        <GenericDataManagementPage
            pageTitle="Quản lý Vắc xin"
            itemName="vắc xin"
            initialData={initialVaccines}
            formFields={formFields}
        />
    );
};

export default VaccinesPage;