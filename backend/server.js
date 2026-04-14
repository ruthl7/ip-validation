const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

function isIPv4(ip) {
  if (typeof ip !== 'string') return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  for (let part of parts) {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return false;
    if (part.length > 1 && part.startsWith('0')) return false;
  }
  return true;
}

app.get('/health', (_req, res) => {
  console.log('[Backend] Health check requested.');
  res.json({ status: 'ok' });
});

app.post('/api/validate-ip', (req, res) => {
  console.log('[Backend] Payload received:', req.body);
  const ip = typeof req.body?.ip === 'string' ? req.body.ip.trim() : '';

  if (!ip) {
    console.warn('[Backend] Missing ip field in request body.');
    return res.status(400).json({
      message: 'ip is required'
    });
  }

  let version = 0;
  if (isIPv4(ip)) {
    version = 4;
  }

  const response = {
    ip,
    isValid: version !== 0,
    version: version === 4 ? 'IPv4' : null
  };

  console.log('[Backend] Validation result:', response);

  return res.json(response);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});