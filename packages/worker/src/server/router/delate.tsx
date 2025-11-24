import { Hono } from 'hono'
import { Delate } from '../types/delate'
import { authMiddleware, AuthVariables } from '../middleware/auth'

export const delate = new Hono<{ Bindings: { USERNAME: string; PASSWORD: string; USER_DO: any }, Variables: AuthVariables }>()

delate.use('/', authMiddleware)

delate.post('/', async (c) => {
    const user = c.var.user!
    const id = c.env.USER_DO.idFromName(user.username)
    const stub = c.env.USER_DO.get(id)
    await stub.fetch('http://internal/delate', { method: 'POST' })
    return c.json({ message: 'Account deleted successfully' })
})