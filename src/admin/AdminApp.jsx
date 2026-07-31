import { useState, lazy, Suspense } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/admin-pages.css';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminFeedback = lazy(() => import('./AdminFeedback'));

export default function AdminApp() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'feedback':
        return <AdminFeedback />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeItem={activeItem} onNavigate={setActiveItem}>
      <Suspense fallback={<div className="admin-loading">Loading…</div>}>
        {renderContent()}
      </Suspense>
    </AdminLayout>
  );
}
