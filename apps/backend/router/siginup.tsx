import { Hono } from 'hono'
import { CreateAccount } from '../types/siginup'
import { hashPassword } from '../utils/password'

export const siginup = new Hono<{ Bindings: CloudflareBindings }>()

siginup.post('/create', async (c) => {
  try {
    const body = await c.req.json<CreateAccount>()
    const username = body.username
    const password = body.password
    const type = body.type
    // Generate a token
    const token = crypto.randomUUID()

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Store in Durable Object
    const id = c.env.USER_DO.idFromName(username)
    const stub = c.env.USER_DO.get(id)
    const storeResponse = await stub.fetch('http://do/store', {
      method: 'POST',
      body: JSON.stringify({ username, password: hashedPassword, type, token }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (!storeResponse.ok) {
      return c.json({ error: 'Failed to create account' }, 500)
    }

    return c.json({ token })
  } catch (error: any) {
      console.error('Signup error:', error)
      // Handle Durable Object reset
      if (error.message && error.message.includes('durableObjectReset')) {
          return c.json({ error: 'Service temporarily unavailable, please try again' }, 503)
      }
      return c.json({ error: 'Internal server error' }, 500)
  }
})
