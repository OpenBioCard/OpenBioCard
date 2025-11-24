import { CreateAccount } from '../types/siginup'

export class AdminDO {
  state: DurableObjectState

  constructor(state: DurableObjectState) {
    this.state = state
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname === '/users') {
      const users = (await this.state.storage.get('users')) as Array<{username: string, type: string}> || []
      return new Response(JSON.stringify({ users }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/add-user') {
      const { username, type }: { username: string, type: string } = await request.json()
      const users = (await this.state.storage.get('users')) as Array<{username: string, type: string}> || []

      // 检查用户是否已存在
      if (users.some(u => u.username === username)) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      users.push({ username, type })
      await this.state.storage.put('users', users)
      console.log('User added to DO:', username, 'Total users in DO:', users.length)

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/remove-user') {
      const { username }: { username: string } = await request.json()
      const users = (await this.state.storage.get('users')) as Array<{username: string, type: string}> || []
      const filteredUsers = users.filter(u => u.username !== username)
      await this.state.storage.put('users', filteredUsers)
      console.log('User removed from DO:', username, 'Remaining users in DO:', filteredUsers.length)

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/init-admin') {
      const users = (await this.state.storage.get('users')) as Array<{username: string, type: string}> || []
      if (users.length === 0) {
        users.push({ username: 'admin', type: 'admin' })
        await this.state.storage.put('users', users)
        console.log('Initialized admin user in DO')
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not found', { status: 404 })
  }
}