import { Hono } from 'hono'
import { authMiddleware, requirePermission, AuthVariables } from '../middleware/auth'
import { hashPassword } from '../utils/password'

export const admin = new Hono<{ Bindings: CloudflareBindings & { ADMIN_DO: DurableObjectNamespace }, Variables: AuthVariables }>()

// 检查权限（用于前端权限验证）
admin.post('/check-permission', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  // 权限检查由中间件完成，这里只需返回成功
  return c.json({ success: true, type: c.var.user?.type })
})

// 获取用户列表（POST方式，用于前端）
admin.post('/users/list', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    console.log('Getting users list...')

    // 检查 ADMIN_DO 是否存在
    if (!c.env.ADMIN_DO) {
      console.error('ADMIN_DO is not available in environment')
      return c.json({ error: 'Service configuration error' }, 500)
    }

    // 从 AdminDO 读取用户列表
    const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
    console.log('Got admin ID:', adminId)

    const adminStub = c.env.ADMIN_DO.get(adminId)
    console.log('Got admin stub, fetching users...')

    const doResponse = await adminStub.fetch('http://internal/users')
    console.log('AdminDO response status:', doResponse.status)

    if (!doResponse.ok) {
      const errorText = await doResponse.text()
      console.error('Failed to fetch users from AdminDO:', errorText)
      return c.json({ error: 'Failed to fetch users' }, 500)
    }

    const { users: allUsers } = await doResponse.json() as { users: Array<{username: string, type: string}> }
    console.log('Users from AdminDO:', allUsers.length, 'users:', allUsers.map(u => u.username))

    // 过滤掉root用户
    const users = allUsers.filter(u => u.username !== c.env.ROOT_USERNAME)
    console.log('Returning users list:', users.length, 'users:', users.map(u => u.username))
    return c.json({ users })
  } catch (error: any) {
    console.error('Get users list error:', error)
    console.error('Error stack:', error.stack)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 获取所有用户列表（admin或root权限）
admin.get('/users', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    // 从 AdminDO 读取用户列表
    const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
    const adminStub = c.env.ADMIN_DO.get(adminId)
    const doResponse = await adminStub.fetch('http://internal/users')

    if (!doResponse.ok) {
      console.error('Failed to fetch users from AdminDO')
      return c.json({ error: 'Failed to fetch users' }, 500)
    }

    const { users: allUsers } = await doResponse.json() as { users: Array<{username: string, type: string}> }
    const users = allUsers.filter(u => u.username !== c.env.ROOT_USERNAME)
    return c.json({ users })
  } catch (error: any) {
    console.error('Get users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 创建用户（admin权限）
admin.post('/users', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    console.log('Create user endpoint called')
    // 从 context 中读取已解析的请求体
    const body = c.var.requestBody as { username: string, token: string, newUsername: string, password: string, type: string }
    console.log('Request body:', body)
    const { newUsername, password, type } = body

    // 检查是否为root用户
    if (type === 'root') {
      console.log('Cannot create root user')
      return c.json({ error: 'Cannot create root user' }, 403)
    }

    console.log('Adding user:', newUsername, 'type:', type)

    // 生成token并哈希密码
    const token = crypto.randomUUID()
    const hashedPassword = await hashPassword(password)

    // 1. 先将用户信息存储到 UserDO
    try {
      const userId = c.env.USER_DO.idFromName(newUsername)
      const userStub = c.env.USER_DO.get(userId)
      const userResponse = await userStub.fetch('http://do/store', {
        method: 'POST',
        body: JSON.stringify({ username: newUsername, password: hashedPassword, type, token }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!userResponse.ok) {
        console.error('Failed to create user in UserDO')
        return c.json({ error: 'Failed to create user account' }, 500)
      }
    } catch (userError: any) {
      console.error('UserDO error:', userError)
      return c.json({ error: 'Failed to create user account' }, 500)
    }

    // 2. 同步到 AdminDO 持久化存储
    try {
      const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
      const adminStub = c.env.ADMIN_DO.get(adminId)
      const doResponse = await adminStub.fetch('http://internal/add-user', {
        method: 'POST',
        body: JSON.stringify({ username: newUsername, type }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!doResponse.ok) {
        const errorData = await doResponse.json() as { error?: string }
        console.error('Failed to sync user to AdminDO:', errorData)

        // 如果用户已存在，返回409
        if (doResponse.status === 409) {
          // 回滚：删除 UserDO
          const userId = c.env.USER_DO.idFromName(newUsername)
          const userStub = c.env.USER_DO.get(userId)
          await userStub.fetch('http://do/delate', { method: 'POST' })
          return c.json({ error: 'User already exists' }, 409)
        }

        // 其他错误，回滚 UserDO
        const userId = c.env.USER_DO.idFromName(newUsername)
        const userStub = c.env.USER_DO.get(userId)
        await userStub.fetch('http://do/delate', { method: 'POST' })
        return c.json({ error: 'Failed to persist user' }, 500)
      }
    } catch (doError: any) {
      console.error('AdminDO sync error:', doError)
      // 回滚：删除 UserDO
      const userId = c.env.USER_DO.idFromName(newUsername)
      const userStub = c.env.USER_DO.get(userId)
      await userStub.fetch('http://do/delate', { method: 'POST' })
      return c.json({ error: 'Failed to persist user' }, 500)
    }

    console.log('User created successfully:', newUsername)
    return c.json({ message: 'User created', token })
  } catch (error: any) {
    console.error('Create user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 获取系统设置
admin.post('/settings', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
    const adminStub = c.env.ADMIN_DO.get(adminId)
    const doResponse = await adminStub.fetch('http://internal/settings')
    const settings = await doResponse.json()
    return c.json(settings)
  } catch (error: any) {
    console.error('Get settings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 更新系统设置
admin.post('/settings/update', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    const body = c.var.requestBody
    // 移除 body 中的验证字段，只保留设置字段
    const { username, token, ...settings } = body
    
    const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
    const adminStub = c.env.ADMIN_DO.get(adminId)
    const doResponse = await adminStub.fetch('http://internal/update-settings', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!doResponse.ok) {
      return c.json({ error: 'Failed to update settings' }, 500)
    }
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// 删除用户（admin权限）
admin.delete('/users/:username', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  try {
    const targetUsername = c.req.param('username')
    const currentUser = c.var.user!

    // 不能删除自己或root用户
    if (targetUsername === currentUser.username) {
      return c.json({ error: 'Cannot delete yourself' }, 403)
    }
    if (targetUsername === c.env.ROOT_USERNAME) {
      return c.json({ error: 'Cannot delete root user' }, 403)
    }

    // 1. 删除 UserDO 中的用户数据
    try {
      const userId = c.env.USER_DO.idFromName(targetUsername)
      const userStub = c.env.USER_DO.get(userId)
      const userResponse = await userStub.fetch('http://do/delate', { method: 'POST' })

      if (!userResponse.ok) {
        console.error('Failed to delete user from UserDO')
        return c.json({ error: 'Failed to delete user account' }, 500)
      }
    } catch (userError: any) {
      console.error('UserDO deletion error:', userError)
      return c.json({ error: 'Failed to delete user account' }, 500)
    }

    // 2. 从 AdminDO 持久化存储中删除
    try {
      const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
      const adminStub = c.env.ADMIN_DO.get(adminId)
      const doResponse = await adminStub.fetch('http://internal/remove-user', {
        method: 'POST',
        body: JSON.stringify({ username: targetUsername }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!doResponse.ok) {
        console.error('Failed to sync user deletion to AdminDO')
        return c.json({ error: 'Failed to persist user deletion' }, 500)
      }
    } catch (doError: any) {
      console.error('AdminDO sync error:', doError)
      return c.json({ error: 'Failed to persist user deletion' }, 500)
    }

    return c.json({ message: 'User deleted' })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})