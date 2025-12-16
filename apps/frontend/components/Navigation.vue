<template>
  <nav class="nav-container">
    <div class="nav-wrapper">
      <div class="nav-content">
        <!-- Logo 和标题 -->
        <div class="nav-brand">
          <div class="nav-logo">
            <svg width="24" height="24" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="50" width="150" height="100" rx="15" ry="15" fill="var(--color-bg-primary)" stroke="var(--color-text-primary)" stroke-width="4"/>
              <circle cx="50" cy="90" r="15" fill="none" stroke="var(--color-text-primary)" stroke-width="3"/>
              <line x1="50" y1="105" x2="50" y2="120" stroke="var(--color-text-primary)" stroke-width="2"/>
              <text x="70" y="85" font-family="monospace" font-size="8" fill="var(--color-text-primary)">console.log("Open")</text>
              <line x1="70" y1="95" x2="150" y2="95" stroke="var(--color-text-primary)" stroke-width="1.5"/>
              <line x1="70" y1="110" x2="130" y2="110" stroke="var(--color-text-primary)" stroke-width="1.5"/>
              <line x1="35" y1="145" x2="165" y2="145" stroke="var(--color-text-primary)" stroke-width="1" stroke-dasharray="4,4"/>
            </svg>
          </div>
          <h1 class="nav-title">OpenBioCard</h1>
        </div>

        <!-- 桌面端右侧菜单 -->
        <div class="nav-actions-desktop">
          <span v-if="currentUser" class="welcome-text">
            {{ $t('navigation.welcome', { username: currentUser.username }) }}
          </span>
          <LanguageSwitcher />
          <button
            @click="toggleTheme"
            class="icon-button"
            :title="$t('navigation.toggleTheme')"
          >
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
          <button
            v-if="currentUser"
            @click="$emit('logout')"
            class="text-button"
          >
            {{ $t('navigation.signOut') }}
          </button>
          <button
            v-else
            @click="goToLogin"
            class="primary-button"
          >
            {{ $t('navigation.signIn') }}
          </button>
        </div>

        <!-- 移动端汉堡菜单按钮 -->
        <button
          @click.stop="toggleMobileMenu"
          class="hamburger-button"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
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
          <div v-if="currentUser" class="mobile-menu-user">
            {{ $t('navigation.welcome', { username: currentUser.username }) }}
          </div>
          <div class="mobile-menu-divider"></div>
          <div class="mobile-menu-item">
            <span class="mobile-menu-label">{{ $t('navigation.toggleTheme') }}</span>
            <button
              @click="toggleTheme"
              class="icon-button"
            >
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
          <div class="mobile-menu-item mobile-menu-language">
            <LanguageSwitcher />
          </div>
          <div class="mobile-menu-divider"></div>
          <button
            v-if="currentUser"
            @click="handleLogout"
            class="mobile-menu-button"
          >
            {{ $t('navigation.signOut') }}
          </button>
          <button
            v-else
            @click="handleLogin"
            class="mobile-menu-button primary"
          >
            {{ $t('navigation.signIn') }}
          </button>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '../composables/useTheme'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['logout'])

const { isDark, toggleTheme } = useTheme()
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

const handleLogin = () => {
  closeMobileMenu()
  goToLogin()
}

const goToLogin = () => {
  window.location.href = '/'
}

// 点击外部关闭移动菜单
const handleClickOutside = (event) => {
  if (!mobileMenuOpen.value) return

  const nav = event.target.closest('nav')
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
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.nav-container {
  background: var(--color-bg-overlay);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-border-tertiary);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-wrapper {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-logo {
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

.nav-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.nav-actions-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.welcome-text {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
  white-space: nowrap;
}

.icon-button {
  font-size: 0.875rem;
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

.primary-button {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  white-space: nowrap;
}

.primary-button:hover {
  background-color: var(--color-primary-hover);
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

.mobile-menu-language {
  display: block;
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

.mobile-menu-button.primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.mobile-menu-button.primary:hover {
  background: var(--color-primary-hover);
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

/* 响应式设计 */
@media (max-width: 767px) {
  .nav-title {
    font-size: 1.125rem;
  }

  .nav-actions-desktop {
    display: none;
  }

  .hamburger-button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .welcome-text {
    display: none;
  }
}

/* 平板适配 */
@media (max-width: 1023px) and (min-width: 768px) {
  .welcome-text {
    display: none;
  }
}

/* 小屏平板 */
@media (max-width: 640px) {
  .nav-content {
    height: 3.5rem;
  }

  .nav-wrapper {
    padding: 0 0.75rem;
  }

  .nav-brand {
    gap: 0.5rem;
  }

  .nav-logo {
    width: 1.75rem;
    height: 1.75rem;
  }

  .nav-title {
    font-size: 1rem;
  }
}
</style>
