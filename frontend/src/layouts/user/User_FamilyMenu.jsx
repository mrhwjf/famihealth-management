// User_FamilyMenu.jsx
import React from "react";
import ResponsiveMenu from "../../components/menu/ResponsiveMenu";
import User_FamilyMenuConfig from "./User_FamilyMenu.config";

const User_FamilyMenu = ({ onMenuClick }) => {
  const items = User_FamilyMenuConfig();
  return <ResponsiveMenu items={items} onMenuClick={onMenuClick} />;
};

export default User_FamilyMenu;
