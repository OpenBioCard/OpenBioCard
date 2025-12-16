<template>
  <div style="padding: 0 2rem 2rem 2rem;">
    <div style="background: rgba(249, 250, 251, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; padding: 2rem; border: 1px solid rgba(229, 231, 235, 0.8);">
      <h4 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
        <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        {{ $t('projects.manage') }}
      </h4>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div
          v-for="(project, index) in projects"
          :key="index"
          style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8);"
        >
          <div style="display: flex; gap: 1rem;">
            <!-- Logo 上传区域 -->
            <div style="flex-shrink: 0;">
              <div v-if="isBase64Image(project.logo)" style="width: 5rem; height: 5rem; border-radius: 0.75rem; overflow: hidden; border: 2px solid #e5e7eb;">
                <img :src="project.logo" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div v-else style="width: 5rem; height: 5rem; border-radius: 0.75rem; background: #f3f4f6; display: flex; align-items: center; justify-content: center; border: 2px dashed #d1d5db;">
                <svg style="width: 2rem; height: 2rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                :data-logo-index="index"
                style="position: absolute; opacity: 0; width: 0; height: 0;"
                @change="(e) => $emit('upload-logo', e, index)"
              />
              <button
                type="button"
                @click="triggerLogoInput(index)"
                style="width: 5rem; margin-top: 0.5rem; padding: 0.375rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; color: #374151;"
                onmouseover="this.style.borderColor='#000000'; this.style.backgroundColor='#f3f4f6'"
                onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='white'"
              >
                {{ isBase64Image(project.logo) ? $t('projects.changeLogo') : $t('projects.uploadLogo') }}
              </button>
            </div>

            <!-- 项目信息编辑 -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 0.75rem;">
              <input
                :value="project.name"
                @input="$emit('update-name', index, $event.target.value)"
                type="text"
                :placeholder="$t('projects.name')"
                style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s; font-weight: 600;"
                onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
              />
              <input
                :value="project.url"
                @input="$emit('update-url', index, $event.target.value)"
                type="text"
                :placeholder="$t('projects.url')"
                style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s;"
                onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
              />
              <textarea
                :value="project.description"
                @input="$emit('update-description', index, $event.target.value)"
                :placeholder="$t('projects.description')"
                rows="3"
                style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s; resize: vertical; font-family: inherit;"
                onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
              ></textarea>
            </div>

            <!-- 删除按钮 -->
            <button
              @click="$emit('remove', index)"
              style="padding: 0.5rem; color: #ef4444; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: all 0.2s; height: fit-content;"
              onmouseover="this.style.backgroundColor='#fef2f2'; this.style.color='#dc2626'"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='#ef4444'"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 添加项目按钮 -->
        <button
          @click="$emit('add')"
          style="width: 100%; padding: 1rem; border: 2px dashed #d1d5db; border-radius: 0.75rem; color: #000000; background: transparent; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500;"
          onmouseover="this.style.borderColor='#000000'; this.style.backgroundColor='#f9fafb'"
          onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='transparent'"
        >
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>{{ $t('projects.add') }}</span>
        </button>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button
            @click="$emit('save')"
            :disabled="saving"
            style="padding: 0.75rem 1.5rem; background: #000000; color: #ffffff; border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
            onmouseover="this.style.backgroundColor='#374151'; this.style.transform='translateY(-1px)'"
            onmouseout="this.style.backgroundColor='#000000'; this.style.transform='translateY(0)'"
          >
            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  projects: {
    type: Array,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'remove', 'update-name', 'update-url', 'update-description', 'upload-logo', 'save'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const triggerLogoInput = (index) => {
  const input = document.querySelector(`input[data-logo-index="${index}"]`)
  if (input) {
    input.click()
  }
}
</script>
