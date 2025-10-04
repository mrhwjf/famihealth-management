import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<Result
				status="404"
				title="404"
				subTitle="Trang bạn tìm kiếm không có."
				extra={
					// Assume user is admin
					<Button type="primary" onClick={() => navigate("/")}>
						Quay lại trang chủ
					</Button>
				}
				className="shadow-lg rounded-lg bg-white p-8"
			/>
		</div>
	);
};

export default NotFound;
