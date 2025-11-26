// API服务层 - 用户资料相关
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

export const userAPI = {
  // 获取用户资料
  async getProfile(username) {
    const response = await fetch(`${API_BASE}user/${username}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found')
      }
      throw new Error('Failed to fetch user profile')
    }

    return await response.json()
  },

  // 更新用户资料
  async updateProfile(username, profileData, token) {
    const response = await fetch(`${API_BASE}user/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Update failed')
    }

    return await response.json()
  }
}