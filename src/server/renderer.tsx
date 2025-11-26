import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <title>OpenBioCard</title>
      </head>
      <body>
        {children}
        <script type="module" src="/assets/index-DF3tHg20.js"></script>
      </body>
    </html>
  )
})
