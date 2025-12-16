import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  // 检查系统主题偏好
  const checkSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 从localStorage获取保存的主题
  const getSavedTheme = () => {
    return localStorage.getItem('theme') === 'dark'
  }

  // 应用主题
  const applyTheme = (dark) => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  // 初始化主题
  const initTheme = () => {
    // 优先使用保存的主题，否则使用系统主题
    const savedTheme = getSavedTheme()
    const systemTheme = checkSystemTheme()

    isDark.value = savedTheme !== null ? savedTheme : systemTheme
    applyTheme(isDark.value)
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme
  }
}