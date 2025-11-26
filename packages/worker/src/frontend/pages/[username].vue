<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f9fafb 100%);">
    <!-- 导航栏 -->
    <Navigation :current-user="currentUser" @logout="logout" />

    <!-- 主要内容 -->
    <main style="max-width: 1152px; margin: 0 auto; padding: 2rem 1rem;">
      <div style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8); overflow: hidden;">
        <!-- 资料头部 -->
        <ProfileHeader
          :profile-data="profileData"
          :can-edit="canEdit"
          @toggle-edit="editMode = !editMode"
        />

        <!-- 编辑模式 -->
        <ProfileEditForm
          v-if="editMode && canEdit"
          :edit-data="editData"
          :username="username"
          :saving="saving"
          @save="saveProfile"
          @cancel="cancelEdit"
          @update:name="editData.name = $event"
          @update:avatar="editData.avatar = $event"
          @update:bio="editData.bio = $event"
          @update:background="editData.background = $event"
          @update:location="editData.location = $event"
          @update:website="editData.website = $event"
        />

        <!-- 联系方式列表 -->
        <ContactList
          :contacts="profileData.contacts"
          @contact-click="handleContactClick"
        />

        <!-- 编辑联系方式 -->
        <ContactEdit
          v-if="editMode && canEdit"
          :contacts="editData.contacts"
          @add="addContact"
          @remove="removeContact"
          @update-type="updateContactType"
          @update-value="updateContactValue"
          @upload-qrcode="handleContactUpload"
        />

        <!-- 社交媒体链接列表 -->
        <SocialLinksList
          :social-links="profileData.socialLinks"
        />

        <!-- 编辑社交媒体链接 -->
        <SocialLinksEdit
          v-if="editMode && canEdit"
          :social-links="editData.socialLinks"
          @add="addSocialLink"
          @remove="removeSocialLink"
          @update-type="updateSocialLinkType"
          @update-value="updateSocialLinkValue"
        />

        <!-- 项目列表 -->
        <ProjectsList
          :projects="profileData.projects"
        />

        <!-- 编辑项目 -->
        <ProjectsEdit
          v-if="editMode && canEdit"
          :projects="editData.projects"
          @add="addProject"
          @remove="removeProject"
          @update-name="updateProjectName"
          @update-url="updateProjectUrl"
          @update-description="updateProjectDescription"
          @upload-logo="handleProjectLogoUpload"
        />
      </div>
    </main>

    <!-- 二维码弹窗 -->
    <QRCodeModal
      :show="qrCodeModal.show"
      :image="qrCodeModal.image"
      :label="qrCodeModal.label"
      @close="closeQrCodeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '../components/Navigation.vue'
import ProfileHeader from '../components/ProfileHeader.vue'
import ProfileEditForm from '../components/ProfileEditForm.vue'
import ContactList from '../components/ContactList.vue'
import ContactEdit from '../components/ContactEdit.vue'
import SocialLinksList from '../components/SocialLinksList.vue'
import SocialLinksEdit from '../components/SocialLinksEdit.vue'
import ProjectsList from '../components/ProjectsList.vue'
import ProjectsEdit from '../components/ProjectsEdit.vue'
import QRCodeModal from '../components/QRCodeModal.vue'
import { useSocialLinksData } from '../composables/useGitHubData'

const route = useRoute()
const username = route.params.username

// 用户状态
const currentUser = ref(null)
const token = ref('')

// 资料数据
const profileData = ref({
  username: username,
  name: '',
  avatar: '',
  bio: '',
  location: '',
  website: '',
  background: '',
  contacts: [],
  socialLinks: [],
  projects: []
})

// 编辑状态
const editMode = ref(false)
const saving = ref(false)
const editData = ref({ ...profileData.value })

// 二维码弹窗状态
const qrCodeModal = ref({
  show: false,
  image: '',
  label: ''
})

// 获取cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// 删除cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// 检查是否可以编辑
const canEdit = computed(() => {
  return currentUser.value && currentUser.value.username === username
})

// 检查是否为base64图片
const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

// 获取联系方式标签
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

// 社交媒体链接数据管理
const { fetchAllData: fetchSocialLinksData, initialize: initializeSocialLinks } = useSocialLinksData(profileData)

// 加载用户资料
const loadProfile = async () => {
  try {
    const response = await fetch(`/user/${username}`)
    if (response.ok) {
      const data = await response.json()
      profileData.value = { ...profileData.value, ...data }
      // 确保 socialLinks 和 projects 是数组
      if (!profileData.value.socialLinks) {
        profileData.value.socialLinks = []
      }
      if (!profileData.value.projects) {
        profileData.value.projects = []
      }
      editData.value = { ...profileData.value }
      // 初始化社交媒体链接数据（获取 GitHub 信息并启动定时更新）
      await initializeSocialLinks()
    }
  } catch (error) {
    console.error('加载用户资料失败:', error)
  }
}

// 检查登录状态
const checkLogin = () => {
  const savedToken = getCookie('auth_token')
  const savedUsername = getCookie('auth_username')

  if (savedToken && savedUsername) {
    token.value = savedToken
    currentUser.value = { username: savedUsername, token: savedToken }
  }
}

// 保存资料
const saveProfile = async () => {
  if (!currentUser.value || !token.value) return

  saving.value = true
  try {
    const response = await fetch(`/user/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(editData.value)
    })

    if (response.ok) {
      profileData.value = { ...editData.value }
      editMode.value = false
      alert('保存成功')
    } else {
      alert('保存失败')
    }
  } catch (error) {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  editData.value = { ...profileData.value }
  editMode.value = false
}

// 添加联系方式
const addContact = () => {
  editData.value.contacts.push({ type: 'email', value: '' })
}

// 删除联系方式
const removeContact = (index) => {
  editData.value.contacts.splice(index, 1)
}

// 更新联系方式类型
const updateContactType = (index, type) => {
  editData.value.contacts[index].type = type
}

// 更新联系方式值
const updateContactValue = (index, value) => {
  editData.value.contacts[index].value = value
}

// 处理联系方式上传（二维码）
const handleContactUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('二维码图片大小不能超过2MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.contacts[index].value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 处理联系方式点击
const handleContactClick = (contact) => {
  if (isBase64Image(contact.value)) {
    qrCodeModal.value = {
      show: true,
      image: contact.value,
      label: getContactLabel(contact.type)
    }
  }
}

// 关闭二维码弹窗
const closeQrCodeModal = () => {
  qrCodeModal.value = {
    show: false,
    image: '',
    label: ''
  }
}

// 添加社交媒体链接
const addSocialLink = () => {
  if (!editData.value.socialLinks) {
    editData.value.socialLinks = []
  }
  editData.value.socialLinks.push({ type: 'github', value: '' })
}

// 删除社交媒体链接
const removeSocialLink = (index) => {
  editData.value.socialLinks.splice(index, 1)
}

// 更新社交媒体链接类型
const updateSocialLinkType = (index, type) => {
  editData.value.socialLinks[index].type = type
  // 清除旧的 GitHub 数据
  if (type !== 'github') {
    delete editData.value.socialLinks[index].githubData
  }
}

// 更新社交媒体链接值
const updateSocialLinkValue = async (index, value) => {
  editData.value.socialLinks[index].value = value

  // 如果是 GitHub 链接，立即获取数据
  if (editData.value.socialLinks[index].type === 'github' && value) {
    try {
      const response = await fetch(`https://api.github.com/users/${value}`)
      if (response.ok) {
        const result = await response.json()
        editData.value.socialLinks[index].githubData = {
          login: result.login,
          name: result.name,
          avatar_url: result.avatar_url,
          bio: result.bio,
          location: result.location,
          blog: result.blog,
          twitter_username: result.twitter_username,
          public_repos: result.public_repos,
          followers: result.followers,
          following: result.following,
          created_at: result.created_at,
          updated_at: result.updated_at
        }
      }
    } catch (err) {
      console.error('获取 GitHub 信息失败:', err)
    }
  }
}

// 添加项目
const addProject = () => {
  if (!editData.value.projects) {
    editData.value.projects = []
  }
  editData.value.projects.push({
    name: '',
    url: '',
    description: '',
    logo: ''
  })
}

// 删除项目
const removeProject = (index) => {
  editData.value.projects.splice(index, 1)
}

// 更新项目名称
const updateProjectName = (index, name) => {
  editData.value.projects[index].name = name
}

// 更新项目地址
const updateProjectUrl = (index, url) => {
  editData.value.projects[index].url = url
}

// 更新项目描述
const updateProjectDescription = (index, description) => {
  editData.value.projects[index].description = description
}

// 处理项目 Logo 上传
const handleProjectLogoUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('项目 Logo 大小不能超过 2MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.projects[index].logo = e.target.result
  }
  reader.readAsDataURL(file)
}

// 退出登录
const logout = () => {
  deleteCookie('auth_token')
  deleteCookie('auth_username')
  currentUser.value = null
  token.value = ''
  window.location.href = '/'
}

onMounted(() => {
  checkLogin()
  loadProfile()
})
</script>
