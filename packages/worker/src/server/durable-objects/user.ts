import { CreateAccount } from '../types/siginup'

export class UserDO {
  state: DurableObjectState

  constructor(state: DurableObjectState) {
    this.state = state
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/store') {
      const data: CreateAccount = await request.json()
      await this.state.storage.put('user', data)

      // 注册到AdminDO（如果不是root用户）
      if (data.type !== 'root') {
        try {
          // 这里需要AdminDO的引用，暂时简化
          // 实际应该通过环境变量传递AdminDO
        } catch (e) {
          // 忽略错误
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/get') {
      const data = await this.state.storage.get('user')
      return new Response(JSON.stringify(data || null), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/verify-token') {
      const { token }: { token: string } = await request.json()
      const data = await this.state.storage.get('user') as CreateAccount | undefined
      if (data && data.token === token) {
        return new Response(JSON.stringify({ valid: true, type: data.type, username: data.username }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        return new Response(JSON.stringify({ valid: false }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    if (request.method === 'POST' && url.pathname === '/delate') {
      await this.state.storage.delete('user')
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/get-users') {
      // 特殊端点：如果这是admin-manager实例，返回所有用户
      const url = new URL(request.url)
      if (url.hostname.includes('admin-manager')) {
        // 这里简化实现，实际应该从AdminDO获取
        // 暂时返回示例数据
        const users = [
          { username: 'admin', type: 'admin' },
          { username: 'user1', type: 'user' }
        ]
        return new Response(JSON.stringify({ users }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({ users: [] }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not found', { status: 404 })
  }
}