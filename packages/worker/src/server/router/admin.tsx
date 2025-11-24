import { Hono } from 'hono'
import { authMiddleware, requirePermission, AuthVariables } from '../middleware/auth'
import { CreateAccount } from '../types/siginup'
import { hashPassword } from '../utils/password'

// 使用持久化存储的用户列表
class UserStore {
  private static instance: UserStore
  private users: Array<{username: string, type: string}> = []

  private constructor() {
    this.initialize()
  }

  static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore()
    }
    return UserStore.instance
  }

  private initialize() {
    // 初始化默认用户
    if (this.users.length === 0) {
      this.users.push({ username: 'admin', type: 'admin' })
      console.log('Initialized default admin user')
    }
  }

  getUsers(): Array<{username: string, type: string}> {
    return [...this.users]
  }

  addUser(username: string, type: string): boolean {
    if (this.users.some(u => u.username === username)) {
      return false // 用户已存在
    }
    this.users.push({ username, type })
    console.log('User added:', username, 'Total users:', this.users.length)
    return true
  }

  removeUser(username: string): boolean {
    const initialLength = this.users.length
    this.users = this.users.filter(u => u.username !== username)
    const removed = initialLength > this.users.length
    if (removed) {
      console.log('User removed:', username, 'Remaining users:', this.users.length)
    }
    return removed
  }
}

const userStore = UserStore.getInstance()

export const admin = new Hono<{ Bindings: CloudflareBindings & { ADMIN_DO: DurableObjectNamespace }, Variables: AuthVariables }>()

// 检查权限（用于前端权限验证）
admin.post('/check-permission', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
  // 权限检查由中间件完成，这里只需返回成功
  return c.json({ success: true, type: c.var.user?.type })
})

// 获取用户列表（POST方式，用于前端）
admin.post('/users/list', authMiddleware, requirePermission(['admin', 'root']), async (c) => {
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
    console.log('Users from AdminDO:', allUsers.length, 'users:', allUsers.map(u => u.username))

    // 过滤掉root用户
    const users = allUsers.filter(u => u.username !== c.env.ROOT_USERNAME)
    console.log('Returning users list:', users.length, 'users:', users.map(u => u.username))
    return c.json({ users })
  } catch (error: any) {
    console.error('Get users list error:', error)
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

    // 2. 添加到内存中的 UserStore
    const success = userStore.addUser(newUsername, type)
    if (!success) {
      console.log('User already exists in store:', newUsername)
      // 用户已存在，需要清理 UserDO
      try {
        const userId = c.env.USER_DO.idFromName(newUsername)
        const userStub = c.env.USER_DO.get(userId)
        await userStub.fetch('http://do/delate', { method: 'POST' })
      } catch (cleanupError) {
        console.error('Failed to cleanup UserDO:', cleanupError)
      }
      return c.json({ error: 'User already exists' }, 409)
    }

    // 3. 同步到 AdminDO 持久化存储
    try {
      const adminId = c.env.ADMIN_DO.idFromName('admin-manager')
      const adminStub = c.env.ADMIN_DO.get(adminId)
      const doResponse = await adminStub.fetch('http://internal/add-user', {
        method: 'POST',
        body: JSON.stringify({ username: newUsername, type }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!doResponse.ok) {
        console.error('Failed to sync user to AdminDO')
        // 回滚：删除 UserDO 和内存中的用户
        userStore.removeUser(newUsername)
        const userId = c.env.USER_DO.idFromName(newUsername)
        const userStub = c.env.USER_DO.get(userId)
        await userStub.fetch('http://do/delate', { method: 'POST' })
        return c.json({ error: 'Failed to persist user' }, 500)
      }
    } catch (doError: any) {
      console.error('AdminDO sync error:', doError)
      // 回滚：删除 UserDO 和内存中的用户
      userStore.removeUser(newUsername)
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

    // 2. 从内存中的 UserStore 删除用户
    const success = userStore.removeUser(targetUsername)
    if (!success) {
      console.log('User not found in store:', targetUsername)
      // 即使内存中没有，继续删除 AdminDO 中的记录
    }

    // 3. 从 AdminDO 持久化存储中删除
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