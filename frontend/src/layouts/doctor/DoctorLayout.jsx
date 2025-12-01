import React from 'react'
import DoctorMenu from './DoctorMenu'
import Layout, { Content } from 'antd/es/layout/layout'
import CommonFooter from '../common/CommonFooter'
import CommonHeader from '../common/CommonHeader'
import { Outlet } from 'react-router-dom'

const DoctorLayout = () => {
	return (
		<Layout hasSider>
			<DoctorMenu />
			<Layout>
				<CommonHeader />
				<Content>
					<Outlet />
				</Content>
				<CommonFooter />
			</Layout>
		</Layout>
	)
}

export default DoctorLayout