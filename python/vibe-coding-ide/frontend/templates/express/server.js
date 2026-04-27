import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

// Secure CORS configuration - only allow specific origins
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Only set CORS headers if origin is in allowed list
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'express', time: new Date().toISOString() });
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// Simple in-memory todos
const todos = [];

app.get('/api/todos', (_req, res) => {
  res.json({ todos });
});

app.post('/api/todos', (req, res) => {
  const title = (req.body && req.body.title) || '';
  if (!title) return res.status(400).json({ error: 'title is required' });
  const todo = { id: String(Date.now()), title };
  todos.push(todo);
  res.status(201).json({ todo });
});

app.delete('/api/todos/:id', (req, res) => {
  const id = req.params.id;
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const [deleted] = todos.splice(idx, 1);
  res.json({ deleted });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Express API listening on http://0.0.0.0:${port}`);
});
