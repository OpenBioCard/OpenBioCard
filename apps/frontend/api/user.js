// API服务层 - 用户资料相关
import { API_BASE } from './api.js'

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
  },

  // 导出账户数据
  async exportData(username, token) {
    const response = await fetch(`${API_BASE}user/${username}/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    return await response.json()
  },

  // 导入账户数据
  async importData(username, data, token) {
    const response = await fetch(`${API_BASE}user/${username}/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Import failed')
    }

    return await response.json()
  },

  // 获取系统公开设置
  async getSettings() {
    const response = await fetch(`${API_BASE}settings`)
    if (!response.ok) {
      return { title: 'OpenBioCard', logo: '' }
    }
    return await response.json()
  }
}