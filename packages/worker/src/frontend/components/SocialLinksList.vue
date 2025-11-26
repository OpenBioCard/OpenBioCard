<template>
  <div v-if="socialLinks && socialLinks.length > 0" style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
      </svg>
      社交媒体
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div
        v-for="(link, index) in socialLinks"
        :key="index"
        @click="handleLinkClick(link)"
        style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s; cursor: pointer;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'"
      >
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; background: #f3f4f6; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img :src="getSocialLinkIcon(link.type)" style="width: 1.5rem; height: 1.5rem;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-weight: 600; color: #111827; margin-bottom: 0.5rem;">{{ getSocialLinkLabel(link.type) }}</h4>

            <!-- GitHub 特殊展示 -->
            <template v-if="link.type === 'github' && link.githubData">
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <img v-if="link.githubData.avatar_url" :src="link.githubData.avatar_url" style="width: 2rem; height: 2rem; border-radius: 50%;" />
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; color: #111827; font-size: 0.875rem; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ link.githubData.name || link.value }}</p>
                    <p style="color: #6b7280; font-size: 0.75rem; margin: 0;">@{{ link.value }}</p>
                  </div>
                </div>
                <div v-if="link.githubData.bio" style="color: #6b7280; font-size: 0.75rem; margin-bottom: 0.5rem; line-height: 1.4;">
                  {{ link.githubData.bio }}
                </div>
                <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: #6b7280;">
                  <span v-if="link.githubData.followers !== undefined">
                    <strong style="color: #111827;">{{ link.githubData.followers }}</strong> followers
                  </span>
                  <span v-if="link.githubData.public_repos !== undefined">
                    <strong style="color: #111827;">{{ link.githubData.public_repos }}</strong> repos
                  </span>
                </div>
              </div>
            </template>

            <!-- 其他社交媒体链接 -->
            <template v-else>
              <p style="color: #6b7280; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
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
import { getSocialLinkLabel, getSocialLinkIcon, useSSLink } from '../config/socialLinks'

defineProps({
  socialLinks: {
    type: Array,
    default: () => []
  }
})

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
