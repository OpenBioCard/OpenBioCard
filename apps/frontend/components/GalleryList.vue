<template>
  <div v-if="gallery && gallery.length > 0" style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--color-text-primary); margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      {{ $t('gallery.title') }}
    </h3>

    <!-- 图片网格 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
      <div
        v-for="(photo, index) in gallery"
        :key="index"
        @click="openLightbox(index)"
        style="position: relative; aspect-ratio: 1; border-radius: 0.75rem; overflow: hidden; cursor: pointer; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); transition: all 0.3s;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 20px rgba(0, 0, 0, 0.15)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'"
      >
        <img
          v-if="isBase64Image(photo.image)"
          :src="photo.image"
          :alt="photo.caption || $t('gallery.photoAlt')"
          style="width: 100%; height: 100%; object-fit: cover;"
        />

        <!-- 图片说明覆盖层 -->
        <div
          v-if="photo.caption"
          style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), transparent); padding: 2rem 1rem 1rem; color: white;"
        >
          <p style="margin: 0; font-size: 0.875rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            {{ photo.caption }}
          </p>
        </div>

        <!-- Hover 放大图标 -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.3s; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border-radius: 50%; padding: 1rem;"
          onmouseenter="this.style.opacity='1'"
          onmouseleave="this.style.opacity='0'"
        >
          <svg style="width: 2rem; height: 2rem; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 图片灯箱/查看器 -->
    <div
      v-if="lightboxOpen"
      @click="closeLightbox"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto;"
    >
      <!-- 关闭按钮 -->
      <button
        @click.stop="closeLightbox"
        style="position: absolute; top: 1.5rem; right: 1.5rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; z-index: 10001;"
        onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'"
        onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.1)'"
      >
        <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 上一张按钮 -->
      <button
        v-if="currentImageIndex > 0"
        @click.stop="previousImage"
        style="position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); padding: 1rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; z-index: 10001;"
        onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'"
        onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.1)'"
      >
        <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- 下一张按钮 -->
      <button
        v-if="currentImageIndex < gallery.length - 1"
        @click.stop="nextImage"
        style="position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); padding: 1rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; z-index: 10001;"
        onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'"
        onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.1)'"
      >
        <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- 图片容器 -->
      <div
        @click.stop
        style="max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center; gap: 1rem; user-select: none;"
      >
        <img
          v-if="gallery[currentImageIndex]?.image && isBase64Image(gallery[currentImageIndex].image)"
          :src="gallery[currentImageIndex].image"
          :alt="gallery[currentImageIndex].caption || $t('gallery.photoAlt')"
          style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 0.5rem; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); pointer-events: none;"
        />
        <div v-else style="color: white; padding: 2rem;">
          <p>{{ $t('gallery.loadFailed') }}</p>
        </div>
        <p
          v-if="gallery[currentImageIndex]?.caption"
          style="color: white; font-size: 1rem; text-align: center; margin: 0; max-width: 600px; line-height: 1.5;"
        >
          {{ gallery[currentImageIndex].caption }}
        </p>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.875rem; margin: 0;">
            {{ currentImageIndex + 1 }} / {{ gallery.length }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  gallery: {
    type: Array,
    default: () => []
  }
})

const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const openLightbox = (index) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (currentImageIndex.value < props.gallery.length - 1) {
    currentImageIndex.value++
  }
}

// 键盘导航
const handleKeyPress = (event) => {
  if (!lightboxOpen.value) return

  if (event.key === 'Escape') {
    closeLightbox()
  } else if (event.key === 'ArrowLeft') {
    previousImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

// 添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>
