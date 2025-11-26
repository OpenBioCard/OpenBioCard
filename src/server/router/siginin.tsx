import { Hono } from 'hono'
import { renderer } from '../renderer'
import { SignIn } from '../types/siginin'
import { CreateAccount } from '../types/siginup'
import { verifyPassword } from '../utils/password'

export const siginup = new Hono<{ Bindings: CloudflareBindings }>()

siginup.post('/', async (c) => {
    try {
        const body = await c.req.json<SignIn>()

        // 特殊处理root账户
        if (body.username === c.env.ROOT_USERNAME) {
            if (body.password === c.env.ROOT_PASSWORD) {
                // 为root生成一个固定的token或动态token
                const token = `root-${crypto.randomUUID()}`
                return c.json({ token })
            } else {
                return c.json({ error: 'Invalid credentials' }, 401)
            }
        }

        // 普通用户登录
        const id = c.env.USER_DO.idFromName(body.username)
        const stub = c.env.USER_DO.get(id)
        const response = await stub.fetch('http://internal/get')
        if (!response.ok) {
            return c.json({ error: 'Invalid credentials' }, 401)
        }
        const userData: CreateAccount | null = await response.json()
        if (userData && body.username === userData.username && await verifyPassword(body.password, userData.password)) {
            return c.json({ token: userData.token })
        } else {
            return c.json({ error: 'Invalid credentials' }, 401)
        }
    } catch (error: any) {
        console.error('Login error:', error)
        // Handle Durable Object reset
        if (error.message && error.message.includes('durableObjectReset')) {
            return c.json({ error: 'Service temporarily unavailable, please try again' }, 503)
        }
        return c.json({ error: 'Internal server error' }, 500)
    }
})

