<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;">
      <!-- Backdrop with blur -->
      <div 
        @click="$emit('close')"
        style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
      ></div>

      <!-- Modal Content -->
        <div style="position: relative; z-index: 10000; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; perspective: 1000px;">
          <!-- The Card to Capture -->
          <div 
            ref="cardRef"
            class="share-card"
            :class="{ 'is-dropping': isDropping }"
            style="
              width: 340px; 
              background: var(--color-bg-secondary); 
              border-radius: 24px; 
              padding: 24px; 
              box-shadow: 0 20px 40px rgba(0,0,0,0.2);
              position: relative;
              font-family: system-ui, -apple-system, sans-serif;
              color: var(--color-text-primary);
              overflow: hidden;
              border: 1px solid var(--color-border-tertiary);
              z-index: 10000;
            "
          >
          <!-- Decorative side strip (like the image) -->
          <div style="
            position: absolute; 
            left: 24px; 
            top: 0; 
            bottom: 0; 
            width: 2px; 
            background: var(--color-border-primary);
            opacity: 0.3;
          "></div>
          
          <!-- Decorative dots -->
          <div style="position: absolute; left: 16px; top: 40px; width: 18px; height: 18px; background: var(--color-bg-tertiary); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05); border: 1px solid var(--color-border-primary);"></div>
          <div style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; background: var(--color-bg-tertiary); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05); border: 1px solid var(--color-border-primary);"></div>
          <div style="position: absolute; left: 16px; bottom: 40px; width: 18px; height: 18px; background: var(--color-bg-tertiary); border-radius: 50%; box-shadow: 2px 2px 5px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(0,0,0,0.05); border: 1px solid var(--color-border-primary);"></div>

          <!-- Main Content (Shifted right due to decorative strip) -->
          <div style="padding-left: 32px; display: flex; flex-direction: column; height: 100%;">
            
            <!-- Header: Name -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
              <h2 style="
                font-size: 24px; 
                font-weight: 800; 
                line-height: 1.3; 
                margin: 0;
                color: var(--color-text-primary);
              ">
                {{ profileData.name || profileData.username }}
              </h2>
              <span v-if="profileData.userType" style="
                padding: 2px 8px; 
                background: var(--color-bg-tertiary); 
                color: var(--color-text-primary); 
                font-size: 11px; 
                font-weight: 600; 
                border-radius: 9999px; 
                border: 1px solid var(--color-border-primary);
                white-space: nowrap;
              ">
                {{ 
                  profileData.userType === 'organization' ? t('profile.accountOrganization') : 
                  profileData.userType === 'company' ? t('profile.accountCompany') : 
                  t('profile.accountPersonal') 
                }}
              </span>
            </div>

            <!-- Page URL -->
            <div style="
              font-size: 13px;
              color: var(--color-text-tertiary);
              margin-bottom: 16px;
              word-break: break-all;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            ">
              {{ profileUrl }}
            </div>

            <!-- Location / Website -->
            <div style="
              font-size: 14px; 
              color: var(--color-text-secondary); 
              margin-bottom: 24px;
              display: flex;
              flex-direction: column;
              gap: 4px;
            ">
              <span v-if="profileData.location">📍 {{ profileData.location }}</span>
              <span v-if="profileData.website">🔗 {{ profileData.website }}</span>
            </div>

            <!-- Bio / Description -->
            <div style="
              font-size: 15px; 
              line-height: 1.6; 
              color: var(--color-text-secondary); 
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
                  background: var(--color-primary);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: var(--color-text-inverse);
                  font-weight: bold;
                  font-size: 18px;
                ">
                  <img v-if="isBase64Image(profileData.avatar)" :src="profileData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                  <span v-else>{{ (profileData.name || profileData.username).charAt(0).toUpperCase() }}</span>
                </div>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: bold; font-size: 14px; color: var(--color-text-primary);">{{ siteSettings?.title || t('app.name') }}</span>
                  <span style="font-size: 10px; color: var(--color-text-tertiary);">@{{ profileData.username }}</span>
                </div>
              </div>

              <!-- QR Code (Modern Styled) -->
              <div style="
                background: #fff;
                padding: 14px;
                border-radius: 28px;
                box-shadow: 
                  0 15px 35px rgba(0,0,0,0.15),
                  inset 0 0 0 1px rgba(0,0,0,0.05);
                transform: rotate(-3deg) translateY(10px);
                position: relative;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="position: relative; width: 84px; height: 84px;">
                  <qrcode-vue 
                    :value="profileUrl" 
                    :size="84" 
                    level="H" 
                    :background="'#ffffff'" 
                    :foreground="'#111827'"
                    :render-as="'svg'"
                    :margin="0"
                  />
                  
                  <!-- Custom Eye Overlays to match the requested style -->
                  <!-- Top Left Eye -->
                  <div style="position: absolute; top: -1px; left: -1px; width: 23px; height: 23px; background: #fff; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 19px; height: 19px; border: 3.5px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 7px; height: 7px; background: #111827; border-radius: 50%;"></div>
                    </div>
                  </div>
                  <!-- Top Right Eye -->
                  <div style="position: absolute; top: -1px; right: -1px; width: 23px; height: 23px; background: #fff; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 19px; height: 19px; border: 3.5px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 7px; height: 7px; background: #111827; border-radius: 50%;"></div>
                    </div>
                  </div>
                  <!-- Bottom Left Eye -->
                  <div style="position: absolute; bottom: -1px; left: -1px; width: 23px; height: 23px; background: #fff; display: flex; align-items: center; justify-content: center;">
                    <div style="width: 19px; height: 19px; border: 3.5px solid #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <div style="width: 7px; height: 7px; background: #111827; border-radius: 50%;"></div>
                    </div>
                  </div>
                </div>
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
              z-index: 10001;
              animation: flash 0.5s ease-out forwards;
              pointer-events: none;
            "
          ></div>
        </div>

        <!-- ATM Style Card Slot (Theme Aware) -->
        <div 
          class="atm-slot-system"
          style="
            width: 380px;
            position: relative;
            margin-top: -10px; /* Reduced negative margin to create a visible gap */
            z-index: 10005;
            perspective: 1000px;
          "
        >
          <!-- Front Panel -->
          <div 
            style="
              width: 100%;
              height: 60px; /* Slightly taller for better label spacing */
              background: var(--color-bg-tertiary);
              border-radius: 14px;
              position: relative;
              z-index: 10010;
              border: 1px solid var(--color-border-secondary);
              box-shadow: 
                0 15px 35px rgba(0,0,0,0.2),
                inset 0 1px 0 rgba(255,255,255,0.1);
              display: flex;
              flex-direction: column; /* Use column to stack labels and slit */
              align-items: center;
              justify-content: center;
              overflow: hidden;
              gap: 4px;
            "
          >
            <!-- ATM-style Accent Gradient -->
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, var(--color-accent-light) 0%, transparent 100%);
              pointer-events: none;
              opacity: 0.5;
            "></div>

            <!-- Labels Row (Top) -->
            <div style="width: 100%; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; z-index: 1;">
              <div style="font-size: 8px; font-weight: bold; color: var(--color-text-tertiary); opacity: 0.8; letter-spacing: 1px; text-transform: uppercase;">
                {{ t('share.fastEject') }}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div 
                  :style="{ 
                    background: isSaving ? 'var(--color-success)' : 'var(--color-text-tertiary)',
                    boxShadow: isSaving ? '0 0 10px var(--color-success)' : 'none'
                  }"
                  style="width: 6px; height: 6px; border-radius: 50%; transition: all 0.3s;"
                ></div>
                <div style="display: flex; align-items: baseline; gap: 4px; line-height: 1;">
                  <span style="font-size: 7px; color: var(--color-text-secondary); font-weight: 800; text-transform: uppercase;">{{ t('share.atmMode') }}</span>
                  <span style="font-size: 6px; color: var(--color-text-tertiary);">{{ isSaving ? t('share.statusActive') : t('share.statusReady') }}</span>
                </div>
              </div>
            </div>

            <!-- The Recessed Slit -->
            <div style="
              width: 320px;
              height: 14px;
              background: #000;
              border-radius: 4px;
              box-shadow: 
                inset 0 3px 6px rgba(0,0,0,1),
                0 0 0 1px var(--color-accent-light);
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1;
            ">
              <!-- ATM Slot Inner Glow -->
              <div 
                class="atm-inner-glow"
                :style="{ opacity: isSaving ? 0.8 : 0.2 }"
                style="
                  position: absolute;
                  inset: 0;
                  background: radial-gradient(circle, var(--color-accent) 0%, transparent 80%);
                  transition: opacity 0.5s ease;
                "
              ></div>
              
              <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.1);"></div>
            </div>
          </div>

          <!-- Bottom Shadow for depth -->
          <div style="
            position: absolute;
            bottom: -5px;
            left: 20px;
            right: 20px;
            height: 10px;
            background: #000;
            filter: blur(15px);
            opacity: 0.4;
            z-index: 10000;
          "></div>
        </div>

        <!-- Action Button -->
        <button 
          @click="saveImage"
          :disabled="isSaving"
          style="
            background: var(--color-primary); 
            color: var(--color-text-inverse); 
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
          <span v-if="isSaving">{{ t('share.saving') }}</span>
          <span v-else>{{ t('share.saveAsImage') }}</span>
        </button>
      </div>
    </div>
  </Transition>
</Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import { snapdom } from '@zumer/snapdom'

const props = defineProps({
  show: Boolean,
  profileData: Object,
  siteSettings: Object
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const cardRef = ref(null)
const isSaving = ref(false)
const isFlashing = ref(false)
const isDropping = ref(false)

// Disable body scroll when modal is open
watch(() => props.show, (newVal) => {
  if (typeof document !== 'undefined') {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}, { immediate: true })

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
  
  try {
    // 1. Snapshot first (while card is static)
    // Camera shutter flash effect
    isFlashing.value = true
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // We only trigger download AFTER the animation starts to feel like it's being "ejected/swallowed"
    // But we capture the DOM state NOW before any animation transforms apply
    const downloadPromise = snapdom.download(cardRef.value, {
      filename: `biocard-${props.profileData.username}`,
      format: 'png',
      scale: 2,
      filter: (node) => {
        if (node.getAttribute && node.getAttribute('data-no-capture')) return false
        return true
      }
    })
    
    // 2. Drop into slot animation
    // Start animation immediately after snapshot
    isDropping.value = true
    
    // Wait for animation to fully "swallow" the card
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Ensure download is finished if it took longer than the animation
    await downloadPromise
    
    // 3. Auto close modal after animation
    emit('close')
    
  } catch (error) {
    console.error('Failed to save image:', error)
    alert('保存失败，请重试')
  } finally {
    isFlashing.value = false
    isDropping.value = false
    isSaving.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .share-card {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .share-card {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.share-card {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.share-card.is-dropping {
  transform: translateY(185px) scale(0.55) rotateX(-35deg);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.5, 0, 0.75, 0);
  z-index: 10001; /* Stay behind the front panel (10010) but above background */
}

@keyframes flash {
  0% { opacity: 1; }
  10% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
