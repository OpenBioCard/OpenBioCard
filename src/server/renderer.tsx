import { jsxRenderer } from 'hono/jsx-renderer'
import { Link } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <Link href="/src/server/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script type="module" src="/assets/index-CWOPS2PB.js"></script>
      </body>
    </html>
  )
})
