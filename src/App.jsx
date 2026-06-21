import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Instructions } from './components/Instructions.jsx';
import { SpeechControls } from './components/SpeechControls.jsx';
import { StatusBanner } from './components/StatusBanner.jsx';
import { TextPanel } from './components/TextPanel.jsx';
import { useTranslation } from './hooks/useTranslation.js';
import './App.css';

const SOURCE_LANGUAGE = 'en';
const TARGET_LANGUAGE = 'fr';

export default function App() {
  const { listening, transcript, resetTranscript } = useSpeechRecognition();
  const browserSupported = SpeechRecognition.browserSupportsSpeechRecognition();
  const { error, status, translation } = useTranslation({
    text: transcript,
    source: SOURCE_LANGUAGE,
    target: TARGET_LANGUAGE
  });

  if (!browserSupported) {
    return (
      <main className="app-shell">
        <StatusBanner
          title="Speech recognition is not available"
          tone="warning"
          message="Use a browser with Web Speech API support, such as a recent Chrome-based browser."
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">React voice translation proof of concept</p>
        <h1>Speak English and translate it to French</h1>
        <Instructions />
      </section>

      <SpeechControls
        listening={listening}
        onClear={resetTranscript}
        onStart={() =>
          SpeechRecognition.startListening({
            continuous: false,
            language: 'en-US'
          })
        }
        onStop={() => SpeechRecognition.stopListening()}
      />

      <div className="panel-grid">
        <TextPanel label="English transcript">
          {transcript.trim() || 'Start listening to capture speech.'}
        </TextPanel>
        <TextPanel label="French translation" accent>
          {status === 'loading' && 'Translating…'}
          {status === 'error' && error}
          {status === 'success' && translation}
          {status === 'idle' && 'Translation will appear here once speech is captured.'}
        </TextPanel>
      </div>

      {listening ? (
        <StatusBanner title="Listening" message="The microphone is active and waiting for speech." />
      ) : null}
    </main>
  );
}
