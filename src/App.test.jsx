import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App.jsx';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { translateText } from './lib/translationClient.js';

vi.mock('react-speech-recognition', () => ({
  default: {
    browserSupportsSpeechRecognition: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn()
  },
  useSpeechRecognition: vi.fn()
}));

vi.mock('./lib/translationClient.js', () => ({
  translateText: vi.fn()
}));

describe('App', () => {
  beforeEach(() => {
    SpeechRecognition.browserSupportsSpeechRecognition.mockReturnValue(true);
    SpeechRecognition.startListening.mockReset();
    SpeechRecognition.stopListening.mockReset();
    useSpeechRecognition.mockReturnValue({
      listening: false,
      resetTranscript: vi.fn(),
      transcript: ''
    });
    translateText.mockReset();
  });

  it('renders a browser support warning when speech recognition is unavailable', () => {
    SpeechRecognition.browserSupportsSpeechRecognition.mockReturnValue(false);

    render(<App />);

    expect(screen.getByText(/speech recognition is not available/i)).toBeInTheDocument();
  });

  it('starts and stops listening through the speech recognition library', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: /start listening/i }));
    await user.click(screen.getByRole('button', { name: /stop listening/i }));

    expect(SpeechRecognition.startListening).toHaveBeenCalledWith({
      continuous: false,
      language: 'en-US'
    });
    expect(SpeechRecognition.stopListening).toHaveBeenCalled();
  });

  it('clears the transcript with the provided callback', async () => {
    const user = userEvent.setup();
    const resetTranscript = vi.fn();

    useSpeechRecognition.mockReturnValue({
      listening: false,
      resetTranscript,
      transcript: 'Hello world'
    });
    translateText.mockResolvedValue('Bonjour le monde');

    render(<App />);
    await user.click(screen.getByRole('button', { name: /clear text/i }));

    expect(resetTranscript).toHaveBeenCalled();
  });

  it('shows translated text after a successful request', async () => {
    let resolveTranslation;
    translateText.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveTranslation = resolve;
        })
    );
    useSpeechRecognition.mockReturnValue({
      listening: true,
      resetTranscript: vi.fn(),
      transcript: 'Hello world'
    });

    render(<App />);

    expect(screen.getByText(/translating/i)).toBeInTheDocument();
    resolveTranslation('Bonjour le monde');
    expect(await screen.findByText('Bonjour le monde')).toBeInTheDocument();
    expect(screen.getByText(/the microphone is active/i)).toBeInTheDocument();
  });

  it('shows an error state when translation fails', async () => {
    translateText.mockRejectedValue(new Error('Translation backend unavailable'));
    useSpeechRecognition.mockReturnValue({
      listening: false,
      resetTranscript: vi.fn(),
      transcript: 'Hello world'
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Translation backend unavailable')).toBeInTheDocument();
    });
  });
});
