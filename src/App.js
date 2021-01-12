import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import "./App.css";

const TranslatedText = ({ text }) => {

  const [convertedText, setConvertedText] = useState('');

  useEffect(() => {
    axios
      .post(
        'https://translation.googleapis.com/language/translate/v2',
        {},
        {
          params: {
            q: text,
            key: 'AIzaSyDbtoK1kfDx3BZxJDkMfHDh-vXvWzwdhKo',
            source: "en",
            target: "fr",
            format: "text"
          }
        }
      )
      .then((response) => {
        console.log(response)
        setConvertedText(response.data.data.translations[0].translatedText);
      })
      .catch((err) => {
        console.log('rest api error blah', err);
      });
  }, [text]);

  return (
    <p className="translated-text"><span className="placeholder-text">french:</span> {convertedText}</p>
  );
};

const Instructions = () => (
  <p className="instructions">
    Press the 'Start Listening' button, wait until the listening icon appears and speak english into your mic.<br />
    When the listening icon disappears, the app is no longer listening.
  </p>
)

const Nav = ({ resetTranscript, listening }) => (
  <nav>
    <button
      className="btn"
      onClick={() => SpeechRecognition.startListening({
        continuous: false,
        language: 'en-EN'
      })}>
      Start listening
    </button>
    <button className="btn" onClick={SpeechRecognition.stopListening}>Stop listening</button>
    <button className="btn" onClick={resetTranscript}>Clear text</button>
    <MicIsListeningText listening={listening} />
  </nav>
)

const DictatedText = ({ transcript }) => (
  <p className="display-text"><span className="placeholder-text">english:</span> {transcript}</p>
)

const MicIsListeningText = ({ listening }) => {
  return (
    listening &&
    (
      <div className="listening-text-wrapper">
        <img alt="mic icon" className="icon" src="./mic_black_192x192.png" />
        <p className="listening-text">listening</p>
      </div>
    )
  );
}

const App = () => {

  const { listening, transcript, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <p className="not-supported">
        Web to speech API not supported.<br />
        Please demo this app using Google Chrome.
      </p>
    )
  }

  return (
    <div className="App">
      <Instructions />
      <Nav listening={listening} resetTranscript={resetTranscript} />
      <DictatedText transcript={transcript} />
      <TranslatedText text={transcript} />
    </div>
  )
}
export default App
