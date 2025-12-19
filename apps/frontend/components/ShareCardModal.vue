<template>
  <Teleport to="body">
    <div v-if="show" style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <!-- Backdrop with blur -->
      <div 
        @click="$emit('close')"
        style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
      ></div>

      <!-- Modal Content -->
      <div style="position: relative; z-index: 10000; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <!-- The Card to Capture -->
        <div 
          ref="cardRef"
          class="share-card"
          style="
            width: 340px; 
            background: #f8f9fa; 
            border-radius: 24px; 
            padding: 24px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            font-family: system-ui, -apple-system, sans-serif;
            color: #1a1a1a;
            overflow: hidden;
          "
        >
          <!-- Decorative side strip (like the image) -->
          <div style="
            position: absolute; 
            left: 24px; 
            top: 0; 
            bottom: 0; 
            width: 2px; 
            background: rgba(0,0,0,0.05);
          "></div>
          
          <!-- Decorative dots -->
          <div style="position: absolute; left: 16px; top: 40px; width: 18px; height: 18px; background: linear-gradient(135deg, #e0e0e0, #ffffff); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05);"></div>
          <div style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; background: linear-gradient(135deg, #e0e0e0, #ffffff); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05);"></div>
          <div style="position: absolute; left: 16px; bottom: 40px; width: 18px; height: 18px; background: linear-gradient(135deg, #e0e0e0, #ffffff); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05);"></div>

          <!-- Main Content (Shifted right due to decorative strip) -->
          <div style="padding-left: 32px; display: flex; flex-direction: column; height: 100%;">
            
            <!-- Header: Name -->
            <h2 style="
              font-size: 24px; 
              font-weight: 800; 
              line-height: 1.3; 
              margin: 0 0 8px 0;
              color: #111;
            ">
              {{ profileData.name || profileData.username }}
            </h2>

            <!-- Address / URL -->
            <div style="
              font-size: 14px; 
              color: #888; 
              margin-bottom: 24px;
              word-break: break-all;
              display: flex;
              flex-direction: column;
              gap: 4px;
            ">
              <span v-if="profileData.location">📍 {{ profileData.location }}</span>
              <span v-if="profileData.website">🔗 {{ profileData.website }}</span>
              <span v-if="!profileData.location && !profileData.website">{{ profileUrl }}</span>
            </div>

            <!-- Bio / Description -->
            <div style="
              font-size: 15px; 
              line-height: 1.6; 
              color: #444; 
              margin-bottom: auto;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
            ">
              {{ profileData.bio || t('profile.defaultBio') }}
            </div>

            <!-- Bottom Section: Avatar & QR -->
            <div style="
              display: flex; 
              align-items: flex-end; 
              justify-content: space-between; 
              margin-top: 32px;
            ">
              <!-- Branding / Avatar -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="
                  width: 40px; 
                  height: 40px; 
                  border-radius: 10px; 
                  overflow: hidden; 
                  background: #000;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-weight: bold;
                  font-size: 18px;
                ">
                  <img v-if="isBase64Image(profileData.avatar)" :src="profileData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                  <span v-else>{{ (profileData.name || profileData.username).charAt(0).toUpperCase() }}</span>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: bold; font-size: 14px; color: #000;">OpenBioCard</span>
                  <span style="font-size: 10px; color: #999;">@{{ profileData.username }}</span>
                </div>
              </div>

              <!-- QR Code (Floating effect) -->
              <div style="
                background: #fff;
                padding: 8px;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                transform: rotate(-3deg) translateY(10px);
              ">
                <qrcode-vue :value="profileUrl" :size="80" level="H" />
              </div>
            </div>
          </div>
          
          <!-- Camera Flash Overlay -->
          <div 
            v-if="isFlashing"
            data-no-capture="true"
            style="
              position: absolute;
              inset: 0;
              background: #fff;
              z-index: 999;
              animation: flash 0.5s ease-out forwards;
            "
          ></div>
        </div>

        <!-- Action Button -->
        <button 
          @click="saveImage"
          :disabled="isSaving"
          style="
            background: #1a1a1a; 
            color: #fff; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 12px; 
            font-weight: 600; 
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          "
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        >
          <span v-if="isSaving">Saving...</span>
          <span v-else>保存为图片</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import { snapdom } from '@zumer/snapdom'

const props = defineProps({
  show: Boolean,
  profileData: Object
})

defineEmits(['close'])

const { t } = useI18n()
const cardRef = ref(null)
const isSaving = ref(false)
const isFlashing = ref(false)

const windowLocation = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return ''
})

const profileUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/${props.profileData.username}`
  }
  return ''
})

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const saveImage = async () => {
  if (!cardRef.value || isSaving.value) return
  
  isSaving.value = true
  
  // Camera shutter animation
  isFlashing.value = true
  setTimeout(() => {
    isFlashing.value = false
  }, 500)

  try {
    // Wait for a moment for the flash to start
    await new Promise(resolve => setTimeout(resolve, 100))
    
    await snapdom.download(cardRef.value, {
      filename: `biocard-${props.profileData.username}`,
      format: 'png',
      scale: 2, // High resolution
      filter: (node) => {
        // Exclude the flash overlay from capture
        if (node.getAttribute && node.getAttribute('data-no-capture')) return false
        return true
      }
    })
    
  } catch (error) {
    console.error('Failed to save image:', error)
    alert('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
@keyframes flash {
  0% { opacity: 0.8; }
  100% { opacity: 0; }
}
</style>
