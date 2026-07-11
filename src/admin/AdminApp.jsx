import { useState, lazy, Suspense } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import '../styles/admin-pages.css';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const AdminFeedback = lazy(() => import('./AdminFeedback'));
const AdminSettings = lazy(() => import('./AdminSettings'));

export default function AdminApp() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'feedback':
        return <AdminFeedback />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeItem={activeItem} onNavigate={setActiveItem}>
      <Suspense fallback={<div>Loading…</div>}>
        {renderContent()}
      </Suspense>
    </AdminLayout>
  );
}
