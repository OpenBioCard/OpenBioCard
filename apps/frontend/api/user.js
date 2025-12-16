// API服务层 - 用户资料相关
const API_BASE = '/api/'

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
      try {
        const error = await response.json()
        throw new Error(error.error || 'Update failed')
      } catch (parseError) {
        // 如果响应不是有效的 JSON，使用状态码和状态文本
        throw new Error(`Update failed: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  }
}