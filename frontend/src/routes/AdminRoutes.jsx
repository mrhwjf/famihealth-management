import React from 'react'
import AdminLayout from '../layouts/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import FamilyUsersPage from '../pages/admin/FamilyUsersPage';
import DoctorsPage from '../pages/admin/DoctorsPage';
import InviteCode from '../pages/admin/InviteCode';
import AccessManagementPage from '../pages/admin/AccessManagementPage';
import VaccinesPage from '../pages/admin/data/VaccinesPage';
import FamilyRelationshipsPage from '../pages/admin/data/FamilyRelationshipsPage';
import BloodTypesPage from '../pages/admin/data/BloodTypesPage';
import FeedbackPage from '../pages/admin/FeedbackPage';
import MedicalRecordPage from '../pages/admin/MedicalRecordPage';

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
					path: 'users/invite-code',
					element: <InviteCode />
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
					path: 'data/medical-records',
					element: <MedicalRecordPage />
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