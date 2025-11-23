import { Hono } from 'hono'
import { renderer } from './renderer'
import { siginup } from './router/siginup'
import { UserDO } from './durable-objects/user'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use(renderer)

app.route('/signup', siginup)

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
export { UserDO }
