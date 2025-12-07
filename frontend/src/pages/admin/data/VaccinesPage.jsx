import React from 'react';
import GenericDataManagementPage from '../shared/GenericDataManagementPage';
import {
    listVaccines,
    createVaccine,
    updateVaccineById,
    deleteVaccineById,
} from '../../../../services/vaccinesService.js';

// Fallback mock (chỉ dùng nếu API không khả dụng)
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
    const fetchList = async () => {
        const res = await listVaccines({
            pageable: { page: 0, size: 100, sort: ['id,ASC'] },
            headerName: 'X-Session-Id'
        });

        console.log("Vaccines API result:", res);

        // CASE CHUẨN THEO API
        if (Array.isArray(res?.data?.items)) {
            return res.data.items.map(v => ({
                id: v.id,
                name: v.name
            }));
        }

        // TRƯỜNG HỢP BACKEND TRẢ KHÁC THÌ FALLBACK
        if (Array.isArray(res?.items)) {
            return res.items.map(v => ({
                id: v.id,
                name: v.name
            }));
        }

        if (Array.isArray(res?.data)) {
            return res.data.map(v => ({
                id: v.id,
                name: v.name
            }));
        }

        return [];
    };



    const createItem = async (values) => {
        await createVaccine({ data: { name: values.name }, headerName: 'X-Session-Id' });
    };

    const updateItem = async (id, values) => {
        await updateVaccineById({ id, data: { name: values.name }, headerName: 'X-Session-Id' });
    };

    const deleteItem = async (id) => {
        await deleteVaccineById({ id, headerName: 'X-Session-Id' });
    };

    return (
        <GenericDataManagementPage
            pageTitle="Quản lý Vắc xin"
            itemName="vắc xin"
            initialData={initialVaccines}
            formFields={formFields}
            fetchList={fetchList}
            createItem={createItem}
            updateItem={updateItem}
            deleteItem={deleteItem}
            rowKey="id"
        />
    );
};

export default VaccinesPage;