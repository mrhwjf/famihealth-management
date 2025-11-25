import React from 'react'
import User_FamilyMenu  from './User_FamilyMenu.jsx'
import Layout, { Content } from 'antd/es/layout/layout'
import CommonFooter from '../common/CommonFooter'
import CommonHeader from '../common/CommonHeader'
import { Outlet } from 'react-router-dom'

const User_Family_Layout = () => {
	return (
		<Layout hasSider>
			<User_FamilyMenu />
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

export default User_Family_Layout