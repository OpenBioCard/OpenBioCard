import { Hono } from 'hono'
import { siginup } from './router/siginup'
import { siginup as signin } from './router/siginin'
import { delate } from './router/delate'
import { admin } from './router/admin'
import { UserDO } from './durable-objects/user'
import { AdminDO } from './durable-objects/admin'

type CloudflareBindings = {
  USER_DO: DurableObjectNamespace
  ADMIN_DO: DurableObjectNamespace
  ASSETS: Fetcher
  ENVIRONMENT?: string
  CORS_ALLOWED_ORIGINS?: string
  CORS_ALLOWED_METHODS?: string
  CORS_ALLOWED_HEADERS?: string
}

const app = new Hono<{ Bindings: CloudflareBindings }>()

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

const api = new Hono<{ Bindings: CloudflareBindings }>()

api.route('/signup', siginup)
api.route('/signin', signin)
api.route('/delete', delate)
api.route('/admin', admin)

// 初始化admin用户
api.get('/init-admin', async (c) => {
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

api.get('/', (c) => {
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
api.get('/user/:username', async (c) => {
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
api.post('/user/:username', async (c) => {
  const username = c.req.param('username')
  console.log(`[API] POST /user/${username} called`)
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[API] Missing or invalid Authorization header')
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    // 验证token
    const id = c.env.USER_DO.idFromName(username)
    const stub = c.env.USER_DO.get(id)
    
    console.log('[API] Verifying token with UserDO...')
    const verifyResponse = await stub.fetch('http://internal/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token })
    })

    const verifyResult: any = await verifyResponse.json()

    if (!verifyResponse.ok || !verifyResult.valid) {
      console.log('[API] Token verification failed')
      return c.json({ error: 'Invalid token' }, 401)
    }

    const profileData = await c.req.json()
    console.log('[API] Token verified. Updating profile data:', JSON.stringify(profileData))

    const updateResponse = await stub.fetch('http://internal/update-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    })

    if (updateResponse.ok) {
      console.log('[API] Profile updated successfully')
      return c.json({ success: true })
    } else {
      const errorText = await updateResponse.text()
      console.error('[API] Update failed:', errorText)
      return c.json({ error: 'Update failed', details: errorText }, 500)
    }
  } catch (error) {
    console.error('[API] Internal server error in POST /user/:username:', error)
    // @ts-ignore
    return c.json({ error: 'Internal server error', message: error.message, stack: error.stack }, 500)
  }
})

app.route('/api', api)

// SPA Fallback
app.get('*', async (c) => {
  const url = new URL(c.req.url)
  const path = url.pathname

  console.log(`[Worker] Handling catch-all route for: ${path}`)

  // 1. 如果请求的是 assets 或其他静态资源，直接通过 ASSETS fetch
  if (path.startsWith('/assets/') || path.startsWith('/icon/') || path.startsWith('/link/') || path.startsWith('/ss/') || path === '/favicon.ico') {
    if (c.env.ASSETS) {
      console.log(`[Worker] Serving static asset: ${path}`)
      return c.env.ASSETS.fetch(c.req.raw)
    }
  }

  // 2. 对于所有其他 GET 请求（非 API），返回 index.html 以支持 SPA 路由
  // 这包括 /signin, /signup, /admin, /:username 等
  if (c.env.ASSETS) {
    console.log(`[Worker] Serving index.html for SPA route: ${path}`)
    try {
      const indexUrl = new URL('/index.html', url.origin)
      const response = await c.env.ASSETS.fetch(indexUrl)
      if (response.ok) {
        return response
      }
      console.log(`[Worker] Failed to fetch index.html: ${response.status}`)
    } catch (e) {
      console.error('[Worker] Error fetching index.html:', e)
    }
  }
  
  console.log(`[Worker] ASSETS binding not found or resource not found: ${path}`)
  return c.text('Not Found', 404)
})

export default app
export { UserDO, AdminDO }
