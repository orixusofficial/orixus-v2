import '../styles/not-found.css';

function handleReturnHome() {
  window.location.href = '/';
}

function handleGoBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = '/';
}

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="not-found-page__background" aria-hidden="true">
        404
      </span>

      <section className="not-found-page__content" aria-labelledby="not-found-title">
        <div className="not-found-page__logo" aria-label="Orixus">
          <img src="/RB logo.svg" alt="Orixus" width="40" height="40" />
        </div>

        <p className="not-found-page__eyebrow">Orixus</p>
        <h1 className="not-found-page__title" id="not-found-title">
          This path hasn&apos;t been built... yet.
        </h1>

        <div className="not-found-page__body">
          <p>We haven&apos;t forged this path yet.</p>
          <p>We&apos;re still building something worth returning to.</p>
        </div>

        <div className="not-found-page__actions">
          <button className="not-found-page__button not-found-page__button--primary" type="button" onClick={handleReturnHome}>
            Return Home
          </button>
          <button className="not-found-page__button not-found-page__button--secondary" type="button" onClick={handleGoBack}>
            Go Back
          </button>
        </div>

        <p className="not-found-page__motivation">
          Discipline isn&apos;t about never getting lost.
          <br />
          It&apos;s about finding your way back.
        </p>
      </section>
    </main>
  );
}
