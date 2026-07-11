import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopNav from '../components/AdminTopNav';
import '../styles/admin-layout.css';

export default function AdminLayout({ children, activeItem, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  const handleMenuToggle = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      toggleCollapse();
    }
  };

  const handleSidebarCollapse = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    } else {
      toggleCollapse();
    }
  };

  const handleNavigate = (id) => {
    onNavigate?.(id);
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  return (
    <div className={`admin-layout${sidebarCollapsed ? ' admin-layout--collapsed' : ''}`}>
      <AdminSidebar
        activeItem={activeItem}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapse={handleSidebarCollapse}
      />

      <div
        className={`admin-layout__overlay${sidebarOpen ? ' admin-layout__overlay--visible' : ''}`}
        onClick={closeSidebar}
      />

      <AdminTopNav onMenuToggle={handleMenuToggle} sidebarCollapsed={sidebarCollapsed} />

      <main className="admin-layout__content">
        <div className="admin-page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
