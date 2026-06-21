import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createServerApp } from './createApp.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const projectRoot = path.resolve(currentDirectory, '..');
const distDirectory = path.join(projectRoot, 'dist');
const app = createServerApp();
const assetRequestLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory));
  app.get(/^(?!\/api\/).*/, assetRequestLimiter, (_request, response) => {
    response.sendFile(path.join(distDirectory, 'index.html'));
  });
}

const port = Number.parseInt(process.env.PORT ?? '3001', 10);

app.listen(Number.isNaN(port) ? 3001 : port, () => {
  console.log(`Voice translate server listening on port ${Number.isNaN(port) ? 3001 : port}`);
});
