import React, { useCallback, useMemo } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const BaseMenu = ({ isMobile, items, collapsed, onClose }) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Build a mapping from key to path for quick navigation
	const keyToPath = useMemo(() => {
		const map = {};
		const buildMap = (items) => {
			items.forEach((item) => {
				if (item.key && item.path) map[item.key] = item.path;
				if (item.children) buildMap(item.children);
			});
		};
		buildMap(items);
		return map;
	}, [items]);

	// Find currently selected menu key based on location
	const selectedKeys = useMemo(() => {
		const findKeyByPath = (items, path) => {
			for (const item of items) {
				if (item.path && path.includes(item.path)) return item.key;
				if (item.children) {
					const childKey = findKeyByPath(item.children, path);
					if (childKey) return childKey;
				}
			}
			return null;
		};
		const key = findKeyByPath(items, location.pathname);
		return key ? [key] : [];
	}, [items, location.pathname]);

	// Handle menu click using key-to-path map
	const handleMenuClick = useCallback(
		(e) => {
			if (isMobile && onClose) onClose(); // close drawer on mobile
			const path = keyToPath[e.key];
			if (path) navigate(path);
		},
		[isMobile, onClose, keyToPath, navigate]
	);

	return (
		<Menu
			onClick={handleMenuClick}
			selectedKeys={selectedKeys}
			mode="inline"
			inlineCollapsed={collapsed}
			items={items}
			style={{ width: collapsed ? 80 : 256 }}
		/>
	);
};

export default BaseMenu;
