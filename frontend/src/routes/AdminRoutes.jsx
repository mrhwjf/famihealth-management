import React from 'react'
import AdminLayout from '../layouts/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import FamilyUsersPage from '../pages/admin/FamilyUsersPage';
import DoctorsPage from '../pages/admin/DoctorsPage';
import AccessManagementPage from '../pages/admin/AccessManagementPage';
import VaccinesPage from '../pages/admin/data/VaccinesPage';
import FamilyRelationshipsPage from '../pages/admin/data/FamilyRelationshipsPage';
import BloodTypesPage from '../pages/admin/data/BloodTypesPage';
import FeedbackPage from '../pages/admin/FeedbackPage';

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
					path: 'users/family-users',
					element: <FamilyUsersPage />
				},
				{
					path: 'users/doctors',
					element: <DoctorsPage />
				},
				{
					path: 'access',
					element: <AccessManagementPage />
				},
				{
					path: 'data/vaccines',
					element: <VaccinesPage />
				},
				{
					path: 'data/family-relationships',
					element: <FamilyRelationshipsPage />
				},
				{
					path: 'data/blood-types',
					element: <BloodTypesPage />
				},
				{
					path: 'feedbacks',
					element: <FeedbackPage />
				}
			]
		}
	]
}
export default AdminRoutes