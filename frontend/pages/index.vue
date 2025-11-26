<template>
  <div class="min-h-screen">
    <Login v-if="currentView === 'login'" @login="login" />
    <AdminPanel v-else-if="currentView === 'admin'" :user="user" :token="token" @logout="logout" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Login from '../components/Login.vue'
import AdminPanel from '../components/AdminPanel.vue'
import { authAPI } from '../api/index.js'

const { t } = useI18n()

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
      const hasPermission = await authAPI.checkPermission(savedToken, savedUsername)
      if (hasPermission) {
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
    const data = await authAPI.login({ username, password })
    if (data.token) {
      token.value = data.token
      user.value = { username, token: data.token, type: 'user' } // 默认类型

      // 保存到cookies
      setCookie('auth_token', data.token)
      setCookie('auth_username', username)

      // 尝试访问管理接口来检查权限
      const hasPermission = await authAPI.checkPermission(data.token, username)
      if (hasPermission) {
        user.value.type = 'admin'
        currentView.value = 'admin'
      } else {
        // 普通用户，跳转到个人页面
        window.location.href = `/${username}`
      }
    } else {
      alert(t('auth.loginFailed'))
    }
  } catch (error) {
    alert(t('auth.loginError'))
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