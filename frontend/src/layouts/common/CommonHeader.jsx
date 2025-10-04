import { Header } from 'antd/es/layout/layout'
import React from 'react'
import UserDropdown from '../common/UserDropdown'
import { BellOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Typography from 'antd/es/typography/Typography'

const CommonHeader = () => {
	return (
		<Header className="sticky top-0 z-50 p-5 flex items-center justify-between bg-white"
			style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
			<Space>
				<MedicineBoxOutlined className='text-2xl' />
				<Typography.Title level={4} className="m-0">
					Fami-Health
				</Typography.Title>
			</Space>
			<Space size="large" align="center">
				<BellOutlined className='text-2xl cursor-pointer' />
				<UserDropdown />
			</Space>
		</Header>
	)
}

export default CommonHeader
