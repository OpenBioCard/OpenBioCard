<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">OpenBioCard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="currentUser" class="text-sm text-gray-600">
              欢迎，{{ currentUser.username }}
            </span>
            <button
              v-if="currentUser"
              @click="logout"
              class="text-sm text-gray-600 hover:text-gray-900"
            >
              退出登录
            </button>
            <a
              v-else
              href="/"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              登录
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 用户头像和基本信息 -->
        <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div class="relative">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {{ profileData.avatar || profileData.username.charAt(0).toUpperCase() }}
            </div>
            <button
              v-if="canEdit"
              @click="editMode = !editMode"
              class="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ profileData.name || profileData.username }}</h2>
            <p class="text-gray-600 mb-4">{{ profileData.bio || '暂无简介' }}</p>
            <div class="flex flex-wrap gap-4 text-sm text-gray-500">
              <span v-if="profileData.location">📍 {{ profileData.location }}</span>
              <span v-if="profileData.website">🌐 {{ profileData.website }}</span>
            </div>
          </div>
        </div>

        <!-- 编辑模式 -->
        <div v-if="editMode && canEdit" class="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">编辑个人资料</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  v-model="editData.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">头像</label>
                <input
                  v-model="editData.avatar"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入头像字符或emoji"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">简介</label>
              <textarea
                v-model="editData.bio"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入个人简介"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <input
                  v-model="editData.location"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入位置"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">网站</label>
                <input
                  v-model="editData.website"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入网站链接"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {{ saving ? '保存中...' : '保存' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 联系方式 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="contact in profileData.contacts" :key="contact.type" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span class="text-lg">{{ getContactIcon(contact.type) }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ getContactLabel(contact.type) }}</h4>
                <p class="text-gray-600 text-sm">{{ contact.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 编辑联系方式 -->
        <div v-if="editMode && canEdit" class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">编辑联系方式</h3>
          <div class="space-y-4">
            <div v-for="(contact, index) in editData.contacts" :key="index" class="flex items-center space-x-3">
              <select
                v-model="contact.type"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">邮箱</option>
                <option value="phone">电话</option>
                <option value="wechat">微信</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
              </select>
              <input
                v-model="contact.value"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="`请输入${getContactLabel(contact.type)}`"
              />
              <button
                @click="removeContact(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <button
              @click="addContact"
              class="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>添加联系方式</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const username = route.params.username

// 用户状态
const currentUser = ref(null)
const token = ref('')

// 资料数据
const profileData = ref({
  username: username,
  name: '',
  avatar: '',
  bio: '',
  location: '',
  website: '',
  contacts: []
})

// 编辑状态
const editMode = ref(false)
const saving = ref(false)
const editData = ref({ ...profileData.value })

// 获取cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// 删除cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// 检查是否可以编辑
const canEdit = computed(() => {
  return currentUser.value && currentUser.value.username === username
})

// 获取联系方式图标
const getContactIcon = (type) => {
  const icons = {
    email: '📧',
    phone: '📱',
    wechat: '💬',
    github: '🐙',
    linkedin: '💼',
    twitter: '🐦'
  }
  return icons[type] || '📞'
}

// 获取联系方式标签
const getContactLabel = (type) => {
  const labels = {
    email: '邮箱',
    phone: '电话',
    wechat: '微信',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    twitter: 'Twitter'
  }
  return labels[type] || type
}

// 加载用户资料
const loadProfile = async () => {
  try {
    const response = await fetch(`/user/${username}`)
    if (response.ok) {
      const data = await response.json()
      profileData.value = { ...profileData.value, ...data }
      editData.value = { ...profileData.value }
    }
  } catch (error) {
    console.error('加载用户资料失败:', error)
  }
}

// 检查登录状态
const checkLogin = () => {
  const savedToken = getCookie('auth_token')
  const savedUsername = getCookie('auth_username')

  if (savedToken && savedUsername) {
    token.value = savedToken
    currentUser.value = { username: savedUsername, token: savedToken }
  }
}

// 保存资料
const saveProfile = async () => {
  if (!currentUser.value || !token.value) return

  saving.value = true
  try {
    const response = await fetch(`/user/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(editData.value)
    })

    if (response.ok) {
      profileData.value = { ...editData.value }
      editMode.value = false
      alert('保存成功')
    } else {
      alert('保存失败')
    }
  } catch (error) {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  editData.value = { ...profileData.value }
  editMode.value = false
}

// 添加联系方式
const addContact = () => {
  editData.value.contacts.push({ type: 'email', value: '' })
}

// 删除联系方式
const removeContact = (index) => {
  editData.value.contacts.splice(index, 1)
}

// 退出登录
const logout = () => {
  deleteCookie('auth_token')
  deleteCookie('auth_username')
  currentUser.value = null
  token.value = ''
  window.location.href = '/'
}

onMounted(() => {
  checkLogin()
  loadProfile()
})
</script>