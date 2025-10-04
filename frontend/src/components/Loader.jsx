// src/components/Loader.jsx
import React from 'react';
import { Spin } from 'antd';

const Loader = ({ size = 'large', tip = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loader;
