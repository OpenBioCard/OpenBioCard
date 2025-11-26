import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'openBioCard-theme'

// 全局主题状态
const isDark = ref(false)

// 初始化标志，确保只初始化一次
let initialized = false

/**
 * 主题管理 Composable
 * 提供深色/浅色模式切换功能
 */
export function useTheme() {
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 设置主题
  const setTheme = (dark) => {
    isDark.value = dark
  }

  // 应用主题到 HTML 元素
  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 保存主题到 localStorage
  const saveTheme = () => {
    try {
      localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  // 从 localStorage 加载主题
  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY)
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
        return true
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
    return false
  }

  // 检测系统主题偏好
  const detectSystemTheme = () => {
    if (window.matchMedia) {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e) => {
        // 只有在没有手动设置过主题时才跟随系统
        if (!localStorage.getItem(THEME_KEY)) {
          isDark.value = e.matches
        }
      }
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
    return () => {}
  }

  // 初始化主题
  const initTheme = () => {
    if (initialized) return

    // 1. 尝试从 localStorage 加载
    const hasStoredTheme = loadTheme()

    // 2. 如果没有存储的主题，检测系统主题
    if (!hasStoredTheme) {
      detectSystemTheme()
    }

    // 3. 应用主题
    applyTheme()

    // 4. 监听系统主题变化
    watchSystemTheme()

    initialized = true
  }

  // 监听主题变化
  watch(isDark, () => {
    applyTheme()
    saveTheme()
  })

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
}
