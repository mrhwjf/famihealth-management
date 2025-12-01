import React, { useState } from 'react';
import { Layout, Drawer, Button, Divider } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import BaseMenu from './BaseMenu';
import useIsMobile from '../../hooks/useIsMobile';
import LogoutButton from './LogoutButton';


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
					<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
						<div style={{ flex: 1, overflowY: 'auto' }}>
							<BaseMenu
								items={items}
								isMobile
								onClose={closeDrawer}
								collapsed={false}
								toggleCollapsed={() => { }}
							/>
						</div>
						<Divider style={{ margin: '12px 0' }} />
						<div style={{ padding: 16 }}>
							<LogoutButton collapsed={false} onAfterLogout={closeDrawer} />
						</div>
					</div>
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
				backgroundColor: 'white',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<div style={{ flex: 1, overflowY: 'auto' }}>
				<BaseMenu
					items={items}
					isMobile={false}
					collapsed={collapsed}
					toggleCollapsed={toggleCollapsed}
				/>
			</div>
			<div style={{ padding: collapsed ? 8 : 16 }}>
				<LogoutButton collapsed={collapsed} />
			</div>
		</Sider>
	);
};

export default ResponsiveMenu;
