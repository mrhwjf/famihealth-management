import React from 'react'
import AdminLayout from '../layouts/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import FamilyUsersPage from '../pages/admin/FamilyUsersPage';

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