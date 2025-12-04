import React from 'react';
import { Outlet } from 'react-router-dom';
import './auth.css';
import logo from '../../assets/family-insurance.png';

const AuthLayout = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-mid-glow" />
      <div className="auth-inner">
        <div className="auth-header">
          <div style={{ display: 'inline-block' }}>
            <img src={logo} alt="FamilyHealth" style={{ width: 58, height: 58 }} />
          </div>
          <div className="auth-welcome">Chào mừng đến với <span style={{ color: '#20b06b' }}>FamilyHealth</span></div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
