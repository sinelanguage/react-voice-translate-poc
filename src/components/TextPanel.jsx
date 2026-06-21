export function TextPanel({ accent = false, children, label }) {
  return (
    <section className={`text-panel${accent ? ' text-panel-accent' : ''}`}>
      <h2>{label}</h2>
      <p>{children}</p>
    </section>
  );
}
