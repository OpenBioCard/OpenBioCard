import { CreateAccount } from '../types/siginup'
import { DurableObject } from 'cloudflare:workers'

interface Profile {
  name?: string
  userType?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  contacts?: any[]
  socialLinks?: any[]
  projects?: any[]
  gallery?: any[]
  currentCompany?: string
  currentCompanyLink?: string
  currentSchool?: string
  currentSchoolLink?: string
  workExperiences?: any[]
  schoolExperiences?: any[]
  locales?: { [key: string]: Partial<Profile> }
  [key: string]: any
}

export class UserDO extends DurableObject {
  constructor(state: DurableObjectState, env: CloudflareBindings) {
    super(state, env)
  }

  async fetch(request: Request) {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/store') {
      const data: CreateAccount = await request.json()
      await this.ctx.storage.put('user', data)

      // 注册到AdminDO（如果不是root用户）
      if (data.type !== 'root') {
        try {
          // 这里需要AdminDO的引用，暂时简化
          // 实际应该通过环境变量传递AdminDO
        } catch {
          // 忽略错误
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/get') {
      const data = await this.ctx.storage.get('user')
      return new Response(JSON.stringify(data || null), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/verify-token') {
      const { token }: { token: string } = await request.json()
      const data = await this.ctx.storage.get('user') as CreateAccount | undefined
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
      // 删除账号时同时删除所有相关资料
      await this.ctx.storage.delete('user')
      await this.ctx.storage.delete('profile')
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/get-profile') {
      const data = await this.ctx.storage.get('user') as CreateAccount | undefined
      if (data) {
        const profile = (await this.ctx.storage.get('profile') || {}) as Profile
        return new Response(JSON.stringify({
          username: data.username,
          name: '',
          userType: profile.userType || '',
          avatar: '',
          bio: '',
          location: '',
          website: '',
          contacts: [],
          socialLinks: [],
          projects: [],
          gallery: [],
          currentCompany: profile.currentCompany || '',
          currentCompanyLink: profile.currentCompanyLink || '',
          currentSchool: profile.currentSchool || '',
          currentSchoolLink: profile.currentSchoolLink || '',
          workExperiences: profile.workExperiences || [],
          schoolExperiences: profile.schoolExperiences || [],
          ...profile
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    if (request.method === 'POST' && url.pathname === '/update-profile') {
      const profileData = await request.json() as Record<string, any>
      const existingProfile = (await this.ctx.storage.get('profile') || {}) as Profile
      const updatedProfile = { ...existingProfile, ...profileData }
      await this.ctx.storage.put('profile', updatedProfile)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'GET' && url.pathname === '/export') {
      const user = await this.ctx.storage.get('user')
      const profile = await this.ctx.storage.get('profile')
      return new Response(JSON.stringify({ user, profile }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST' && url.pathname === '/import') {
      const { user, profile } = await request.json() as { user: any, profile: any }
      if (user) await this.ctx.storage.put('user', user)
      if (profile) await this.ctx.storage.put('profile', profile)
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
