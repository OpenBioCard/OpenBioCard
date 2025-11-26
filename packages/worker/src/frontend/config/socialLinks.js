// 社交媒体链接配置
export const socialLinkTypes = [
  {
    key: 'github',
    label: 'GitHub',
    icon: '/src/frontend/assets/link/GitHub.svg',
    placeholder: '请输入 GitHub 用户名',
    useSSLink: true, // 使用特殊的 SSLink 组件
    updateInterval: 10 * 60 * 1000 // 10分钟更新一次
  },
  {
    key: 'twitter',
    label: 'Twitter',
    icon: '/src/frontend/assets/link/tuite-copy-copy.svg',
    placeholder: '请输入 Twitter 主页链接',
    useSSLink: false
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: '/src/frontend/assets/link/facebook.svg',
    placeholder: '请输入 Facebook 主页链接',
    useSSLink: false
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: '/src/frontend/assets/link/instagram.svg',
    placeholder: '请输入 Instagram 主页链接',
    useSSLink: false
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: '/src/frontend/assets/link/youtube.svg',
    placeholder: '请输入 YouTube 频道链接',
    useSSLink: false
  },
  {
    key: 'bilibili',
    label: 'Bilibili',
    icon: '/src/frontend/assets/link/bilibili.svg',
    placeholder: '请输入 Bilibili 主页链接',
    useSSLink: false
  },
  {
    key: 'xiaohongshu',
    label: '小红书',
    icon: '/src/frontend/assets/link/小红书.svg',
    placeholder: '请输入小红书主页链接',
    useSSLink: false
  },
  {
    key: 'weibo',
    label: '微博',
    icon: '/src/frontend/assets/link/微博.svg',
    placeholder: '请输入微博主页链接',
    useSSLink: false
  },
  {
    key: 'threads',
    label: 'Threads',
    icon: '/src/frontend/assets/link/threads.svg',
    placeholder: '请输入 Threads 主页链接',
    useSSLink: false
  },
  {
    key: 'huggingface',
    label: 'Hugging Face',
    icon: '/src/frontend/assets/link/huggingface.svg',
    placeholder: '请输入 Hugging Face 主页链接',
    useSSLink: false
  },
  {
    key: 'steam',
    label: 'Steam',
    icon: '/src/frontend/assets/link/steam.svg',
    placeholder: '请输入 Steam 个人资料链接',
    useSSLink: false
  },
  {
    key: 'spotify',
    label: 'Spotify',
    icon: '/src/frontend/assets/link/spotify.svg',
    placeholder: '请输入 Spotify 主页链接',
    useSSLink: false
  },
  {
    key: 'qqmusic',
    label: 'QQ音乐',
    icon: '/src/frontend/assets/link/QQ音乐.svg',
    placeholder: '请输入QQ音乐主页链接',
    useSSLink: false
  },
  {
    key: 'neteasemusic',
    label: '网易云音乐',
    icon: '/src/frontend/assets/link/网易云音乐.svg',
    placeholder: '请输入网易云音乐主页链接',
    useSSLink: false
  },
  {
    key: 'kugoumusic',
    label: '酷狗音乐',
    icon: '/src/frontend/assets/link/酷狗音乐.svg',
    placeholder: '请输入酷狗音乐主页链接',
    useSSLink: false
  }
]

// 根据 key 获取配置
export function getSocialLinkConfig(key) {
  return socialLinkTypes.find(type => type.key === key) || socialLinkTypes[0]
}

// 获取社交媒体标签
export function getSocialLinkLabel(key) {
  const config = getSocialLinkConfig(key)
  return config ? config.label : key
}

// 获取社交媒体图标
export function getSocialLinkIcon(key) {
  const config = getSocialLinkConfig(key)
  return config ? config.icon : '/src/frontend/assets/link/GitHub.svg'
}

// 检查是否使用 SSLink
export function useSSLink(key) {
  const config = getSocialLinkConfig(key)
  return config ? config.useSSLink : false
}
