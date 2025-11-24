import { Hono } from 'hono'
import { renderer } from '../renderer'
import { SignIn } from '../types/siginin'
import { CreateAccount } from '../types/siginup'

export const siginup = new Hono<{ Bindings: { USERNAME: string; PASSWORD: string; USER_DO: any } }>()

siginup.post('/', async (c) => {
    const body = await c.req.json<SignIn>()
    const id = c.env.USER_DO.idFromName(body.username)
    const stub = c.env.USER_DO.get(id)
    const response = await stub.fetch(new Request('http://internal/get'))
    const userData: CreateAccount | null = await response.json()
    if (userData && body.username === userData.username && body.password === userData.password) {
        return c.json({ token: userData.token })
    } else {
        return c.json({ error: 'Invalid credentials' }, 401)
    }
})

