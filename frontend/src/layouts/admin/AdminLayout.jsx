import React from 'react'
import AdminMenu from './AdminMenu'
import Layout, { Content } from 'antd/es/layout/layout'
import CommonFooter from '../common/CommonFooter'
import CommonHeader from '../common/CommonHeader'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
	return (
		<Layout hasSider style={{ minHeight: '100vh' }}>
			<AdminMenu />
			<Layout>
				<CommonHeader />
				<Content className="content overflow-auto">
					<Outlet />
				</Content>
				<CommonFooter />
			</Layout>
		</Layout>
	)
}

export default AdminLayout