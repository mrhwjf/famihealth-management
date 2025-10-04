import { Avatar, Dropdown } from "antd";
import {
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
} from "@ant-design/icons";

const UserDropdown = () => {
	const items = [
		{
			key: "1",
			label: "Account info",
			icon: <UserOutlined />,
			path: "/profile",
		},
		{
			key: "2",
			label: "Logout",
			icon: <LogoutOutlined />,
			onClick: () => {
				console.log("Logout");
			},
		},
	];
	return (
		<Dropdown
			menu={{ items }}
			trigger={["click"]}
			placement="bottomLeft"
			arrow
		>
			<Avatar
				size="default"
				src={"https://avatars.githubusercontent.com/u/185146219"}
				className="cursor-pointer"
			/>
		</Dropdown>
	);
};

export default UserDropdown;
