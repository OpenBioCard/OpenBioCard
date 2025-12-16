// API服务层 - 认证相关
const API_BASE = '/api/'

export const authAPI = {
  // 用户登录
  async login(credentials) {
    const response = await fetch(`${API_BASE}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      } catch (parseError) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  },

  // 检查管理员权限
  async checkPermission(token, username) {
    const response = await fetch(`${API_BASE}admin/check-permission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, token })
    })

    if (!response.ok) {
      return false
    }

    try {
      const data = await response.json()
      return data.success
    } catch (parseError) {
      console.error('Failed to parse permission response:', parseError)
      return false
    }
  }
}