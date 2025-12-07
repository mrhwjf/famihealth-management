import React from 'react'
import {
	AppstoreOutlined,
	TeamOutlined,
	DatabaseOutlined,
	SettingOutlined,
	CommentOutlined,
	ControlOutlined
} from '@ant-design/icons';

const AdminMenuConfig = () => {
	const items = [
		{
			key: "0",
			label: "Dashboard",
			icon: <AppstoreOutlined />,
			path: "/admin"
		},
		{
			key: "1",
			label: "Quản lí tài khoản",
			icon: <TeamOutlined />,
			path: "/admin/users",
			type: "submenu",
			children: [
				{
					key: "1-1",
					label: "Người dùng gia đình",
					path: "/admin/users/family-users"
				},
				{
					key: "1-2",
					label: "Bác sĩ",
					path: "/admin/users/doctors"
				},
				{
					key: "1-3",
					label: "Mã mời gia đình",
					path: "/admin/users/invite-code"
				}
			]

		},
		{
			key: "2",
			label: "Quản lí truy cập",
			icon: <ControlOutlined />,
			path: "/admin/access"
		},
		{
			key: "3",
			label: "Quản lí dữ liệu",
			icon: <DatabaseOutlined />,
			path: "/admin/data",
			type: "submenu",
			children: [
				{
					key: "3-1",
					label: "Vắc xin",
					path: "/admin/data/vaccines"
				},
				{
					key: "3-2",
					label: "Hồ sơ y tế",
					path: "/admin/data/medical-records"
				},
				{
					key: "3-3",
					label: "Mối quan hệ gia đình",
					path: "/admin/data/family-relationships"
				},
				{
					key: "3-4",
					label: "Nhóm máu",
					path: "/admin/data/blood-types"
				}
			]
		},
		{
			key: "4",
			label: "Phản hồi",
			icon: <CommentOutlined />,
			path: "/admin/feedbacks"
		},
		{
			key: "5",
			label: "Cài đặt",
			icon: <SettingOutlined />,
			path: "/admin/settings"
		}
	];

	return items;
}

export default AdminMenuConfig
