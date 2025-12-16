import { Hono } from 'hono'
import { authMiddleware, AuthVariables } from '../middleware/auth'

export const delate = new Hono<{ Bindings: { USERNAME: string; PASSWORD: string; USER_DO: any }, Variables: AuthVariables }>()

delate.use('/', authMiddleware)

delate.post('/', async (c) => {
    try {
        const user = c.var.user!
        const id = c.env.USER_DO.idFromName(user.username)
        const stub = c.env.USER_DO.get(id)
        const response = await stub.fetch('http://internal/delate', { method: 'POST' })
        if (!response.ok) {
            return c.json({ error: 'Failed to delete account' }, 500)
        }
        return c.json({ message: 'Account deleted successfully' })
    } catch (error: any) {
        console.error('Delete error:', error)
        // Handle Durable Object reset
        if (error.message && error.message.includes('durableObjectReset')) {
            return c.json({ error: 'Service temporarily unavailable, please try again' }, 503)
        }
        return c.json({ error: 'Internal server error' }, 500)
    }
})