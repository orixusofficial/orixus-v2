import '../styles/dashboard.css';

export default function PlaceholderSection({ title, children }) {
  return (
    <section className="placeholder-section">
      <h2 className="placeholder-section__title">{title}</h2>
      <p className="placeholder-section__text">{children}</p>
    </section>
  );
}
