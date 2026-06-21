export async function translateText({ source, target, text }) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source,
      target,
      text
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? 'Unable to translate right now.');
  }

  if (typeof payload?.translation !== 'string') {
    throw new Error('Translation service returned an unexpected response.');
  }

  return payload.translation;
}
