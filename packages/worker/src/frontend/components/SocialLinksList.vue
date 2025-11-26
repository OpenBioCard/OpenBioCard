<template>
  <div v-if="socialLinks && socialLinks.length > 0" style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--color-text-primary); margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>
      {{ $t('social.listTitle') }}
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div
        v-for="(link, index) in socialLinks"
        :key="index"
        @click="handleLinkClick(link)"
        style="background: var(--color-bg-overlay); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); transition: all 0.3s; cursor: pointer;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'"
      >
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; background: var(--color-bg-tertiary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img :src="getSocialLinkIcon(link.type)" style="width: 1.5rem; height: 1.5rem;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 0.5rem;">{{ getSocialLinkLabel(link.type) }}</h4>

            <!-- GitHub 特殊展示 -->
            <template v-if="link.type === 'github' && link.githubData">
              <div style="background: var(--color-bg-secondary); border: 1px solid var(--color-border-primary); border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <img v-if="link.githubData.avatar_url" :src="link.githubData.avatar_url" style="width: 2rem; height: 2rem; border-radius: 50%;" />
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; color: var(--color-text-primary); font-size: 0.875rem; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ link.githubData.name || link.value }}</p>
                    <p style="color: var(--color-text-tertiary); font-size: 0.75rem; margin: 0;">@{{ link.value }}</p>
                  </div>
                </div>
                <div v-if="link.githubData.bio" style="color: var(--color-text-tertiary); font-size: 0.75rem; margin-bottom: 0.5rem; line-height: 1.4;">
                  {{ link.githubData.bio }}
                </div>
                <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: var(--color-text-tertiary);">
                  <span v-if="link.githubData.followers !== undefined">
                    <strong style="color: var(--color-text-primary);">{{ link.githubData.followers }}</strong> followers
                  </span>
                  <span v-if="link.githubData.public_repos !== undefined">
                    <strong style="color: var(--color-text-primary);">{{ link.githubData.public_repos }}</strong> repos
                  </span>
                </div>
              </div>
            </template>

            <!-- 其他社交媒体链接 -->
            <template v-else>
              <p style="color: var(--color-text-tertiary); font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
                {{ link.value }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { getSocialLinkIcon } from '../config/socialLinks'

const { t } = useI18n()

defineProps({
  socialLinks: {
    type: Array,
    default: () => []
  }
})

const getSocialLinkLabel = (type) => {
  return t(`social.platforms.${type}`)
}

const handleLinkClick = (link) => {
  // GitHub 点击处理：打开 GitHub 主页
  if (link.type === 'github' && link.value) {
    window.open(`https://github.com/${link.value}`, '_blank')
    return
  }

  // 其他链接直接打开
  if (link.value) {
    // 如果不是完整URL，则假设为用户名或ID
    let url = link.value
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // 根据平台类型构建URL
      const platformUrls = {
        twitter: `https://twitter.com/${url}`,
        facebook: `https://facebook.com/${url}`,
        instagram: `https://instagram.com/${url}`,
        youtube: url,
        bilibili: url,
        xiaohongshu: url,
        weibo: url,
        threads: `https://threads.net/@${url}`,
        huggingface: `https://huggingface.co/${url}`,
        steam: url,
        spotify: url,
        qqmusic: url,
        neteasemusic: url,
        kugoumusic: url
      }
      url = platformUrls[link.type] || url
    }
    window.open(url, '_blank')
  }
}
</script>
