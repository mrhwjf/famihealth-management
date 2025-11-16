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
			path: "/users",
			type: "submenu",
			children: [
				{
					key: "1-1",
					label: "Người dùng gia đình",
					path: "/users/family-users"
				},
				{
					key: "1-2",
					label: "Bác sĩ",
					path: "/users/doctors"
				}
			]

		},
		{
			key: "2",
			label: "Quản lí truy cập",
			icon: <ControlOutlined />,
			path: "/access"
		},
		{
			key: "3",
			label: "Quản lí dữ liệu",
			icon: <DatabaseOutlined />,
			path: "/data",
			type: "submenu",
			children: [
				{
					key: "3-1",
					label: "Vắc xin",
					path: "/data/vaccines"
				},
				{
					key: "3-2",
					label: "Mối quan hệ gia đình",
					path: "/data/family-relationships"
				},
				{
					key: "3-3",
					label: "Nhóm máu",
					path: "/data/blood-types"
				}
			]
		},
		{
			key: "4",
			label: "Phản hồi",
			icon: <CommentOutlined />,
			path: "/feedbacks"
		},
		{
			key: "5",
			label: "Cài đặt",
			icon: <SettingOutlined />,
			path: "/settings"
		}
	];

	return items;
}

export default AdminMenuConfig
