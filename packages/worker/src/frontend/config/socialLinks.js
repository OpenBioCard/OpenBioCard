// 社交媒体链接配置
// Note: Labels use translation keys that will be resolved at runtime
export const socialLinkTypes = [
  {
    key: 'github',
    label: 'social.platforms.github',
    icon: '/src/frontend/assets/link/GitHub.svg',
    placeholder: 'social.placeholders.github',
    useSSLink: true, // 使用特殊的 SSLink 组件
    updateInterval: 10 * 60 * 1000 // 10分钟更新一次
  },
  {
    key: 'twitter',
    label: 'social.platforms.twitter',
    icon: '/src/frontend/assets/link/tuite-copy-copy.svg',
    placeholder: 'social.placeholders.twitter',
    useSSLink: false
  },
  {
    key: 'facebook',
    label: 'social.platforms.facebook',
    icon: '/src/frontend/assets/link/facebook.svg',
    placeholder: 'social.placeholders.facebook',
    useSSLink: false
  },
  {
    key: 'instagram',
    label: 'social.platforms.instagram',
    icon: '/src/frontend/assets/link/instagram.svg',
    placeholder: 'social.placeholders.instagram',
    useSSLink: false
  },
  {
    key: 'youtube',
    label: 'social.platforms.youtube',
    icon: '/src/frontend/assets/link/youtube.svg',
    placeholder: 'social.placeholders.youtube',
    useSSLink: false
  },
  {
    key: 'bilibili',
    label: 'social.platforms.bilibili',
    icon: '/src/frontend/assets/link/bilibili.svg',
    placeholder: 'social.placeholders.bilibili',
    useSSLink: false
  },
  {
    key: 'xiaohongshu',
    label: 'social.platforms.xiaohongshu',
    icon: '/src/frontend/assets/link/小红书.svg',
    placeholder: 'social.placeholders.xiaohongshu',
    useSSLink: false
  },
  {
    key: 'weibo',
    label: 'social.platforms.weibo',
    icon: '/src/frontend/assets/link/微博.svg',
    placeholder: 'social.placeholders.weibo',
    useSSLink: false
  },
  {
    key: 'threads',
    label: 'social.platforms.threads',
    icon: '/src/frontend/assets/link/threads.svg',
    placeholder: 'social.placeholders.threads',
    useSSLink: false
  },
  {
    key: 'huggingface',
    label: 'social.platforms.huggingface',
    icon: '/src/frontend/assets/link/huggingface.svg',
    placeholder: 'social.placeholders.huggingface',
    useSSLink: false
  },
  {
    key: 'steam',
    label: 'social.platforms.steam',
    icon: '/src/frontend/assets/link/steam.svg',
    placeholder: 'social.placeholders.steam',
    useSSLink: false
  },
  {
    key: 'spotify',
    label: 'social.platforms.spotify',
    icon: '/src/frontend/assets/link/spotify.svg',
    placeholder: 'social.placeholders.spotify',
    useSSLink: false
  },
  {
    key: 'qqmusic',
    label: 'social.platforms.qqmusic',
    icon: '/src/frontend/assets/link/QQ音乐.svg',
    placeholder: 'social.placeholders.qqmusic',
    useSSLink: false
  },
  {
    key: 'neteasemusic',
    label: 'social.platforms.neteasemusic',
    icon: '/src/frontend/assets/link/网易云音乐.svg',
    placeholder: 'social.placeholders.neteasemusic',
    useSSLink: false
  },
  {
    key: 'kugoumusic',
    label: 'social.platforms.kugoumusic',
    icon: '/src/frontend/assets/link/酷狗音乐.svg',
    placeholder: 'social.placeholders.kugoumusic',
    useSSLink: false
  }
]

// 根据 key 获取配置
export function getSocialLinkConfig(key) {
  return socialLinkTypes.find(type => type.key === key) || socialLinkTypes[0]
}

// 获取社交媒体标签 (returns translation key)
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
