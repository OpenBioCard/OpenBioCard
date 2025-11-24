<script setup>
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import AdminPanel from './components/AdminPanel.vue'

const currentView = ref('login')
const user = ref(null)
const token = ref('')

// 从cookies获取token
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// 设置cookies
const setCookie = (name, value, days = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// 删除cookies
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// 检查是否已登录
const checkLogin = async () => {
  const savedToken = getCookie('auth_token')
  const savedUsername = getCookie('auth_username')

  if (savedToken && savedUsername) {
    token.value = savedToken
    user.value = { username: savedUsername, token: savedToken, type: 'user' }

    // 验证token是否仍然有效
    try {
      const adminResponse = await fetch('/admin/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: savedUsername, token: savedToken })
      })
      if (adminResponse.ok) {
        user.value.type = 'admin'
        currentView.value = 'admin'
      } else {
        // token无效，清除cookies
        deleteCookie('auth_token')
        deleteCookie('auth_username')
        user.value = null
        token.value = ''
      }
    } catch (error) {
      // 网络错误，保持当前状态
    }
  }
}

const login = async (username, password) => {
  try {
    const response = await fetch('/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token: '' })
    })
    const data = await response.json()
    if (data.token) {
      token.value = data.token
      user.value = { username, token: data.token, type: 'user' } // 默认类型

      // 保存到cookies
      setCookie('auth_token', data.token)
      setCookie('auth_username', username)

      // 尝试访问管理接口来检查权限
      const adminResponse = await fetch('/admin/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, token: data.token })
      })
      if (adminResponse.ok) {
        user.value.type = 'admin'
        currentView.value = 'admin'
      } else {
        alert('您没有管理员权限')
      }
    } else {
      alert('登录失败')
    }
  } catch (error) {
    alert('登录错误')
  }
}

const logout = () => {
  // 清除cookies
  deleteCookie('auth_token')
  deleteCookie('auth_username')

  user.value = null
  token.value = ''
  currentView.value = 'login'
}

onMounted(() => {
  checkLogin()
})
</script>

<template>
  <div class="min-h-screen">
    <Login v-if="currentView === 'login'" @login="login" />
    <AdminPanel v-else-if="currentView === 'admin'" :user="user" :token="token" @logout="logout" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
