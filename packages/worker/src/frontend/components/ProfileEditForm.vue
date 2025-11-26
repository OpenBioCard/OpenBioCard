<template>
  <div style="margin-top: 2rem; margin-bottom: 2rem;">
    <div style="background: rgba(249, 250, 251, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; padding: 2rem; border: 1px solid rgba(229, 231, 235, 0.8);">
      <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
        <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        编辑个人资料
      </h3>
      <form @submit.prevent="$emit('save')" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">姓名</label>
            <input
              :value="editData.name"
              @input="$emit('update:name', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
              placeholder="请输入姓名"
              onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">头像</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 4rem; height: 4rem; background: #000000; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; border: 2px solid white; overflow: hidden;">
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
                  style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
                  placeholder="请输入头像字符或emoji"
                  onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
                  onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
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
                    style="width: 100%; padding: 0.5rem 1rem; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: #374151;"
                    onmouseover="this.style.backgroundColor='#e5e7eb'"
                    onmouseout="this.style.backgroundColor='#f3f4f6'"
                  >
                    📷 上传图片
                  </button>
                </div>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">支持字符、emoji或上传图片（最大2MB）</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">简介</label>
          <textarea
            :value="editData.bio"
            @input="$emit('update:bio', $event.target.value)"
            rows="4"
            style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; resize: none; transition: all 0.2s;"
            placeholder="请输入个人简介"
            onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
            onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
          ></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">背景图片</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div style="width: 6rem; height: 3rem; border-radius: 0.5rem; overflow: hidden; border: 2px solid #e5e7eb;">
                <div
                  v-if="isBase64Image(editData.background)"
                  style="width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;"
                  :style="{ backgroundImage: `url(${editData.background})` }"
                ></div>
                <div
                  v-else
                  style="width: 100%; height: 100%; background: #000000; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white;"
                >
                  默认
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
                    style="width: 100%; padding: 0.5rem 1rem; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; color: #374151;"
                    onmouseover="this.style.backgroundColor='#e5e7eb'"
                    onmouseout="this.style.backgroundColor='#f3f4f6'"
                  >
                    🖼️ 上传背景
                  </button>
                </div>
                <button
                  v-if="editData.background"
                  type="button"
                  @click="$emit('update:background', '')"
                  style="width: 100%; margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; color: #dc2626;"
                  onmouseover="this.style.backgroundColor='#fecaca'"
                  onmouseout="this.style.backgroundColor='#fee2e2'"
                >
                  移除背景
                </button>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">上传背景图片（最大3MB），不上传则使用默认渐变背景</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">位置</label>
            <input
              :value="editData.location"
              @input="$emit('update:location', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
              placeholder="请输入位置"
              onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">网站</label>
            <input
              :value="editData.website"
              @input="$emit('update:website', $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
              placeholder="请输入网站链接"
              onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
            />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem;">
          <button
            type="button"
            @click="$emit('cancel')"
            style="padding: 0.75rem 1.5rem; color: #374151; background: white; border: 1px solid #d1d5db; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500;"
            onmouseover="this.style.backgroundColor='#f9fafb'"
            onmouseout="this.style.backgroundColor='white'"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="saving"
            style="padding: 0.75rem 1.5rem; background: #000000; color: white; border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);"
            onmouseover="this.style.transform='translateY(-1px)'; this.style.backgroundColor='#333333'"
            onmouseout="this.style.transform='translateY(0)'; this.style.backgroundColor='#000000'"
          >
            {{ saving ? '保存��...' : '保存资料' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
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

defineEmits(['save', 'cancel', 'update:name', 'update:avatar', 'update:bio', 'update:background', 'update:location', 'update:website', 'avatar-upload', 'background-upload'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
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
    alert('背景图片大小不能超过3MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
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
