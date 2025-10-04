import React, { useState } from 'react';
import { Layout, Drawer, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import BaseMenu from './BaseMenu';
import useIsMobile from '../../hooks/useIsMobile';


const { Sider } = Layout;

const ResponsiveMenu = ({ items }) => {
	const isMobile = useIsMobile();
	const [collapsed, setCollapsed] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	const toggleCollapsed = () => setCollapsed(!collapsed);
	const openDrawer = () => setDrawerVisible(true);
	const closeDrawer = () => setDrawerVisible(false);

	if (isMobile) {
		return (
			<>
				<Button
					type="primary"
					onClick={openDrawer}
					style={{
						position: 'fixed',
						top: 16,
						left: 16,
						zIndex: 1000,
					}}
					icon={drawerVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
				/>
				<Drawer
					title="Menu"
					placement="left"
					onClose={closeDrawer}
					open={drawerVisible}
					styles={{ padding: 0 }}
				>
					<BaseMenu
						items={items}
						isMobile
						onClose={closeDrawer}
						collapsed={false} // drawer never collapses
						toggleCollapsed={() => { }}
					/>
				</Drawer>
			</>
		);
	}

	// Desktop / larger screens
	return (
		<Sider
			collapsible
			collapsed={collapsed}
			onCollapse={toggleCollapsed}
			width={256}
			style={{
				minHeight: '100vh',
				backgroundColor: 'white'
			}}
		>
			<BaseMenu
				items={items}
				isMobile={false}
				collapsed={collapsed}
				toggleCollapsed={toggleCollapsed}
			/>
		</Sider>
	);
};

export default ResponsiveMenu;
