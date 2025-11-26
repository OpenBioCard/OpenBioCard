import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Link href="/src/server/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script type="module" src="/assets/index-CVxLinS3.js"></script>
      </body>
    </html>
  )
})
