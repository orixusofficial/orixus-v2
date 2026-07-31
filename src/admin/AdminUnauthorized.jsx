import '../styles/admin-pages.css';

export default function AdminUnauthorized() {
  return (
    <div className="admin-403">
      <div className="admin-403__content">
        <div className="admin-403__code">403</div>
        <h1 className="admin-403__title">Unauthorized</h1>
        <p className="admin-403__message">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
