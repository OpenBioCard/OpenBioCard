import { Hono } from 'hono'
import { SignIn } from '../types/siginin'
import { CreateAccount } from '../types/siginup'
import { verifyPassword } from '../utils/password'

export const siginup = new Hono<{ Bindings: CloudflareBindings }>()

async function authenticateUser(c: any, username: string, password: string) {
    // 先读取环境变量
    const env = c.env
    const ROOT_USERNAME = env.ROOT_USERNAME
    const ROOT_PASSWORD = env.ROOT_PASSWORD
    const USER_DO = env.USER_DO

    // 特殊处理root账户
    if (username === ROOT_USERNAME) {
        if (password === ROOT_PASSWORD) {
            // 为root生成一个随机token并存储到AdminDO
            const token = `root-${crypto.randomUUID()}`
            const adminId = env.ADMIN_DO.idFromName('admin-manager')
            const adminStub = env.ADMIN_DO.get(adminId)
            await adminStub.fetch('http://internal/set-root-token', {
                method: 'POST',
                body: JSON.stringify({ token })
            })
            return c.json({ token })
        } else {
            return c.json({ error: 'Invalid credentials' }, 401)
        }
    }

    // 普通用户登录
    const id = USER_DO.idFromName(username)
    const stub = USER_DO.get(id)
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

