import express from 'express';
import rateLimit from 'express-rate-limit';

const DEFAULT_SOURCE_LANGUAGE = 'en';
const DEFAULT_TARGET_LANGUAGE = 'fr';
const MAX_TEXT_LENGTH = 500;
const LANGUAGE_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;

function normalizeLanguage(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  return LANGUAGE_PATTERN.test(trimmedValue) ? trimmedValue : fallback;
}

export function createServerApp({ apiKey = process.env.GOOGLE_TRANSLATE_API_KEY, fetchImpl = global.fetch } = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('A fetch implementation is required.');
  }

  const app = express();
  const requestLimit = Number.parseInt(process.env.TRANSLATION_RATE_LIMIT ?? '30', 10);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.post(
    '/api/translate',
    rateLimit({
      windowMs: 60_000,
      max: Number.isNaN(requestLimit) ? 30 : requestLimit,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many translation requests. Please try again shortly.' }
    }),
    async (request, response) => {
      const text = typeof request.body?.text === 'string' ? request.body.text.trim() : '';

      if (!text) {
        return response.status(400).json({ error: 'Text is required.' });
      }

      if (text.length > MAX_TEXT_LENGTH) {
        return response.status(400).json({ error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.` });
      }

      if (!apiKey) {
        return response.status(503).json({ error: 'Translation service is not configured.' });
      }

      const source = normalizeLanguage(request.body?.source, DEFAULT_SOURCE_LANGUAGE);
      const target = normalizeLanguage(request.body?.target, DEFAULT_TARGET_LANGUAGE);

      try {
        const providerResponse = await fetchImpl(
          `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: text,
              source,
              target,
              format: 'text'
            })
          }
        );

        const payload = await providerResponse.json().catch(() => null);

        if (!providerResponse.ok) {
          const providerError = payload?.error?.message ?? 'Translation provider request failed.';
          return response.status(502).json({ error: providerError });
        }

        const translation = payload?.data?.translations?.[0]?.translatedText;

        if (typeof translation !== 'string' || !translation.trim()) {
          return response.status(502).json({ error: 'Translation provider returned an invalid response.' });
        }

        return response.json({
          translation,
          detectedSourceLanguage: payload?.data?.translations?.[0]?.detectedSourceLanguage ?? source
        });
      } catch {
        return response.status(502).json({ error: 'Unable to reach the translation provider.' });
      }
    }
  );

  return app;
}
