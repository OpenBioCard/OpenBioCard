// API服务层 - 管理员相关
const API_BASE = '/api/'

export const adminAPI = {
  // 获取用户列表
  async getUsers(token, username) {
    const response = await fetch(`${API_BASE}admin/users/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, token })
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch users')
      } catch (parseError) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  },

  // 创建用户
  async createUser(userData, token, username) {
    const response = await fetch(`${API_BASE}admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      try {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      } catch (parseError) {
        throw new Error(`Failed to create user: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  },

  // 删除用户
  async deleteUser(targetUsername, token, username) {
    const response = await fetch(`${API_BASE}admin/users/${targetUsername}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, token })
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      } catch (parseError) {
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  }
}