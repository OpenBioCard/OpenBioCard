import { DurableObject } from 'cloudflare:workers'

export class AdminDO extends DurableObject {
  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env)
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    if (request.method === 'GET' && url.pathname === '/users') {
      const users = (await this.ctx.storage.get('users')) as Array<{username: string, type: string}> || []
      return new Response(JSON.stringify({ users }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/add-user') {
      const { username, type }: { username: string, type: string } = await request.json()
      const users = (await this.ctx.storage.get('users')) as Array<{username: string, type: string}> || []

      // 检查用户是否已存在
      if (users.some(u => u.username === username)) {
        return new Response(JSON.stringify({ error: 'User already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      users.push({ username, type })
      await this.ctx.storage.put('users', users)

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/remove-user') {
      const { username }: { username: string } = await request.json()
      const users = (await this.ctx.storage.get('users')) as Array<{username: string, type: string}> || []
      const filteredUsers = users.filter(u => u.username !== username)
      await this.ctx.storage.put('users', filteredUsers)

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/init-admin') {
      const users = (await this.ctx.storage.get('users')) as Array<{username: string, type: string}> || []
      if (users.length === 0) {
        users.push({ username: 'admin', type: 'admin' })
        await this.ctx.storage.put('users', users)
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/set-root-token') {
      const { token }: { token: string } = await request.json()
      await this.ctx.storage.put('root_token', token)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/verify-root-token') {
      const { token }: { token: string } = await request.json()
      const storedToken = await this.ctx.storage.get('root_token')
      return new Response(JSON.stringify({ valid: storedToken === token }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/settings') {
      const settings = (await this.ctx.storage.get('settings')) as { title: string, logo: string } || { title: 'OpenBioCard', logo: '' }
      return new Response(JSON.stringify(settings), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/update-settings') {
      const newSettings = await request.json() as Record<string, any>
      const existingSettings = (await this.ctx.storage.get('settings')) as Record<string, any> || { title: 'OpenBioCard', logo: '' }
      const updatedSettings = { ...existingSettings, ...newSettings }
      await this.ctx.storage.put('settings', updatedSettings)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not found', { status: 404 })
  }
}
