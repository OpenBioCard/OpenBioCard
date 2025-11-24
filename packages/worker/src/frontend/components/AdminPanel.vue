<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="header-title">
            <h1>OpenBioCard</h1>
            <p>管理面板</p>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ user.username }}</span>
            <span class="user-badge">{{ user.type === 'root' ? 'ROOT' : '管理员' }}</span>
          </div>
          <button @click="logout" class="logout-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="admin-main">
      <div class="main-content">
        <!-- 创建用户卡片 -->
        <div class="card create-user-card">
          <div class="card-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              创建新用户
            </h2>
          </div>
          <form @submit.prevent="createUser" class="user-form">
            <div class="form-row">
              <div class="form-group">
                <label for="new-username">用户名</label>
                <input
                  id="new-username"
                  v-model="newUser.username"
                  type="text"
                  placeholder="请输入用户名"
                  required
                />
              </div>
              <div class="form-group">
                <label for="new-password">密码</label>
                <input
                  id="new-password"
                  v-model="newUser.password"
                  type="password"
                  placeholder="请输入密码"
                  required
                />
              </div>
              <div class="form-group">
                <label for="new-type">类型</label>
                <select id="new-type" v-model="newUser.type">
                  <option value="user">用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>
            <button type="submit" class="submit-button" :disabled="creating">
              <svg v-if="!creating" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-if="!creating">创建用户</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
        </div>

        <!-- 用户列表卡片 -->
        <div class="card users-list-card">
          <div class="card-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              用户列表
              <span class="user-count">{{ users.length }}</span>
            </h2>
          </div>

          <div v-if="users.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>暂无用户</p>
            <span>创建第一个用户开始使用</span>
          </div>

          <div v-else class="users-grid">
            <div v-for="u in users" :key="u.username" class="user-card">
              <div class="user-card-avatar">
                {{ u.username.charAt(0).toUpperCase() }}
              </div>
              <div class="user-card-info">
                <h3>{{ u.username }}</h3>
                <span class="user-card-type" :class="`type-${u.type}`">
                  {{ u.type === 'admin' ? '管理员' : '用户' }}
                </span>
              </div>
              <button
                v-if="u.username !== user.username && u.type !== 'root'"
                @click="deleteUser(u.username)"
                class="delete-button"
                title="删除用户"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: Object,
  token: String
})

const emit = defineEmits(['logout'])

const users = ref([])
const newUser = ref({
  username: '',
  password: '',
  type: 'user'
})
const creating = ref(false)

const fetchUsers = async () => {
  if (!props.user || !props.token) {
    console.error('User or token not available')
    return
  }

  try {
    console.log('Fetching users for:', props.user.username)
    const response = await fetch('/admin/users/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: props.user.username, token: props.token })
    })
    if (response.ok) {
      const data = await response.json()
      console.log('Received users:', data.users)
      users.value = data.users || []
    } else {
      console.error('获取用户列表失败:', response.status, await response.text())
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const createUser = async () => {
  if (!props.user || !props.token) {
    alert('用户信息不完整')
    return
  }

  creating.value = true
  try {
    console.log('Creating user:', newUser.value.username)
    const response = await fetch('/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: props.user.username,
        token: props.token,
        newUsername: newUser.value.username,
        password: newUser.value.password,
        type: newUser.value.type
      })
    })
    if (response.ok) {
      alert('用户创建成功')
      newUser.value = { username: '', password: '', type: 'user' }
      console.log('Refreshing user list after creation')
      await fetchUsers()
    } else {
      const errorData = await response.json()
      alert(`创建用户失败: ${errorData.error || '未知错误'}`)
    }
  } catch (error) {
    console.error('Create user error:', error)
    alert('创建用户错误')
  } finally {
    creating.value = false
  }
}

const deleteUser = async (username) => {
  if (!props.user || !props.token) {
    alert('用户信息不完整')
    return
  }

  if (!confirm(`确定要删除用户 ${username} 吗？`)) return

  try {
    console.log('Deleting user:', username)
    const response = await fetch(`/admin/users/${username}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: props.user.username, token: props.token })
    })
    if (response.ok) {
      alert('用户删除成功')
      console.log('Refreshing user list after deletion')
      await fetchUsers()
    } else {
      const errorData = await response.json()
      alert(`删除用户失败: ${errorData.error || '未知错误'}`)
    }
  } catch (error) {
    console.error('Delete user error:', error)
    alert('删除用户错误')
  }
}

const logout = () => {
  emit('logout')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.admin-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo svg {
  width: 28px;
  height: 28px;
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.header-title p {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
}

.user-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #e53e3e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #fff5f5;
  border-color: #e53e3e;
}

.logout-button svg {
  width: 18px;
  height: 18px;
}

.admin-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.card-header h2 svg {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.user-count {
  margin-left: auto;
  padding: 4px 12px;
  background: #edf2f7;
  border-radius: 12px;
  font-size: 14px;
  color: #4a5568;
}

.user-form {
  padding: 32px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button svg {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 80px 32px;
  text-align: center;
  color: #a0aec0;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.empty-state span {
  font-size: 14px;
}

.users-grid {
  padding: 24px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  padding: 20px;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.user-card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.user-card-info {
  flex: 1;
  min-width: 0;
}

.user-card-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card-type {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.type-admin {
  background: #bee3f8;
  color: #2c5282;
}

.type-user {
  background: #c6f6d5;
  color: #22543d;
}

.delete-button {
  width: 36px;
  height: 36px;
  background: #fff;
  border: 2px solid #feb2b2;
  border-radius: 8px;
  color: #e53e3e;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.delete-button:hover {
  background: #fff5f5;
  border-color: #e53e3e;
}

.delete-button svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }

  .admin-main {
    padding: 20px 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
