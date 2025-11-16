import React from 'react'
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import FamilyUsersPage from '../pages/FamilyUsersPage';

const AdminRoutes = {
	children: [
		{
			path: '/admin',
			element: <AdminLayout />,
			children: [
				{
					path: '',
					element: <Dashboard />
				},
				{
					path: 'users',
					element: <FamilyUsersPage />
				}
			]
		}
	]
}
export default AdminRoutes