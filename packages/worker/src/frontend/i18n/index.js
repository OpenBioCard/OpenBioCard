import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import zhHANT from './locales/zh-HANT.json'
import en from './locales/en.json'

// 获取浏览器语言并映射到支持的语言
function getBrowserLocale() {
  const navigatorLocale =
    navigator.language ||
    navigator.userLanguage ||
    navigator.browserLanguage ||
    navigator.systemLanguage

  if (!navigatorLocale) {
    return 'en'
  }

  // 转换为小写便于比较
  const locale = navigatorLocale.toLowerCase()

  // 简体中文匹配
  if (locale.startsWith('zh-cn') || locale.startsWith('zh-hans') || locale === 'zh') {
    return 'zh-CN'
  }

  // 繁体中文匹配
  if (
    locale.startsWith('zh-tw') ||
    locale.startsWith('zh-hk') ||
    locale.startsWith('zh-mo') ||
    locale.startsWith('zh-hant')
  ) {
    return 'zh-HANT'
  }

  // 英文匹配
  if (locale.startsWith('en')) {
    return 'en'
  }

  // 默认返回英文
  return 'en'
}

// 从 localStorage 获取用户选择的语言，如果没有则自动检测
function getInitialLocale() {
  const savedLocale = localStorage.getItem('user-locale')
  if (savedLocale && ['zh-CN', 'zh-HANT', 'en'].includes(savedLocale)) {
    return savedLocale
  }
  return getBrowserLocale()
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(), // 初始语言
  fallbackLocale: 'en', // 回退语言为英文
  messages: {
    'zh-CN': zhCN,
    'zh-HANT': zhHANT,
    en: en
  },
  globalInjection: true, // 全局注入 $t
  missingWarn: false, // 关闭缺失翻译的警告（生产环境）
  fallbackWarn: false // 关闭回退警告（生产环境）
})

// 导出切换语言的函数
export function setLocale(locale) {
  if (['zh-CN', 'zh-HANT', 'en'].includes(locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem('user-locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }
}

// 导出获取当前语言的函数
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 导出支持的语言列表
export const supportedLocales = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-HANT', name: '繁體中文' },
  { code: 'en', name: 'English' }
]

export default i18n
