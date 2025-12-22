<template>
  <div style="margin-top: 2rem; margin-bottom: 2rem;">
    <div style="background: var(--color-bg-secondary); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; padding: 2rem; border: 1px solid var(--color-border-tertiary);">
      <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--color-text-primary); margin-bottom: 1.5rem; display: flex; align-items: center;">
        <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        {{ $t('profile.edit') }}
      </h3>
      <form @submit.prevent="$emit('save')" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.name') }}</label>
            <input
              :value="editData.name"
              @input="$emit('update:name', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterName')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.userType') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <select
              :value="editData.userType"
              @change="$emit('update:userType', $event.target.value)"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); cursor: pointer;"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            >
              <option value="">{{ $t('common.notSet') }}</option>
              <option value="personal">{{ $t('profile.accountPersonal') }}</option>
              <option value="company">{{ $t('profile.accountCompany') }}</option>
              <option value="organization">{{ $t('profile.accountOrganization') }}</option>
            </select>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.pronouns') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="editData.pronouns"
              @input="$emit('update:pronouns', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterPronouns')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.avatar') }}</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 4rem; height: 4rem; background: var(--color-primary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: var(--color-text-inverse); font-size: 1.5rem; font-weight: bold; border: 2px solid var(--color-bg-primary); overflow: hidden;">
                <template v-if="isBase64Image(editData.avatar)">
                  <img :src="editData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                </template>
                <template v-else>
                  {{ editData.avatar || username.charAt(0).toUpperCase() }}
                </template>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                <input
                  :value="editData.avatar"
                  @input="$emit('update:avatar', $event.target.value)"
                  type="text"
                  style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
                  :placeholder="$t('profile.enterAvatar')"
                  onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
                  onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
                />
                <div style="position: relative;">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="position: absolute; opacity: 0; width: 0; height: 0;"
                    @change="handleAvatarUpload"
                  />
                  <button
                    type="button"
                    @click="triggerFileInput"
                    style="width: 100%; padding: 0.5rem 1rem; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: var(--color-text-secondary);"
                    onmouseover="this.style.backgroundColor='var(--color-border-primary)'"
                    onmouseout="this.style.backgroundColor='var(--color-bg-tertiary)'"
                  >
                    {{ $t('profile.uploadImage') }}
                  </button>
                </div>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: var(--color-text-tertiary); margin: 0;">{{ $t('profile.avatarHelp') }}</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.bio') }}</label>
          <textarea
            :value="editData.bio"
            @input="$emit('update:bio', $event.target.value)"
            rows="4"
            style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; resize: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
            :placeholder="$t('profile.enterBio')"
            onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
            onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
          ></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.backgroundImage') }}</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 6rem; height: 3rem; border-radius: 0.5rem; overflow: hidden; border: 2px solid var(--color-border-primary);">
                <div
                  v-if="isBase64Image(editData.background)"
                  style="width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;"
                  :style="{ backgroundImage: `url(${editData.background})` }"
                ></div>
                <div
                  v-else
                  style="width: 100%; height: 100%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--color-text-inverse);"
                >
                  {{ $t('common.default') }}
                </div>
              </div>
              <div style="flex: 1;">
                <div style="position: relative;">
                  <input
                    ref="backgroundInput"
                    type="file"
                    accept="image/*"
                    style="position: absolute; opacity: 0; width: 0; height: 0;"
                    @change="handleBackgroundUpload"
                  />
                  <button
                    type="button"
                    @click="triggerBackgroundInput"
                    style="width: 100%; padding: 0.5rem 1rem; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: var(--color-text-secondary);"
                    onmouseover="this.style.backgroundColor='var(--color-border-primary)'"
                    onmouseout="this.style.backgroundColor='var(--color-bg-tertiary)'"
                  >
                    {{ $t('profile.uploadBackground') }}
                  </button>
                </div>
                <button
                  v-if="editData.background"
                  type="button"
                  @click="$emit('update:background', '')"
                  style="width: 100%; margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: var(--color-danger-bg); border: 1px solid var(--color-danger-light); border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; color: var(--color-danger);"
                  onmouseover="this.style.backgroundColor='var(--color-danger-light)'"
                  onmouseout="this.style.backgroundColor='var(--color-danger-bg)'"
                >
                  {{ $t('profile.removeBackground') }}
                </button>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: var(--color-text-tertiary); margin: 0;">{{ $t('profile.backgroundHelp') }}</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.location') }}</label>
            <input
              :value="editData.location"
              @input="$emit('update:location', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterLocation')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.website') }}</label>
            <input
              :value="editData.website"
              @input="$emit('update:website', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterWebsite')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.currentCompany') }}</label>
            <input
              :value="editData.currentCompany"
              @input="$emit('update:currentCompany', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterCurrentCompany')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.currentCompanyLink') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="editData.currentCompanyLink"
              @input="$emit('update:currentCompanyLink', $event.target.value)"
              type="url"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterCurrentCompanyLink')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.currentSchool') }}</label>
            <input
              :value="editData.currentSchool"
              @input="$emit('update:currentSchool', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterCurrentSchool')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">{{ $t('profile.currentSchoolLink') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="editData.currentSchoolLink"
              @input="$emit('update:currentSchoolLink', $event.target.value)"
              type="url"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary);"
              :placeholder="$t('profile.enterCurrentSchoolLink')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
        </div>
        
        <!-- 账户数据导出导入 -->
        <div style="margin-top: 1rem; padding: 1.5rem; background: var(--color-bg-tertiary); border-radius: 0.75rem; border: 1px dashed var(--color-border-secondary);">
          <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 1rem; display: flex; align-items: center;">
            <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4"></path>
            </svg>
            {{ $t('data.export') }} / {{ $t('data.import') }}
          </h4>
          <div style="display: flex; gap: 1rem;">
            <button
              type="button"
              @click="$emit('export-data')"
              style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--color-bg-primary); border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500;"
              onmouseover="this.style.backgroundColor='var(--color-bg-secondary)'; this.style.borderColor='var(--color-primary)'"
              onmouseout="this.style.backgroundColor='var(--color-bg-primary)'; this.style.borderColor='var(--color-border-secondary)'"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              {{ $t('data.export') }}
            </button>
            <div style="flex: 1; position: relative;">
              <input
                ref="importInput"
                type="file"
                accept=".json"
                style="position: absolute; opacity: 0; width: 0; height: 0;"
                @change="handleImportFile"
              />
              <button
                type="button"
                @click="triggerImportInput"
                style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--color-bg-primary); border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500;"
                onmouseover="this.style.backgroundColor='var(--color-bg-secondary)'; this.style.borderColor='var(--color-primary)'"
                onmouseout="this.style.backgroundColor='var(--color-bg-primary)'; this.style.borderColor='var(--color-border-secondary)'"
              >
                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                {{ $t('data.import') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- 通知弹窗 -->
    <NotificationModal
      :show="notificationModal.show"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :message="notificationModal.message"
      :details="notificationModal.details"
      @close="closeNotificationModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NotificationModal from './NotificationModal.vue'

const { t } = useI18n()

defineProps({
  editData: {
    type: Object,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel', 'update:name', 'update:pronouns', 'update:avatar', 'update:bio', 'update:background', 'update:location', 'update:website', 'update:currentCompany', 'update:currentCompanyLink', 'update:currentSchool', 'update:currentSchoolLink', 'avatar-upload', 'background-upload', 'export-data', 'import-data'])

const fileInput = ref(null)
const backgroundInput = ref(null)
const importInput = ref(null)

const triggerImportInput = () => {
  importInput.value.click()
}

const handleImportFile = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (confirm(t('data.importConfirm'))) {
        emit('import-data', data)
      }
    } catch (err) {
      showNotification('error', t('data.importFailed'), err.message)
    }
    // 重置 input 以允许再次导入相同文件
    event.target.value = ''
  }
  reader.readAsText(file)
}

// 通知弹窗状态
const notificationModal = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  details: ''
})

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

// 关闭通知弹窗
const closeNotificationModal = () => {
  notificationModal.value = {
    show: false,
    type: 'info',
    title: '',
    message: '',
    details: ''
  }
}

// 显示通知弹窗
const showNotification = (type, title, message, details = '') => {
  notificationModal.value = {
    show: true,
    type,
    title,
    message,
    details
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const triggerBackgroundInput = () => {
  if (backgroundInput.value) {
    backgroundInput.value.click()
  }
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('profile.imageTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:avatar', e.target.result)
  }
  reader.onerror = (e) => {
    console.error('File reading error:', e)
    showNotification('error', t('common.tips'), t('profile.uploadError'), e.message || String(e))
  }
  reader.readAsDataURL(file)
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('profile.backgroundTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:background', e.target.result)
  }
  reader.onerror = (e) => {
    console.error('File reading error:', e)
    showNotification('error', t('common.tips'), t('profile.uploadError'), e.message || String(e))
  }
  reader.readAsDataURL(file)
}

</script>
