import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import "./App.css";

const Convert = ({ text }) => {
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

const Nav = ({ resetTranscript, listening }) => {
  return (
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
}

const DictatedAndTranslatedText = ({ transcript }) => {

  return (
    <div>
      <p className="display-text"><span className="placeholder-text">english:</span> {transcript}</p>
      <Convert text={transcript} />
    </div>
  )
}

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
    return <p className="not-supported">Web to speech API not supported</p>
  }

  return (
    <div className="App">
      <Nav listening={listening} resetTranscript={resetTranscript} />
      <DictatedAndTranslatedText transcript={transcript} />
    </div>
  )
}
export default App


/*
1. We need the web to speech API (DICTOPHONE)
2. Store the dictated text
3. Send the dictated text to the GCP API
4. Display the translated text
*/
