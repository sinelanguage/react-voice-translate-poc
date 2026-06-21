// @vitest-environment node

import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { createServerApp } from './createApp.js';

describe('createServerApp', () => {
  it('rejects empty text', async () => {
    const app = createServerApp({ apiKey: 'test-key', fetchImpl: vi.fn() });

    const response = await request(app).post('/api/translate').send({ text: '   ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Text is required.' });
  });

  it('returns a translation when the provider succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          translations: [
            {
              translatedText: 'Bonjour le monde'
            }
          ]
        }
      })
    });

    const app = createServerApp({ apiKey: 'test-key', fetchImpl });
    const response = await request(app).post('/api/translate').send({ text: 'Hello world' });

    expect(response.status).toBe(200);
    expect(response.body.translation).toBe('Bonjour le monde');
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it('returns a configuration error when the API key is missing', async () => {
    const app = createServerApp({ apiKey: '', fetchImpl: vi.fn() });
    const response = await request(app).post('/api/translate').send({ text: 'Hello world' });

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ error: 'Translation service is not configured.' });
  });
});
