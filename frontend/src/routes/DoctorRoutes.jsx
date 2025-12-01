import React from 'react';
import DoctorLayout from '../layouts/doctor/DoctorLayout';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import AppointmentPage from '../pages/doctor/AppointmentPage';
import PatientPage from '../pages/doctor/PatientPage';
import ProfileDoctorPage from '../pages/doctor/ProfileDoctorPage';
import SettingPage from '../pages/doctor/SettingPage';

const DoctorRoutes = {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
        {
            path: '',
            element: <DoctorDashboard />
        },
        {
            path: 'appointments',
            element: <AppointmentPage />
        },
        {
            path: 'patients',
            element: <PatientPage />
        },
        {
            path: 'profile',
            element: <ProfileDoctorPage />
        },
        {
            path: 'settings',
            element: <SettingPage />
        }
    ]
};

export default DoctorRoutes;