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
            source: "fr",
            target: "en",
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
    <p className="translated-text">{convertedText}</p>
  );
};

const Nav = () => {
  const { resetTranscript } = useSpeechRecognition()
  return (
    <nav>
      <button
        className="btn"
        onClick={() => SpeechRecognition.startListening({
          continuous: false,
          language: 'fr-FR'
        })}>
        Start listening
      </button>
      <button className="btn" onClick={SpeechRecognition.stopListening}>Stop listening</button>
      <button className="btn" onClick={resetTranscript}>Clear text</button>
      <MicIsListeningText />
    </nav>
  )
}

const DictatedAndTranslatedText = () => {

  const { transcript } = useSpeechRecognition();

  return(
    <div>
      <p className="display-text">{transcript}</p>
      <Convert text={transcript} />
    </div>
  )
}

const MicIsListeningText = () => {
  const { listening } = useSpeechRecognition();
  return (
    listening &&
    (
      <div className="listening-text-wrapper">
        <img className="icon" src="./mic_black_192x192.png" />
        <p className="listening-text">listening</p>
      </div>
    )
  );
}

const App = () => {

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div className="App">
      <Nav />
      <DictatedAndTranslatedText />
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
