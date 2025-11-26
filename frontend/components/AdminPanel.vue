<template>
  <div class="admin-container">
    <!-- 导航栏 -->
    <nav class="admin-nav">
      <div class="admin-nav-wrapper">
        <div class="admin-nav-content">
          <div class="admin-nav-brand">
            <div class="admin-nav-logo">
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
            <h1 class="admin-nav-title">
              OpenBioCard <span class="admin-nav-subtitle">{{ $t('admin.panel') }}</span>
            </h1>
          </div>

          <!-- 桌面端操作 -->
          <div class="admin-nav-actions-desktop">
            <span class="admin-nav-user">
              {{ user.username }} <span class="admin-nav-user-type">({{ user.type === 'root' ? 'ROOT' : $t('admin.systemAdmin') }})</span>
            </span>
            <button @click="toggleTheme" class="icon-button" :title="$t('navigation.toggleTheme')">
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
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <button @click="logout" class="text-button">
              {{ $t('auth.signOut') }}
            </button>
          </div>

          <!-- 移动端汉堡菜单 -->
          <button @click.stop="toggleMobileMenu" class="hamburger-button" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'">
            <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 移动端下拉菜单 -->
        <transition name="mobile-menu">
          <div v-if="mobileMenuOpen" class="mobile-menu">
            <div class="mobile-menu-user">
              {{ user.username }}
              <span class="mobile-menu-badge">{{ user.type === 'root' ? 'ROOT' : $t('admin.systemAdmin') }}</span>
            </div>
            <div class="mobile-menu-divider"></div>
            <div class="mobile-menu-item">
              <span class="mobile-menu-label">{{ $t('navigation.toggleTheme') }}</span>
              <button @click="toggleTheme" class="icon-button">
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
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>
            <div class="mobile-menu-divider"></div>
            <button @click="handleLogout" class="mobile-menu-button">
              {{ $t('auth.signOut') }}
            </button>
          </div>
        </transition>
      </div>
    </nav>

    <!-- 主内容 -->
    <main class="admin-main">
      <!-- 用户统计 -->
      <div class="admin-header">
        <div class="admin-header-text">
          <h2 class="admin-header-title">{{ $t('admin.userManagement') }}</h2>
          <p class="admin-header-desc">{{ $t('admin.manageUsers') }}</p>
        </div>
        <div class="admin-header-stats">
          <svg class="admin-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"></path>
          </svg>
          {{ users.length }} {{ $t('admin.users') }}
        </div>
      </div>

      <!-- 创建用户表单 -->
      <div class="admin-card">
        <h3 class="admin-card-title">
          <svg class="admin-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"></path>
          </svg>
          {{ $t('admin.createNewUser') }}
        </h3>

        <form @submit.prevent="createUser" class="admin-form">
          <div class="admin-form-grid">
            <div class="admin-form-field">
              <label for="username" class="admin-form-label">{{ $t('common.username') }}</label>
              <input
                id="username"
                v-model="newUser.username"
                type="text"
                :placeholder="$t('admin.enterUsername')"
                required
                class="admin-form-input"
              />
            </div>

            <div class="admin-form-field">
              <label for="password" class="admin-form-label">{{ $t('common.password') }}</label>
              <input
                id="password"
                v-model="newUser.password"
                type="password"
                :placeholder="$t('admin.enterPassword')"
                required
                class="admin-form-input"
              />
            </div>

            <div class="admin-form-field">
              <label for="type" class="admin-form-label">{{ $t('admin.userType') }}</label>
              <select id="type" v-model="newUser.type" class="admin-form-select">
                <option value="user">{{ $t('admin.regularUser') }}</option>
                <option value="admin">{{ $t('admin.admin') }}</option>
              </select>
            </div>
          </div>

          <button type="submit" :disabled="creating" class="admin-form-submit">
            <svg v-if="!creating" class="admin-form-submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5V19M5 12H19"></path>
            </svg>
            <span v-if="!creating">{{ $t('admin.createUser') }}</span>
            <div v-else class="spinner"></div>
          </button>
        </form>
      </div>

      <!-- 用户列表 -->
      <div class="admin-card">
        <h3 class="admin-card-title">
          <svg class="admin-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"></path>
          </svg>
          {{ $t('admin.allUsers') }}
        </h3>

        <!-- 空状态 -->
        <div v-if="users.length === 0" class="admin-empty">
          <div class="admin-empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
            </svg>
          </div>
          <h4 class="admin-empty-title">{{ $t('admin.noUsers') }}</h4>
          <p class="admin-empty-desc">{{ $t('admin.createFirstUser') }}</p>
        </div>

        <!-- 用户网格 -->
        <div v-else class="admin-users-grid">
          <div v-for="u in users" :key="u.username" class="admin-user-card">
            <div class="admin-user-info">
              <div class="admin-user-avatar">{{ u.username.charAt(0).toUpperCase() }}</div>
              <div class="admin-user-details">
                <h4 class="admin-user-name">{{ u.username }}</h4>
                <span class="admin-user-badge" :class="{ 'root': u.type === 'root', 'admin': u.type === 'admin' }">
                  <svg class="admin-user-badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="u.type === 'root'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"></path>
                    <path v-else-if="u.type === 'admin'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 16V12M12 8H12.01"></path>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
                  </svg>
                  {{ u.type === 'root' ? 'ROOT' : u.type === 'admin' ? $t('admin.systemAdmin') : $t('admin.regularUser') }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <button v-if="u.username !== user.username && u.type !== 'root'" @click="deleteUser(u.username)" class="admin-user-delete">
              <svg class="admin-user-delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"></path>
              </svg>
              {{ $t('admin.deleteUser') }}
            </button>
            <div v-else class="admin-user-current">
              <svg class="admin-user-current-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM9 12L11 14L15 10"></path>
              </svg>
              {{ u.username === user.username ? $t('admin.currentUser') : $t('admin.systemAdmin') }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../composables/useTheme'
import { adminAPI } from '../api/index.js'

const props = defineProps({
  user: Object,
  token: String
})

const emit = defineEmits(['logout'])

const { isDark, toggleTheme } = useTheme()
const { t } = useI18n()

const users = ref([])
const newUser = ref({
  username: '',
  password: '',
  type: 'user'
})
const creating = ref(false)
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleLogout = () => {
  closeMobileMenu()
  emit('logout')
}

const fetchUsers = async () => {
  if (!props.user || !props.token) {
    console.error('User or token not available')
    return
  }

  try {
    console.log('Fetching users for:', props.user.username)
    const data = await adminAPI.getUsers(props.token, props.user.username)
    console.log('Received users:', data.users)
    users.value = data.users || []
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const createUser = async () => {
  if (!props.user || !props.token) {
    alert(t('admin.userCreateError'))
    return
  }

  creating.value = true
  try {
    console.log('Creating user:', newUser.value.username)
    await adminAPI.createUser(newUser.value, props.token, props.user.username)
    alert(t('admin.userCreated'))
    newUser.value = { username: '', password: '', type: 'user' }
    console.log('Refreshing user list after creation')
    await fetchUsers()
  } catch (error) {
    console.error('Create user error:', error)
    alert(`${t('admin.userCreateFailed')}: ${error.message}`)
  } finally {
    creating.value = false
  }
}

const deleteUser = async (username) => {
  if (!props.user || !props.token) {
    alert(t('admin.userDeleteError'))
    return
  }

  if (!confirm(t('admin.deleteUserConfirm', { username }))) return

  try {
    console.log('Deleting user:', username)
    await adminAPI.deleteUser(username, props.token, props.user.username)
    alert(t('admin.userDeleted'))
    console.log('Refreshing user list after deletion')
    await fetchUsers()
  } catch (error) {
    console.error('Delete user error:', error)
    alert(`${t('admin.userDeleteFailed')}: ${error.message}`)
  }
}

const logout = () => {
  emit('logout')
}

// 点击外部关闭移动菜单
const handleClickOutside = (event) => {
  if (!mobileMenuOpen.value) return

  const nav = event.target.closest('.admin-nav')
  if (!nav) {
    closeMobileMenu()
  }
}

// 监听窗口大小变化，关闭移动菜单
const handleResize = () => {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  fetchUsers()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 基础容器 */
.admin-container {
  min-height: 100vh;
  background: var(--gradient-bg);
}

/* 导航栏样式 */
.admin-nav {
  background: var(--color-bg-overlay);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-border-tertiary);
  position: sticky;
  top: 0;
  z-index: 50;
}

.admin-nav-wrapper {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;
}

.admin-nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.admin-nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-nav-logo {
  width: 2rem;
  height: 2rem;
  background: var(--color-bg-primary);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-primary);
  flex-shrink: 0;
}

.admin-nav-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0;
  white-space: nowrap;
}

.admin-nav-subtitle {
  font-size: 0.875rem;
  font-weight: normal;
  color: var(--color-text-tertiary);
}

.admin-nav-actions-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-nav-user {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
  white-space: nowrap;
}

.admin-nav-user-type {
  color: var(--color-text-tertiary);
}

.icon-button {
  padding: 0.5rem;
  color: var(--color-text-tertiary);
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-button:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.text-button {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  color: var(--color-text-tertiary);
  border-radius: 0.375rem;
  transition: all 0.2s;
  border: none;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.text-button:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.hamburger-button {
  display: none;
  padding: 0.5rem;
  color: var(--color-text-primary);
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.hamburger-button:hover {
  background-color: var(--color-bg-hover);
}

/* 移动端菜单 */
.mobile-menu {
  flex-direction: column;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border-tertiary);
  background: var(--color-bg-overlay);
}

.mobile-menu-user {
  padding: 0.75rem 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mobile-menu-badge {
  padding: 0.25rem 0.5rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.mobile-menu-divider {
  height: 1px;
  background: var(--color-border-tertiary);
  margin: 0.5rem 0;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.mobile-menu-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.mobile-menu-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.mobile-menu-button:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 主内容区域 */
.admin-main {
  max-width: 1152px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 头部统计 */
.admin-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-header-text {
  flex: 1;
  min-width: 200px;
}

.admin-header-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem;
}

.admin-header-desc {
  color: var(--color-text-tertiary);
  margin: 0;
}

.admin-header-stats {
  padding: 0.75rem 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.admin-header-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 卡片样式 */
.admin-card {
  background: var(--color-bg-overlay);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-tertiary);
  padding: 2rem;
  margin-bottom: 2rem;
}

.admin-card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-card-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

/* 表单样式 */
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.admin-form-field {
  display: flex;
  flex-direction: column;
}

.admin-form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.admin-form-input,
.admin-form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
  font-size: 0.9375rem;
  box-sizing: border-box;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.admin-form-input:focus,
.admin-form-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.admin-form-select {
  cursor: pointer;
}

.admin-form-submit {
  width: 100%;
  padding: 0.875rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  gap: 0.5rem;
}

.admin-form-submit:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.admin-form-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.admin-form-submit-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.admin-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-tertiary);
}

.admin-empty-icon {
  width: 4rem;
  height: 4rem;
  background: var(--color-bg-tertiary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.admin-empty-icon svg {
  width: 2rem;
  height: 2rem;
}

.admin-empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin: 0 0 0.5rem;
}

.admin-empty-desc {
  margin: 0;
  font-size: 0.875rem;
}

/* 用户网格 */
.admin-users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.admin-user-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--color-border-tertiary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.admin-user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.admin-user-avatar {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-weight: bold;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.admin-user-details {
  flex: 1;
  min-width: 0;
}

.admin-user-name {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-user-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--color-border-primary);
  color: var(--color-text-secondary);
}

.admin-user-badge.root {
  background: var(--color-warning);
  color: var(--color-text-inverse);
}

.admin-user-badge.admin {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.admin-user-badge-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.admin-user-delete {
  width: 100%;
  padding: 0.625rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-danger-light);
  border-radius: 0.5rem;
  color: var(--color-danger);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.admin-user-delete:hover {
  background-color: var(--color-danger-bg);
  border-color: var(--color-danger);
}

.admin-user-delete-icon {
  width: 1rem;
  height: 1rem;
}

.admin-user-current {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-light);
  border-radius: 0.5rem;
  color: var(--color-success);
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.admin-user-current-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* 响应式设计 */
@media (max-width: 767px) {
  .admin-nav-title {
    font-size: 1.125rem;
  }

  .admin-nav-subtitle {
    display: none;
  }

  .admin-nav-actions-desktop {
    display: none;
  }

  .hamburger-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-main {
    padding: 1.5rem 0.75rem;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-header-title {
    font-size: 1.5rem;
  }

  .admin-header-stats {
    width: 100%;
    justify-content: center;
  }

  .admin-card {
    padding: 1.5rem;
  }

  .admin-form-grid {
    grid-template-columns: 1fr;
  }

  .admin-users-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin-nav-content {
    height: 3.5rem;
  }

  .admin-nav-wrapper {
    padding: 0 0.75rem;
  }

  .admin-nav-brand {
    gap: 0.5rem;
  }

  .admin-nav-logo {
    width: 1.75rem;
    height: 1.75rem;
  }

  .admin-nav-title {
    font-size: 1rem;
  }

  .admin-header-title {
    font-size: 1.25rem;
  }

  .admin-card {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .admin-card-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .admin-nav-user {
    display: none;
  }
}
</style>
