import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <title>OpenBioCard</title>
      </head>
      <body>
        {children}
        <script type="module" src="/assets/index-C2xb4NQ8.js"></script>
      </body>
    </html>
  )
})
