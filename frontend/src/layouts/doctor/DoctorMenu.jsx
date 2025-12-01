import React from 'react';
import { doctorMenuItems } from './DoctorMenu.config'
import ResponsiveMenu from '../../components/menu/ResponsiveMenu';

const DoctorMenu = () => {
	const items = doctorMenuItems;
	return (
		<ResponsiveMenu items={items} />
	);
};
export default DoctorMenu;