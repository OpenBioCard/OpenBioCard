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

    return new Response('Not found', { status: 404 })
  }
}