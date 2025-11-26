import { Hono } from 'hono'
import { SignIn } from '../types/siginin'
import { CreateAccount } from '../types/siginup'
import { verifyPassword } from '../utils/password'

export const siginup = new Hono<{ Bindings: CloudflareBindings }>()

async function authenticateUser(c: any, username: string, password: string) {
    console.log('Authenticating user:', username)
    console.log('ROOT_USERNAME:', c.env.ROOT_USERNAME)
    console.log('ROOT_PASSWORD length:', c.env.ROOT_PASSWORD?.length)

    // 特殊处理root账户
    if (username === c.env.ROOT_USERNAME) {
        console.log('Root user login attempt')
        if (password === c.env.ROOT_PASSWORD) {
            // 为root生成一个固定的token或动态token
            const token = `root-${crypto.randomUUID()}`
            console.log('Root login successful')
            return c.json({ token })
        } else {
            console.log('Root password incorrect')
            return c.json({ error: 'Invalid credentials' }, 401)
        }
    }

    // 普通用户登录
    const id = c.env.USER_DO.idFromName(username)
    const stub = c.env.USER_DO.get(id)
    const response = await stub.fetch('http://internal/get')
    if (!response.ok) {
        return c.json({ error: 'Invalid credentials' }, 401)
    }
    const userData: CreateAccount | null = await response.json()
    if (userData && username === userData.username && await verifyPassword(password, userData.password)) {
        return c.json({ token: userData.token })
    } else {
        return c.json({ error: 'Invalid credentials' }, 401)
    }
}

siginup.get('/', async (c) => {
    try {
        const username = c.req.query('username')
        const password = c.req.query('password')

        if (!username || !password) {
            return c.json({ error: 'Username and password are required' }, 400)
        }

        return authenticateUser(c, username, password)
    } catch (error: any) {
        console.error('Login error:', error)
        // Handle Durable Object reset
        if (error.message && error.message.includes('durableObjectReset')) {
            return c.json({ error: 'Service temporarily unavailable, please try again' }, 503)
        }
        return c.json({ error: 'Internal server error' }, 500)
    }
})

siginup.post('/', async (c) => {
    try {
        const body = await c.req.json<SignIn>()
        return authenticateUser(c, body.username, body.password)
    } catch (error: any) {
        console.error('Login error:', error)
        // Handle Durable Object reset
        if (error.message && error.message.includes('durableObjectReset')) {
            return c.json({ error: 'Service temporarily unavailable, please try again' }, 503)
        }
        return c.json({ error: 'Internal server error' }, 500)
    }
})

