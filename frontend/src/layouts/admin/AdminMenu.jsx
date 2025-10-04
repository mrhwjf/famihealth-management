import React from 'react';
import AdminMenuConfig from './AdminMenu.config'
import ResponsiveMenu from '../../components/menu/ResponsiveMenu';

const AdminMenu = () => {
	const items = AdminMenuConfig();
	return (
		<ResponsiveMenu items={items} />
	);
};
export default AdminMenu;