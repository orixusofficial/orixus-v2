import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import '../styles/layout.css';

export default function AppLayout({ children, activeItem, onNavigate }) {
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);
  const closeSidebar   = () => setSidebarOpen(false);
  const openSidebar    = () => setSidebarOpen(true);

  /**
   * Hamburger in the TopNav:
   *  - mobile  → open/close the drawer
   *  - desktop → collapse/expand the sidebar
   */
  const handleMenuToggle = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      toggleCollapse();
    }
  };

  /**
   * Hamburger inside the Sidebar brand area — always toggles collapse on all sizes.
   * On mobile it closes the drawer instead so it doesn't look weird.
   */
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
    <div className={`app-layout${sidebarCollapsed ? ' app-layout--collapsed' : ''}`}>
      <Sidebar
        activeItem={activeItem}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onCollapse={handleSidebarCollapse}
      />

      {/* Overlay — mobile only */}
      <div
        className={`app-layout__overlay${sidebarOpen ? ' app-layout__overlay--visible' : ''}`}
        onClick={closeSidebar}
      />

      <TopNav onMenuToggle={handleMenuToggle} sidebarCollapsed={sidebarCollapsed} />

      <main className="app-layout__content">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
