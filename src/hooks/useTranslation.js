import { useEffect, useMemo, useState } from 'react';

import { translateText } from '../lib/translationClient.js';

const INITIAL_STATE = {
  error: '',
  status: 'idle',
  translation: ''
};

export function useTranslation({ source, target, text }) {
  const normalizedText = useMemo(() => text.trim(), [text]);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!normalizedText) {
      return undefined;
    }

    let cancelled = false;

    setState({
      error: '',
      status: 'loading',
      translation: ''
    });

    translateText({ source, target, text: normalizedText })
      .then((translation) => {
        if (!cancelled) {
          setState({
            error: '',
            status: 'success',
            translation
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            error: error.message || 'Unable to translate right now.',
            status: 'error',
            translation: ''
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedText, source, target]);

  return normalizedText ? state : INITIAL_STATE;
}
