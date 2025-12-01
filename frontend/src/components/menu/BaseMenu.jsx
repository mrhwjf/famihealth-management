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

	// Find currently selected menu key based on location (prefer the deepest/longest path match)
	const selectedKeys = useMemo(() => {
		const findBestMatch = (items, path) => {
			let best = { key: null, length: -1 };
			for (const item of items) {
				// Prefer prefix match to avoid false positives
				if (item.path && (path === item.path || path.startsWith(item.path))) {
					const len = item.path.length;
					if (len > best.length) best = { key: item.key, length: len };
				}
				if (item.children) {
					const childBest = findBestMatch(item.children, path);
					if (childBest.key && childBest.length > best.length) best = childBest;
				}
			}
			return best;
		};
		const best = findBestMatch(items, location.pathname);
		return best.key ? [best.key] : [];
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
