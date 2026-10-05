const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const registrationsFile = path.join(__dirname, 'database', 'site-registrations.json');
const attempts = new Map();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html', dotfiles: 'deny' }));

app.get('/health', (_req, res) => res.json({ ok: true, name: 'TEAM 810 WhatsApp Bot' }));
app.post('/api/register', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, until: now + 60000 };
  if (now > entry.until) { entry.count = 0; entry.until = now + 60000; }
  entry.count++;
  attempts.set(ip, entry);
  if (entry.count > 10) return res.status(429).json({ error: 'درخواست‌های زیاد؛ یک دقیقه بعد دوباره کوشش کن.' });

  const name = String(req.body?.name || '').trim().slice(0, 80);
  const email = String(req.body?.email || '').trim().slice(0, 120);
  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (name.length < 2) return res.status(400).json({ error: 'لطفاً نام خود را وارد کن.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'لطفاً ایمیل معتبر وارد کن.' });
  if (phone.length < 8 || phone.length > 15) return res.status(400).json({ error: 'شماره واتساپ را همراه با کود کشور وارد کن.' });

  // Registration only: this endpoint does not request or expose WhatsApp pairing codes.
  try {
    fs.mkdirSync(path.dirname(registrationsFile), { recursive: true });
    let rows = [];
    if (fs.existsSync(registrationsFile)) {
      try { rows = JSON.parse(fs.readFileSync(registrationsFile, 'utf8')); if (!Array.isArray(rows)) rows = []; } catch (_) { rows = []; }
    }
    rows.push({ name, email, phone, createdAt: new Date().toISOString() });
    fs.writeFileSync(registrationsFile, JSON.stringify(rows, null, 2));
    return res.json({ ok: true, message: 'ثبت‌نام انجام شد. برای اتصال واتساپ، حساب خودت را فقط از روش امن و خصوصی مدیریت کن.' });
  } catch (err) {
    console.error('[TEAM 810] Registration save failed:', err.message);
    return res.status(500).json({ error: 'ثبت اطلاعات انجام نشد؛ دوباره کوشش کن.' });
  }
});
app.listen(PORT, '0.0.0.0', () => console.log(`[TEAM 810] Website listening on ${PORT}`));
