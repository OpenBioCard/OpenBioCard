<template>
  <div style="min-height: 100vh; background: var(--gradient-bg);">
    <!-- 导航栏 -->
    <nav style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: var(--shadow-sm); border-bottom: 1px solid var(--color-border-tertiary); position: sticky; top: 0; z-index: 50;">
      <div style="max-width: 1152px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2rem; height: 2rem; background: var(--color-bg-primary); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border-primary);">
              <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="50" width="150" height="100" rx="15" ry="15" fill="var(--color-bg-primary)" stroke="var(--color-primary)" stroke-width="4"/>
                <circle cx="50" cy="90" r="15" fill="none" stroke="var(--color-primary)" stroke-width="3"/>
                <line x1="50" y1="105" x2="50" y2="120" stroke="var(--color-primary)" stroke-width="2"/>
                <text x="70" y="85" font-family="monospace" font-size="8" fill="var(--color-primary)">console.log("Open")</text>
                <line x1="70" y1="95" x2="150" y2="95" stroke="var(--color-primary)" stroke-width="1.5"/>
                <line x1="70" y1="110" x2="130" y2="110" stroke="var(--color-primary)" stroke-width="1.5"/>
                <line x1="35" y1="145" x2="165" y2="145" stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="4,4"/>
              </svg>
            </div>
            <h1 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary); margin: 0;">
              OpenBioCard <span style="font-size: 0.875rem; font-weight: normal; color: var(--color-text-tertiary);">管理面板</span>
            </h1>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 0.875rem; color: var(--color-text-tertiary); font-weight: 500;">
              {{ user.username }} <span style="color: var(--color-text-tertiary);">({{ user.type === 'root' ? 'ROOT' : '管理员' }})</span>
            </span>
            <!-- 主题切换按钮 -->
            <button
              @click="toggleTheme"
              style="font-size: 0.875rem; padding: 0.5rem; color: var(--color-text-tertiary); border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;"
              onmouseover="this.style.backgroundColor='var(--color-bg-hover)'; this.style.color='var(--color-text-primary)'"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--color-text-tertiary)'"
              title="切换主题"
            >
              <!-- 太阳图标 (浅色模式) -->
              <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <!-- 月亮图标 (深色模式) -->
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <button
              @click="logout"
              style="font-size: 0.875rem; padding: 0.375rem 0.75rem; color: var(--color-text-tertiary); border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent; cursor: pointer;"
              onmouseover="this.style.backgroundColor='var(--color-bg-hover)'; this.style.color='var(--color-text-primary)'"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--color-text-tertiary)'"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容 -->
    <main style="max-width: 1152px; margin: 0 auto; padding: 2rem 1rem;">
      <!-- 用户统计 -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 2rem; font-weight: bold; color: var(--color-text-primary); margin: 0 0 0.5rem;">用户管理</h2>
          <p style="color: var(--color-text-tertiary); margin: 0;">管理系统用户和权限</p>
        </div>
        <div style="padding: 0.75rem 1.5rem; background: rgba(0, 0, 0, 0.05); border-radius: 0.5rem; font-weight: 600; color: var(--color-text-primary);">
          <svg style="width: 1.25rem; height: 1.25rem; display: inline-block; vertical-align: middle; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"></path>
          </svg>
          {{ users.length }} 位用户
        </div>
      </div>

      <!-- 创建用户表单 -->
      <div style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); padding: 2rem; margin-bottom: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary); margin: 0 0 1.5rem; display: flex; align-items: center;">
          <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"></path>
          </svg>
          创建新用户
        </h3>

        <form @submit.prevent="createUser" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div>
              <label for="username" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                用户名
              </label>
              <input
                id="username"
                v-model="newUser.username"
                type="text"
                placeholder="输入用户名"
                required
                style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.5rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; box-sizing: border-box; background: var(--color-bg-primary); color: var(--color-text-primary);"
                onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
                onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
              />
            </div>

            <div>
              <label for="password" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                密码
              </label>
              <input
                id="password"
                v-model="newUser.password"
                type="password"
                placeholder="输入密码"
                required
                style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.5rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; box-sizing: border-box; background: var(--color-bg-primary); color: var(--color-text-primary);"
                onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
                onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
              />
            </div>

            <div>
              <label for="type" style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                用户类型
              </label>
              <select
                id="type"
                v-model="newUser.type"
                style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.5rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; box-sizing: border-box; background: var(--color-bg-primary); color: var(--color-text-primary); cursor: pointer;"
                onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
                onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            :disabled="creating"
            style="width: 100%; padding: 0.875rem; background: var(--color-primary); color: var(--color-text-inverse); border: none; border-radius: 0.5rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; min-height: 3rem;"
            :style="{ opacity: creating ? 0.7 : 1 }"
            onmouseover="if(!this.disabled) this.style.backgroundColor='var(--color-primary-hover)'"
            onmouseout="this.style.backgroundColor='var(--color-primary)'"
          >
            <svg v-if="!creating" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5V19M5 12H19"></path>
            </svg>
            <span v-if="!creating">创建用户</span>
            <div v-else style="width: 1.25rem; height: 1.25rem; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
          </button>
        </form>
      </div>

      <!-- 用户列表 -->
      <div style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); padding: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary); margin: 0 0 1.5rem; display: flex; align-items: center;">
          <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"></path>
          </svg>
          所有用户
        </h3>

        <!-- 空状态 -->
        <div v-if="users.length === 0" style="text-align: center; padding: 4rem 2rem; color: var(--color-text-tertiary);">
          <div style="width: 4rem; height: 4rem; background: var(--color-bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
            <svg style="width: 2rem; height: 2rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
            </svg>
          </div>
          <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--color-text-tertiary); margin: 0 0 0.5rem;">暂无用户</h4>
          <p style="margin: 0; font-size: 0.875rem;">创建第一个用户开始使用系统</p>
        </div>

        <!-- 用户网格 -->
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          <div
            v-for="u in users"
            :key="u.username"
            style="background: rgba(255, 255, 255, 0.5); border: 1px solid var(--color-border-tertiary); border-radius: 0.75rem; padding: 1.5rem; transition: all 0.2s;"
            onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0, 0, 0, 0.1)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
          >
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 3.5rem; height: 3.5rem; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-text-inverse); font-weight: bold; font-size: 1.5rem; flex-shrink: 0;">
                {{ u.username.charAt(0).toUpperCase() }}
              </div>
              <div style="flex: 1; min-width: 0;">
                <h4 style="font-size: 1.125rem; font-weight: bold; color: var(--color-text-primary); margin: 0 0 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ u.username }}
                </h4>
                <span
                  style="display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600;"
                  :style="{
                    background: u.type === 'root' ? 'var(--color-warning)' : u.type === 'admin' ? 'var(--color-primary)' : 'var(--color-border-primary)',
                    color: u.type === 'root' ? 'var(--color-text-inverse)' : u.type === 'admin' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'
                  }"
                >
                  <svg style="width: 0.875rem; height: 0.875rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="u.type === 'root'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"></path>
                    <path v-else-if="u.type === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16V12M12 8H12.01"></path>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
                  </svg>
                  {{ u.type === 'root' ? 'ROOT' : u.type === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <button
              v-if="u.username !== user.username && u.type !== 'root'"
              @click="deleteUser(u.username)"
              style="width: 100%; padding: 0.625rem; background: var(--color-bg-primary); border: 1px solid var(--color-danger-light); border-radius: 0.5rem; color: var(--color-danger); font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
              onmouseover="this.style.backgroundColor='var(--color-danger-bg)'; this.style.borderColor='var(--color-danger)'"
              onmouseout="this.style.backgroundColor='var(--color-bg-primary)'; this.style.borderColor='var(--color-danger-light)'"
            >
              <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"></path>
              </svg>
              删除用户
            </button>
            <div
              v-else
              style="width: 100%; padding: 0.75rem; background: var(--color-success-bg); border: 1px solid var(--color-success-light); border-radius: 0.5rem; color: var(--color-success); font-weight: 600; font-size: 0.875rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
            >
              <svg style="width: 1.125rem; height: 1.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM9 12L11 14L15 10"></path>
              </svg>
              {{ u.username === user.username ? '当前用户' : '系统管理员' }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  user: Object,
  token: String
})

const emit = defineEmits(['logout'])

const { isDark, toggleTheme } = useTheme()

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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
