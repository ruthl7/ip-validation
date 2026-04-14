const cors = require('cors');
const express = require('express');
const net = require('node:net');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

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

  const version = net.isIP(ip);

  const response = {
    ip,
    isValid: version !== 0,
    version: version === 4 ? 'IPv4' : version === 6 ? 'IPv6' : null
  };

  console.log('[Backend] Validation result:', response);

  return res.json(response);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});