import { Hono } from 'hono'
import { renderer } from '../renderer'
import { CreateAccount } from '../types/siginup'
export const siginup = new Hono<{ Bindings: CloudflareBindings }>()

siginup.post('/create', async (c) => {
  const body = await c.req.json<CreateAccount>()
  const username = body.username
  const password = body.password
  const type = body.type
  // Generate a token
  const token = crypto.randomUUID()

  // Store in Durable Object
  const id = c.env.USER_DO.idFromName(username)
  const stub = c.env.USER_DO.get(id)
  await stub.fetch('http://do/store', {
    method: 'POST',
    body: JSON.stringify({ username, password, type, token }),
    headers: { 'Content-Type': 'application/json' }
  })

  return c.json({ token })
})
