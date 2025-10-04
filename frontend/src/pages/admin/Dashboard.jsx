import React from 'react';
import { Row, Col, Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useIsMobile from '../../hooks/useIsMobile';

const Dashboard = () => {
	const isMobile = useIsMobile();

	// Sample stats data
	const stats = [
		{ title: 'Total Families', value: 120 },
		{ title: 'Total GPs', value: 35 },
		{ title: 'Total Users', value: 450 },
		{ title: 'Pending GP Approvals', value: 5 },
	];

	// Sample user growth data for the last 7 days
	const userGrowthData = [
		{ date: '09-27', users: 420 },
		{ date: '09-28', users: 425 },
		{ date: '09-29', users: 430 },
		{ date: '09-30', users: 435 },
		{ date: '10-01', users: 440 },
		{ date: '10-02', users: 445 },
		{ date: '10-03', users: 450 },
	];

	return (
		<div className="p-6">
			{/* Stats Cards */}
			<Row gutter={[16, 16]}>
				{stats.map((stat) => (
					<Col key={stat.title} span={isMobile ? 24 : 6}>
						<Card>
							<p className="text-gray-500">{stat.title}</p>
							<h2 className="text-2xl font-bold">{stat.value}</h2>
						</Card>
					</Col>
				))}
			</Row>
			<Card title="User Growth (Last 7 Days)" className="mt-6">
				<div style={{ width: '100%', height: isMobile ? 250 : 400 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={userGrowthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Line type="monotone" dataKey="users" stroke="var(--sea-green)" strokeWidth={3} dot={{ r: 4 }} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</Card>

		</div>
	);
};

export default Dashboard;
