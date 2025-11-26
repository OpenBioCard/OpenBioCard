import { ref, onUnmounted } from 'vue'

/**
 * 用于获取和更新 GitHub 用户信息的 composable
 * @param {string|Object} username - GitHub 用户名（字符串或响应式引用）
 * @param {number} updateInterval - 更新间隔（毫秒），默认 10 分钟
 */
export function useGitHubData(username, updateInterval = 10 * 60 * 1000) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let timer = null

  // 获取 GitHub 用户信息
  const fetchGitHubData = async () => {
    const usernameValue = typeof username === 'string' ? username : username.value
    if (!usernameValue) {
      data.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://api.github.com/users/${usernameValue}`)
      if (response.ok) {
        const result = await response.json()
        data.value = {
          login: result.login,
          name: result.name,
          avatar_url: result.avatar_url,
          bio: result.bio,
          location: result.location,
          blog: result.blog,
          twitter_username: result.twitter_username,
          public_repos: result.public_repos,
          followers: result.followers,
          following: result.following,
          created_at: result.created_at,
          updated_at: result.updated_at
        }
      } else {
        error.value = `获取 GitHub 信息失败: ${response.status}`
        data.value = null
      }
    } catch (err) {
      error.value = `获取 GitHub 信息失败: ${err.message}`
      data.value = null
    } finally {
      loading.value = false
    }
  }

  // 启动定时更新
  const startAutoUpdate = () => {
    stopAutoUpdate()
    timer = setInterval(() => {
      fetchGitHubData()
    }, updateInterval)
  }

  // 停止定时更新
  const stopAutoUpdate = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 手动刷新
  const refresh = () => {
    fetchGitHubData()
  }

  return {
    data,
    loading,
    error,
    fetchGitHubData,
    startAutoUpdate,
    stopAutoUpdate,
    refresh
  }
}

/**
 * 批量获取社交媒体链接的数据
 * @param {Array} socialLinks - 社交媒体链接数组
 */
export function useSocialLinksData(socialLinks) {
  const fetchAllData = async () => {
    if (!socialLinks || !socialLinks.value || !Array.isArray(socialLinks.value)) {
      return
    }

    // 遍历所有链接，为 GitHub 类型的链接获取数据
    for (const link of socialLinks.value) {
      if (link.type === 'github' && link.value) {
        try {
          const response = await fetch(`https://api.github.com/users/${link.value}`)
          if (response.ok) {
            const result = await response.json()
            link.githubData = {
              login: result.login,
              name: result.name,
              avatar_url: result.avatar_url,
              bio: result.bio,
              location: result.location,
              blog: result.blog,
              twitter_username: result.twitter_username,
              public_repos: result.public_repos,
              followers: result.followers,
              following: result.following,
              created_at: result.created_at,
              updated_at: result.updated_at
            }
          }
        } catch (err) {
          console.error(`获取 GitHub 用户 ${link.value} 信息失败:`, err)
        }
      }
    }
  }

  // 启动定时更新（10分钟）
  const startAutoUpdate = () => {
    const interval = setInterval(() => {
      fetchAllData()
    }, 10 * 60 * 1000)

    // 组件卸载时清除定时器
    onUnmounted(() => {
      clearInterval(interval)
    })

    return interval
  }

  // 初始化时获取一次数据
  const initialize = async () => {
    await fetchAllData()
    startAutoUpdate()
  }

  return {
    fetchAllData,
    startAutoUpdate,
    initialize
  }
}
