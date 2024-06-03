import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router-dom';

const SidebarContent = () => (
  <div className="sidebar-content">
    <h2>Navigation</h2>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/locate">Locate Specifics</Link></li>
      <li><Link to="/how-to-use">How to Use</Link></li>
      <li><Link to="/docs">Site Docs</Link></li>
    </ul>
  </div>
);

const AppSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  return (
    <Sidebar
      sidebar={<SidebarContent />}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={{
        sidebar: { background: "#343a40", color: "#fff", width: "250px" },
        overlay: { background: "transparent" },
        root: { position: "fixed", top: 0, left: 0, bottom: 0 },
        content: { overflowY: "auto" }
      }}
    >
      <button onClick={() => onSetSidebarOpen(true)} style={{ padding: "10px 20px" }}>
        Open sidebar
      </button>
    </Sidebar>
  );
};

export default AppSidebar;
