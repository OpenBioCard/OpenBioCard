<template>
  <div style="padding: 2rem;">
    <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--color-text-primary); margin-bottom: 1.5rem; display: flex; align-items: center;">
      <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      {{ $t('contact.title') }}
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
      <div
        v-for="contact in contacts"
        :key="contact.type"
        @click="$emit('contact-click', contact)"
        style="background: var(--color-bg-overlay); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 0.75rem; padding: 1.5rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); transition: all 0.3s; cursor: pointer;"
        onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'"
      >
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; background: var(--color-bg-tertiary); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
            <img :src="getContactIcon(contact.type)" style="width: 1.5rem; height: 1.5rem;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-weight: 600; color: var(--color-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ getContactLabel(contact.type) }}</h4>
            <p style="color: var(--color-text-tertiary); font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
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
        <div style="width: 4rem; height: 4rem; background: var(--color-bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <svg style="width: 2rem; height: 2rem; color: var(--color-text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <p style="color: var(--color-text-tertiary);">{{ $t('contact.noContacts') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import emailIcon from '/assets/ss/email.svg'
import phoneIcon from '/assets/ss/tel.svg'
import wechatIcon from '/assets/ss/wechat.svg'
import qqIcon from '/assets/ss/QQ.svg'
import whatsappIcon from '/assets/ss/whatsapp.svg'
import telegramIcon from '/assets/ss/telegram.svg'
import discordIcon from '/assets/ss/discord-copy.svg'
import lineIcon from '/assets/ss/line.svg'
import wecomIcon from '/assets/ss/wecom.svg'

const { t } = useI18n()

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
    email: emailIcon,
    phone: phoneIcon,
    wechat: wechatIcon,
    qq: qqIcon,
    whatsapp: whatsappIcon,
    telegram: telegramIcon,
    discord: discordIcon,
    line: lineIcon,
    wecom: wecomIcon
  }
  return iconMap[type] || emailIcon
}

const getContactLabel = (type) => {
  const typeMap = {
    email: 'email',
    phone: 'phone',
    wechat: 'wechat',
    qq: 'qq',
    whatsapp: 'whatsapp',
    telegram: 'telegram',
    discord: 'discord',
    line: 'line',
    wecom: 'wechat_work'
  }
  return t(`contact.types.${typeMap[type] || type}`)
}
</script>
