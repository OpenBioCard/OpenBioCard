<template>
  <nav style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: var(--shadow-sm); border-bottom: 1px solid var(--color-border-tertiary); position: sticky; top: 0; z-index: 50;">
    <div style="max-width: 1152px; margin: 0 auto; padding: 0 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 2rem; height: 2rem; background: var(--color-bg-primary); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border-primary);">
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
          <h1 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary);">
            OpenBioCard
          </h1>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span v-if="currentUser" style="font-size: 0.875rem; color: var(--color-text-tertiary); font-weight: 500;">
            {{ $t('navigation.welcome', { username: currentUser.username }) }}
          </span>
          <!-- 语言切换器 -->
          <LanguageSwitcher />
          <!-- 主题切换按钮 -->
          <button
            @click="toggleTheme"
            style="font-size: 0.875rem; padding: 0.5rem; color: var(--color-text-tertiary); border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;"
            onmouseover="this.style.backgroundColor='var(--color-bg-hover)'; this.style.color='var(--color-text-primary)'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--color-text-tertiary)'"
            :title="$t('navigation.toggleTheme')"
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
            v-if="currentUser"
            @click="$emit('logout')"
            style="font-size: 0.875rem; padding: 0.375rem 0.75rem; color: var(--color-text-tertiary); border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent; cursor: pointer;"
            onmouseover="this.style.backgroundColor='var(--color-bg-hover)'; this.style.color='var(--color-text-primary)'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--color-text-tertiary)'"
          >
            {{ $t('navigation.signOut') }}
          </button>
          <button
            v-else
            @click="goToLogin"
            style="font-size: 0.875rem; padding: 0.375rem 0.75rem; background: var(--color-primary); color: var(--color-text-inverse); border-radius: 0.375rem; border: none; cursor: pointer; transition: background-color 0.2s; font-weight: 500;"
            onmouseover="this.style.backgroundColor='var(--color-primary-hover)'"
            onmouseout="this.style.backgroundColor='var(--color-primary)'"
          >
            {{ $t('navigation.signIn') }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'
import LanguageSwitcher from './LanguageSwitcher.vue'

defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

defineEmits(['logout'])

const { isDark, toggleTheme } = useTheme()

const goToLogin = () => {
  window.location.href = '/frontend'
}
</script>
