import { Hono } from 'hono'
import { siginup } from './router/siginup'
import { siginup as signin } from './router/siginin'
import { delate } from './router/delate'
import { admin } from './router/admin'
import { UserDO } from './durable-objects/user'
import { AdminDO } from './durable-objects/admin'

const app = new Hono<{ Bindings: CloudflareBindings & { ADMIN_DO: DurableObjectNamespace } }>()

// CORS middleware
app.use('*', async (c, next) => {
  const allowedOrigins = c.env.CORS_ALLOWED_ORIGINS || '*'
  const allowedMethods = c.env.CORS_ALLOWED_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  const allowedHeaders = c.env.CORS_ALLOWED_HEADERS?.split(',') || ['Content-Type', 'Authorization']

  // Set CORS headers
  c.header('Access-Control-Allow-Origin', allowedOrigins)
  c.header('Access-Control-Allow-Methods', allowedMethods.join(', '))
  c.header('Access-Control-Allow-Headers', allowedHeaders.join(', '))

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }

  await next()
})


app.route('/signup', siginup)
app.route('/signin', signin)
app.route('/delete', delate)
app.route('/admin', admin)

// 初始化admin用户
app.get('/init-admin', async (c) => {
  try {
    const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
    const adminStub = c.env.ADMIN_DO.get(adminId)
    const response = await adminStub.fetch('http://internal/init-admin', {
      method: 'POST'
    })

    if (!response.ok) {
      console.error('AdminDO init-admin failed:', await response.text())
      return c.text('Failed to initialize admin', 500)
    }

    return c.text('Admin initialized')
  } catch (error) {
    console.error('Init admin error:', error)
    return c.text('Failed to initialize admin', 500)
  }
})

app.get('/', (c) => {
  return c.json({
    message: 'OpenBioCard API',
    version: '1.0.0',
    endpoints: {
      auth: ['/signup', '/signin'],
      user: ['/user/:username'],
      admin: ['/admin', '/init-admin']
    }
  })
})

// 用户资料API
app.get('/user/:username', async (c) => {
  const username = c.req.param('username')

  try {
    const id = c.env.USER_DO.idFromName(username)
    const stub = c.env.USER_DO.get(id)
    const response = await stub.fetch('http://internal/get-profile')

    if (response.ok) {
      const profileData = await response.json()
      return c.json(profileData)
    } else {
      return c.json({ error: 'User not found' }, 404)
    }
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 更新用户资料API
app.post('/user/:username', async (c) => {
  const username = c.req.param('username')
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    // 验证token
    const id = c.env.USER_DO.idFromName(username)
    const stub = c.env.USER_DO.get(id)
    const verifyResponse = await stub.fetch('http://internal/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    })

    if (!verifyResponse.ok) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const profileData = await c.req.json()

    const updateResponse = await stub.fetch('http://internal/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    })

    if (updateResponse.ok) {
      return c.json({ success: true })
    } else {
      return c.json({ error: 'Update failed' }, 500)
    }
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
export { UserDO, AdminDO }
