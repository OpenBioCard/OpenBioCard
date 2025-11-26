// API服务层 - 管理员相关
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

export const adminAPI = {
  // 获取用户列表
  async getUsers(token, username) {
    const response = await fetch(`${API_BASE}admin/users/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, token })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch users')
    }

    return await response.json()
  },

  // 创建用户
  async createUser(userData, token, username) {
    const response = await fetch(`${API_BASE}admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        token,
        newUsername: userData.username,
        password: userData.password,
        type: userData.type
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create user')
    }

    return await response.json()
  },

  // 删除用户
  async deleteUser(targetUsername, token, username) {
    const response = await fetch(`${API_BASE}admin/users/${targetUsername}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, token })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete user')
    }

    return await response.json()
  }
}