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
                    @click="$refs.fileInput.click()"
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
                    @click="$refs.backgroundInput.click()"
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
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem;">
          <button
            type="button"
            @click="$emit('cancel')"
            style="padding: 0.75rem 1.5rem; color: var(--color-text-secondary); background: var(--color-bg-primary); border: 1px solid var(--color-border-secondary); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500;"
            onmouseover="this.style.backgroundColor='var(--color-bg-secondary)'"
            onmouseout="this.style.backgroundColor='var(--color-bg-primary)'"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: var(--color-text-inverse); border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; box-shadow: var(--shadow-sm);"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.backgroundColor='var(--color-primary-hover)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.backgroundColor='var(--color-primary)'"
          >
            {{ saving ? $t('common.saving') : $t('profile.saveProfile') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

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

defineEmits(['save', 'cancel', 'update:name', 'update:pronouns', 'update:avatar', 'update:bio', 'update:background', 'update:location', 'update:website', 'avatar-upload', 'background-upload'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert(t('profile.imageTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    alert(t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    defineEmits(['update:avatar'])
    $emit('update:avatar', e.target.result)
  }
  reader.readAsDataURL(file)
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 3 * 1024 * 1024) {
    alert(t('profile.backgroundTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    alert(t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    defineEmits(['update:background'])
    $emit('update:background', e.target.result)
  }
  reader.readAsDataURL(file)
}
</script>
