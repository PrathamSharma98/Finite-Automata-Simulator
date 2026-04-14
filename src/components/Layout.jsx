import React from 'react';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import Canvas from './Graph/Canvas';
import ValidationPanel from './ValidationPanel';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Toolbar />
        <Canvas />
        <ValidationPanel />
      </div>
    </div>
  );
};

export default Layout;
