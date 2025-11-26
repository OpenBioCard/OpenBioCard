import { MiddlewareHandler } from 'hono'

export interface AuthenticatedUser {
  username: string
  type: string
  token: string
}

export interface AuthVariables {
  user?: AuthenticatedUser
  requestBody?: any
}

export const authMiddleware: MiddlewareHandler<{ Bindings: CloudflareBindings, Variables: AuthVariables }> = async (c, next) => {
  const body = await c.req.json().catch(() => ({}))

  // 将解析的 body 存储到 context 中，供后续使用
  c.set('requestBody', body)

  const token = body.token || c.req.header('Authorization')?.replace('Bearer ', '')
  const username = body.username

  if (!token || !username) {
    return c.json({ error: 'Token and username required' }, 401)
  }

  // 特殊处理root用户
  if (username === c.env.ROOT_USERNAME && token.startsWith('root-')) {
    c.set('user', {
      username: c.env.ROOT_USERNAME!,
      type: 'root',
      token
    })
    await next()
    return
  }

  const id = c.env.USER_DO.idFromName(username)
  const stub = c.env.USER_DO.get(id)
  const response = await stub.fetch('http://internal/verify-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' }
  })
  const result = await response.json() as { valid: boolean, username: string, type: string }

  if (!result.valid) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // 将用户信息添加到context
  c.set('user', {
    username: result.username,
    type: result.type,
    token
  })

  await next()
}

export const requirePermission = (requiredTypes: string | string[]): MiddlewareHandler<{ Bindings: CloudflareBindings, Variables: AuthVariables }> => {
  return async (c, next) => {
    const user = c.var.user
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    const types = Array.isArray(requiredTypes) ? requiredTypes : [requiredTypes]
    if (!types.includes(user.type)) {
      return c.json({ error: 'Insufficient permissions' }, 403)
    }

    await next()
  }
}