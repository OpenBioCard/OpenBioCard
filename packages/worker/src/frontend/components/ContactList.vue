<template>
  <div style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      联系方式
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div
        v-for="contact in contacts"
        :key="contact.type"
        @click="$emit('contact-click', contact)"
        style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8); transition: all 0.3s; cursor: pointer;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0, 0, 0, 0.1)'"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; background: #f3f4f6; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
            <img :src="getContactIcon(contact.type)" style="width: 1.5rem; height: 1.5rem;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-weight: 600; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ getContactLabel(contact.type) }}</h4>
            <p style="color: #6b7280; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <template v-if="isBase64Image(contact.value)">
                <img :src="contact.value" style="width: 2rem; height: 2rem; object-fit: cover; border-radius: 0.25rem;" />
              </template>
              <template v-else>
                {{ contact.value }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <!-- 空状态 -->
      <div v-if="contacts.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
        <div style="width: 4rem; height: 4rem; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <svg style="width: 2rem; height: 2rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <p style="color: #9ca3af;">暂无联系方式</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  contacts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['contact-click'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const getContactIcon = (type) => {
  const iconMap = {
    email: '/src/frontend/assets/ss/email.svg',
    phone: '/src/frontend/assets/ss/tel.svg',
    wechat: '/src/frontend/assets/ss/wechat.svg',
    qq: '/src/frontend/assets/ss/QQ.svg',
    whatsapp: '/src/frontend/assets/ss/whatsapp.svg',
    telegram: '/src/frontend/assets/ss/telegram.svg',
    discord: '/src/frontend/assets/ss/discord-copy.svg',
    line: '/src/frontend/assets/ss/line.svg',
    wecom: '/src/frontend/assets/ss/wecom.svg'
  }
  return iconMap[type] || '/src/frontend/assets/ss/email.svg'
}

const getContactLabel = (type) => {
  const labels = {
    email: '邮箱',
    phone: '电话',
    wechat: '微信',
    qq: 'QQ',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    discord: 'Discord',
    line: 'Line',
    wecom: '企业微信'
  }
  return labels[type] || type
}
</script>
