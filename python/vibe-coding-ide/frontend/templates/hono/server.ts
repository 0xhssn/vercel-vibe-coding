import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'

const app = new Hono()

// Secure CORS configuration - only allow specific origins
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use('*', cors({
  origin: (origin) => {
    return ALLOWED_ORIGINS.includes(origin) ? origin : null
  },
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/api/health', (c) => c.json({ status: 'ok', service: 'hono' }))
app.get('/api/ping', (c) => c.json({ message: 'pong' }))

type Todo = { id: string; title: string }
const todos: Todo[] = []

app.get('/api/todos', (c) => c.json({ todos }))
app.post('/api/todos', async (c) => {
  const body = await c.req.json<{ title?: string }>().catch(() => ({} as any))
  const title = (body?.title || '').trim()
  if (!title) return c.json({ error: 'title is required' }, 400)
  const todo = { id: String(Date.now()), title }
  todos.push(todo)
  return c.json({ todo }, 201)
})
app.delete('/api/todos/:id', (c) => {
  const id = c.req.param('id')
  const idx = todos.findIndex((t) => t.id === id)
  if (idx === -1) return c.json({ error: 'not found' }, 404)
  const [deleted] = todos.splice(idx, 1)
  return c.json({ deleted })
})

const port = Number(process.env.PORT) || 3000
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })
console.log(`Server is running on http://0.0.0.0:${port}`)
