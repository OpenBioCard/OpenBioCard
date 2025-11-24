import { MiddlewareHandler } from 'hono'

export interface AuthenticatedUser {
  username: string
  type: string
  token: string
}

export interface AuthVariables {
  user?: AuthenticatedUser
}

export const authMiddleware: MiddlewareHandler<{ Bindings: { USER_DO: any }, Variables: AuthVariables }> = async (c, next) => {
  const body = await c.req.json().catch(() => ({}))
  const token = body.token || c.req.header('Authorization')?.replace('Bearer ', '')
  const username = body.username

  if (!token || !username) {
    return c.json({ error: 'Token and username required' }, 401)
  }

  const id = c.env.USER_DO.idFromName(username)
  const stub = c.env.USER_DO.get(id)
  const response = await stub.fetch('http://internal/verify-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' }
  })
  const result = await response.json()

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

export const requirePermission = (requiredType: string): MiddlewareHandler<{ Bindings: { USER_DO: any }, Variables: AuthVariables }> => {
  return async (c, next) => {
    const user = c.var.user
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    if (user.type !== requiredType) {
      return c.json({ error: 'Insufficient permissions' }, 403)
    }

    await next()
  }
}