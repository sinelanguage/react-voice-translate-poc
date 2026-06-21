export function SpeechControls({ listening, onClear, onStart, onStop }) {
  return (
    <section className="controls" aria-label="Speech controls">
      <button className="btn" onClick={onStart} type="button">
        Start listening
      </button>
      <button className="btn btn-secondary" onClick={onStop} type="button">
        Stop listening
      </button>
      <button className="btn btn-secondary" onClick={onClear} type="button">
        Clear text
      </button>
      <span aria-live="polite" className={`listening-chip${listening ? ' is-live' : ''}`}>
        <img alt="" className="icon" src="/mic_black_192x192.png" />
        {listening ? 'Listening' : 'Microphone idle'}
      </span>
    </section>
  );
}
