import React from 'react';
import AuthLayout from '../pages/auth/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

const AuthRoutes = {
  children: [
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: '',
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'forgot',
          element: <ForgotPassword />
        }
      ]
    }
  ]
}

export default AuthRoutes;
