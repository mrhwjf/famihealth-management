import React from 'react';
import ResponsiveMenu from '../../components/menu/ResponsiveMenu';
import User_FamilyMenuConfig from './User_FamilyMenu.config';

const User_FamilyMenu = () => {
    const items = User_FamilyMenuConfig();
    return (
        <ResponsiveMenu items={items} />
    );
};
export default User_FamilyMenu;