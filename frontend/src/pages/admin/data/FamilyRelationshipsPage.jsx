import React from 'react';
import GenericDataManagementPage from '../shared/GenericDataManagementPage';
import { getMyFamily } from '../../../../services/familiesService.js';
import { getFamilyMemberCreateFormData } from '../../../../services/membersFamilyService.js';

// Cấu hình form chuẩn theo API
const formFields = [
    { name: 'name', label: 'Tên mối quan hệ', rules: [{ required: true, message: 'Vui lòng nhập tên mối quan hệ!' }] },
    { name: 'description', label: 'Mô tả', type: 'textarea' }
];

const FamilyRelationshipsPage = () => {

    const fetchList = async () => {
        const headerName = 'X-Session-Id';
        try {
            // --- 1. Lấy danh sách gia đình của tôi ---
            const resFamily = await getMyFamily({ headerName });

        // Kiểm tra API đúng cấu trúc mới
        const familyItems = resFamily?.data?.items;
        if (!Array.isArray(familyItems) || familyItems.length === 0) {
            console.warn("Không tìm thấy gia đình! Fallback mock relationships.");
            // Mock từ SQL seed relationships_to_creator
            return [
                { id: 1, name: 'Khác', description: 'Mối quan hệ khác' },
                { id: 2, name: 'Vợ', description: 'Người vợ của người tạo' },
                { id: 3, name: 'Chồng', description: 'Người chồng của người tạo' },
                { id: 4, name: 'Con trai', description: 'Con trai của người tạo' },
                { id: 5, name: 'Con gái', description: 'Con gái của người tạo' },
                { id: 6, name: 'Cha', description: 'Bố của người tạo' },
                { id: 7, name: 'Mẹ', description: 'Mẹ của người tạo' },
                { id: 8, name: 'Anh', description: 'Anh trai ruột của người tạo' },
                { id: 9, name: 'Chị', description: 'Chị gái ruột của người tạo' },
                { id: 10, name: 'Em trai', description: 'Em trai ruột của người tạo' },
                { id: 11, name: 'Em gái', description: 'Em gái ruột của người tạo' },
                { id: 12, name: 'Ông nội', description: 'Ông nội của người tạo' },
                { id: 13, name: 'Bà nội', description: 'Bà nội của người tạo' },
                { id: 14, name: 'Ông ngoại', description: 'Ông ngoại của người tạo' },
                { id: 15, name: 'Bà ngoại', description: 'Bà ngoại của người tạo' },
            ];
        }

        // Lấy familyId từ phần tử đầu tiên
        const familyId = familyItems[0].id;
        
        // --- 2. Lấy form-data ---
        const resForm = await getFamilyMemberCreateFormData({ familyId, headerName });

        const rels = resForm?.data?.relationships ?? [];

        if (!Array.isArray(rels) || rels.length === 0) {
            // Fallback mock when API returns empty
            return [
                { id: 1, name: 'Khác', description: 'Mối quan hệ khác' },
                { id: 2, name: 'Vợ', description: 'Người vợ của người tạo' },
                { id: 3, name: 'Chồng', description: 'Người chồng của người tạo' },
                { id: 4, name: 'Con trai', description: 'Con trai của người tạo' },
                { id: 5, name: 'Con gái', description: 'Con gái của người tạo' },
                { id: 6, name: 'Cha', description: 'Bố của người tạo' },
                { id: 7, name: 'Mẹ', description: 'Mẹ của người tạo' },
                { id: 8, name: 'Anh', description: 'Anh trai ruột của người tạo' },
                { id: 9, name: 'Chị', description: 'Chị gái ruột của người tạo' },
                { id: 10, name: 'Em trai', description: 'Em trai ruột của người tạo' },
                { id: 11, name: 'Em gái', description: 'Em gái ruột của người tạo' },
                { id: 12, name: 'Ông nội', description: 'Ông nội của người tạo' },
                { id: 13, name: 'Bà nội', description: 'Bà nội của người tạo' },
                { id: 14, name: 'Ông ngoại', description: 'Ông ngoại của người tạo' },
                { id: 15, name: 'Bà ngoại', description: 'Bà ngoại của người tạo' },
            ];
        }

        // --- 3. Mapping cho UI ---
        return rels.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description || ""
        }));
        } catch (e) {
            console.warn('Load relationships failed, using mock:', e?.message || e);
            return [
                { id: 1, name: 'Khác', description: 'Mối quan hệ khác' },
                { id: 2, name: 'Vợ', description: 'Người vợ của người tạo' },
                { id: 3, name: 'Chồng', description: 'Người chồng của người tạo' },
                { id: 4, name: 'Con trai', description: 'Con trai của người tạo' },
                { id: 5, name: 'Con gái', description: 'Con gái của người tạo' },
                { id: 6, name: 'Cha', description: 'Bố của người tạo' },
                { id: 7, name: 'Mẹ', description: 'Mẹ của người tạo' },
                { id: 8, name: 'Anh', description: 'Anh trai ruột của người tạo' },
                { id: 9, name: 'Chị', description: 'Chị gái ruột của người tạo' },
                { id: 10, name: 'Em trai', description: 'Em trai ruột của người tạo' },
                { id: 11, name: 'Em gái', description: 'Em gái ruột của người tạo' },
                { id: 12, name: 'Ông nội', description: 'Ông nội của người tạo' },
                { id: 13, name: 'Bà nội', description: 'Bà nội của người tạo' },
                { id: 14, name: 'Ông ngoại', description: 'Ông ngoại của người tạo' },
                { id: 15, name: 'Bà ngoại', description: 'Bà ngoại của người tạo' },
            ];
        }
    };


    return (
        <GenericDataManagementPage
            pageTitle="Quản lý Mối quan hệ gia đình"
            itemName="mối quan hệ"
            fetchList={fetchList}
            formFields={formFields}
            rowKey="id"
        />
    );
};

export default FamilyRelationshipsPage;
