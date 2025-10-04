import React from 'react'
import NotFoundPage from '../pages/error/NotFoundPage';


const ErrorRoutes = {
	children: [
		{
			path: "*",
			element: <NotFoundPage />,
		}
	]
};

export default ErrorRoutes