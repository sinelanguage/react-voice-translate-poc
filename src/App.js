import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'react-dropdown/style.css';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import "./App.css";

const Convert = ({ language, text }) => {
  const [convertedText, setConvertedText] = useState('');

  useEffect(() => {

    const response =
        language !== "en" &&
        axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {},
        {
          params: {
            q: text,
            key: 'AIzaSyDbtoK1kfDx3BZxJDkMfHDh-vXvWzwdhKo',
            source: language,
            target: "en",  
          }
        }
      )
      .then((response) => {
        console.log(response)
        setConvertedText(response.data.data.translations[0].translatedText);
      })
      .catch((err) => {
        console.log(language);
      });
  }, [text]);

  return <div>{convertedText}</div>;
};

const recogLanguageLanguage = [
    {value: "en-US", label: "English"},
    {value: "fr-FR", label:"French"},
    {value: "zh-CN", label: "Mandarin Chinese"},
    {value: "zh-HK", label: "Cantonese"}
]



const App = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
      if (navigator && navigator.language) {
          setLanguage(navigator.language);
      }
  }, []);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
    const startListen = (lang) => {
        SpeechRecognition.startListening({language: lang});
    }

  return (
    <div>
        <h4>Select your language</h4>
        <Dropdown options={recogLanguageLanguage} onChange={(option) => setLanguage(option.value)} value={language}/>
      <button onClick={startListen}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
      <Convert language={language.split("-")[0]} text={transcript}/>
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
