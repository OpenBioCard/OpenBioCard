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
    await adminStub.fetch('http://internal/init-admin')
    return c.text('Admin initialized')
  } catch (error) {
    return c.text('Failed to initialize admin', 500)
  }
})

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
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

export default app
export { UserDO, AdminDO }
