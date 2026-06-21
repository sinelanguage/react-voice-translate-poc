export function StatusBanner({ message, title, tone = 'info' }) {
  return (
    <section className={`status-banner status-banner-${tone}`} role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
