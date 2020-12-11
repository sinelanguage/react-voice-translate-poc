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
        console.log('rest api error', err);
      });
  }, [text]);

  return <p className="blue">{convertedText}</p>;
};

const App = () => {
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div className="App">
      <button onClick={() => SpeechRecognition.startListening({
        continuous: true,
        language: 'fr-FR'
      })}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p class="display-text">{transcript}</p>
      <Convert text={transcript}/>
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
