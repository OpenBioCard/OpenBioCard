<template>
  <div class="min-h-screen">
    <Login v-if="currentView === 'login'" :title="settings.title" :logo="settings.logo" @login="login" />
    <AdminPanel v-else-if="currentView === 'admin'" :user="user" :token="token" @logout="logout" />

    <!-- 通知弹窗 -->
    <NotificationModal
      :show="notificationModal.show"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :message="notificationModal.message"
      :details="notificationModal.details"
      @close="closeNotificationModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import Login from '../components/Login.vue'
import AdminPanel from '../components/AdminPanel.vue'
import NotificationModal from '../components/NotificationModal.vue'
import { authAPI, userAPI } from '../api/index.js'

const { t } = useI18n()

const currentView = ref('login')
const user = ref(null)
const token = ref('')
const settings = ref({ title: 'OpenBioCard', logo: '' })

// 同步网站标题和 Logo 到 head
useHead({
  title: computed(() => settings.value.title)
})

// 监听 logo 变化并更新 favicon
watch(() => settings.value.logo, (newLogo) => {
  if (typeof document !== 'undefined') {
    const svgIcon = document.getElementById('favicon-svg')
    const icoIcon = document.getElementById('favicon-ico')
    if (newLogo) {
      if (svgIcon) svgIcon.href = newLogo
      if (icoIcon) icoIcon.href = newLogo
    }
  }
}, { immediate: true })

// 通知弹窗状态
const notificationModal = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  details: ''
})

// 获取系统设置
const fetchSettings = async () => {
  try {
    const data = await userAPI.getSettings()
    settings.value = data
  } catch (error) {
    console.error('获取系统设置失败:', error)
  }
}

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
      const { authorized, isAdmin } = await authAPI.checkPermission(savedToken, savedUsername)
      if (authorized) {
        if (isAdmin) {
          user.value.type = 'admin'
          currentView.value = 'admin'
        } else {
          // 普通用户，跳转到个人页面
          window.location.href = `/${savedUsername}`
        }
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
      const { authorized, isAdmin } = await authAPI.checkPermission(data.token, username)
      if (authorized) {
        if (isAdmin) {
          user.value.type = 'admin'
          currentView.value = 'admin'
        } else {
          // 普通用户，跳转到个人页面
          window.location.href = `/${username}`
        }
      } else {
        // 理论上登录成功后不应该未授权，但为了保险起见
        window.location.href = `/${username}`
      }
    } else {
      showNotification('error', t('common.tips'), t('auth.loginFailed'))
    }
  } catch (error) {
    showNotification('error', t('common.tips'), t('auth.loginError'), error.message || String(error))
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

// 关闭通知弹窗
const closeNotificationModal = () => {
  notificationModal.value = {
    show: false,
    type: 'info',
    title: '',
    message: '',
    details: ''
  }
}

// 显示通知弹窗
const showNotification = (type, title, message, details = '') => {
  notificationModal.value = {
    show: true,
    type,
    title,
    message,
    details
  }
}

onMounted(async () => {
  await fetchSettings()
  await checkLogin()
})
</script>