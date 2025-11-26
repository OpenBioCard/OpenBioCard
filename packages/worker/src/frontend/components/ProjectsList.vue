<template>
  <div v-if="projects && projects.length > 0" style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
      我的项目
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
      <div
        v-for="(project, index) in projects"
        :key="index"
        @click="handleProjectClick(project)"
        style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s; cursor: pointer; display: flex; flex-direction: column; gap: 1rem;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'"
      >
        <!-- Logo 和标题 -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div v-if="isBase64Image(project.logo)" style="width: 4rem; height: 4rem; border-radius: 0.75rem; overflow: hidden; border: 2px solid #e5e7eb; flex-shrink: 0;">
            <img :src="project.logo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div v-else style="width: 4rem; height: 4rem; border-radius: 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg style="width: 2rem; height: 2rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-weight: 600; color: #111827; font-size: 1.125rem; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              {{ project.name || '未命名项目' }}
            </h4>
            <div v-if="project.url" style="display: flex; align-items: center; gap: 0.25rem; margin-top: 0.25rem;">
              <svg style="width: 0.875rem; height: 0.875rem; color: #6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <span style="color: #6b7280; font-size: 0.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ getDisplayUrl(project.url) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 项目描述 -->
        <p v-if="project.description" style="color: #6b7280; font-size: 0.875rem; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
          {{ project.description }}
        </p>

        <!-- 访问链接提示 -->
        <div v-if="project.url" style="display: flex; align-items: center; gap: 0.5rem; color: #000000; font-size: 0.875rem; font-weight: 500; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid #e5e7eb;">
          <span>访问项目</span>
          <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const getDisplayUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname + urlObj.pathname
  } catch {
    return url
  }
}

const handleProjectClick = (project) => {
  if (project.url) {
    window.open(project.url, '_blank')
  }
}
</script>
