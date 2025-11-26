import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <title>OpenBioCard</title>
      </head>
      <body>
        {children}
        <script type="module" src="/assets/index-e7H7A8B2.js"></script>
      </body>
    </html>
  )
})
