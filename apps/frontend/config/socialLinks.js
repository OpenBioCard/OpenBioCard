// 社交媒体链接配置
// Note: Labels use translation keys that will be resolved at runtime
// Import SVG icons
import githubIcon from '/assets/link/GitHub.svg'
import twitterIcon from '/assets/link/tuite-copy-copy.svg'
import facebookIcon from '/assets/link/facebook.svg'
import instagramIcon from '/assets/link/instagram.svg'
import youtubeIcon from '/assets/link/youtube.svg'
import bilibiliIcon from '/assets/link/bilibili.svg'
import xiaohongshuIcon from '/assets/link/小红书.svg'
import weiboIcon from '/assets/link/微博.svg'
import threadsIcon from '/assets/link/threads.svg'
import huggingfaceIcon from '/assets/link/huggingface.svg'
import steamIcon from '/assets/link/steam.svg'
import spotifyIcon from '/assets/link/spotify.svg'
import qqmusicIcon from '/assets/link/QQ音乐.svg'
import neteasemusicIcon from '/assets/link/网易云音乐.svg'
import kugoumusicIcon from '/assets/link/酷狗音乐.svg'

export const socialLinkTypes = [
  {
    key: 'github',
    label: 'social.platforms.github',
    icon: githubIcon,
    placeholder: 'social.placeholders.github',
    useSSLink: true, // 使用特殊的 SSLink 组件
    updateInterval: 10 * 60 * 1000 // 10分钟更新一次
  },
  {
    key: 'twitter',
    label: 'social.platforms.twitter',
    icon: twitterIcon,
    placeholder: 'social.placeholders.twitter',
    useSSLink: false
  },
  {
    key: 'facebook',
    label: 'social.platforms.facebook',
    icon: facebookIcon,
    placeholder: 'social.placeholders.facebook',
    useSSLink: false
  },
  {
    key: 'instagram',
    label: 'social.platforms.instagram',
    icon: instagramIcon,
    placeholder: 'social.placeholders.instagram',
    useSSLink: false
  },
  {
    key: 'youtube',
    label: 'social.platforms.youtube',
    icon: youtubeIcon,
    placeholder: 'social.placeholders.youtube',
    useSSLink: false
  },
  {
    key: 'bilibili',
    label: 'social.platforms.bilibili',
    icon: bilibiliIcon,
    placeholder: 'social.placeholders.bilibili',
    useSSLink: false
  },
  {
    key: 'xiaohongshu',
    label: 'social.platforms.xiaohongshu',
    icon: xiaohongshuIcon,
    placeholder: 'social.placeholders.xiaohongshu',
    useSSLink: false
  },
  {
    key: 'weibo',
    label: 'social.platforms.weibo',
    icon: weiboIcon,
    placeholder: 'social.placeholders.weibo',
    useSSLink: false
  },
  {
    key: 'threads',
    label: 'social.platforms.threads',
    icon: threadsIcon,
    placeholder: 'social.placeholders.threads',
    useSSLink: false
  },
  {
    key: 'huggingface',
    label: 'social.platforms.huggingface',
    icon: huggingfaceIcon,
    placeholder: 'social.placeholders.huggingface',
    useSSLink: false
  },
  {
    key: 'steam',
    label: 'social.platforms.steam',
    icon: steamIcon,
    placeholder: 'social.placeholders.steam',
    useSSLink: false
  },
  {
    key: 'spotify',
    label: 'social.platforms.spotify',
    icon: spotifyIcon,
    placeholder: 'social.placeholders.spotify',
    useSSLink: false
  },
  {
    key: 'qqmusic',
    label: 'social.platforms.qqmusic',
    icon: qqmusicIcon,
    placeholder: 'social.placeholders.qqmusic',
    useSSLink: false
  },
  {
    key: 'neteasemusic',
    label: 'social.platforms.neteasemusic',
    icon: neteasemusicIcon,
    placeholder: 'social.placeholders.neteasemusic',
    useSSLink: false
  },
  {
    key: 'kugoumusic',
    label: 'social.platforms.kugoumusic',
    icon: kugoumusicIcon,
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
  return config ? config.icon : '/assets/link/GitHub.svg'
}

// 检查是否使用 SSLink
export function useSSLink(key) {
  const config = getSocialLinkConfig(key)
  return config ? config.useSSLink : false
}
