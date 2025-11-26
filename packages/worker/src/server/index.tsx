import { Hono } from 'hono'
import { renderer } from './renderer'
import { siginup } from './router/siginup'
import { siginup as signin } from './router/siginin'
import { delate } from './router/delate'
import { admin } from './router/admin'
import { UserDO } from './durable-objects/user'
import { AdminDO } from './durable-objects/admin'

const app = new Hono<{ Bindings: CloudflareBindings & { ADMIN_DO: DurableObjectNamespace } }>()

app.use(renderer)

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
  return c.render(<h1>Welcome to OpenBioCard API</h1>)
})

app.get('/frontend', (c) => {
  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/frontend/main.js"></script>
  </body>
</html>`)
})

// 处理用户个人页面路由 /{username} - 放在最后，确保其他路由优先
app.get('/:username', async (c) => {
  const username = c.req.param('username')

  // 排除已定义的路由和保留用户名
  if (['signup', 'signin', 'delete', 'admin', 'init-admin', 'frontend'].includes(username)) {
    return c.notFound()
  }

  // 返回前端页面，让前端路由处理
  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${username} - OpenBioCard</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/frontend/main.js"></script>
  </body>
</html>`)
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
