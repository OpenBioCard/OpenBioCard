<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%);">
    <!-- 导航栏 -->
    <nav style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 50;">
      <div style="max-width: 1152px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2rem; height: 2rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 0.875rem;">O</span>
            </div>
            <h1 style="font-size: 1.25rem; font-weight: bold; background: linear-gradient(90deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              OpenBioCard
            </h1>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span v-if="currentUser" style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">
              欢迎，{{ currentUser.username }}
            </span>
            <button
              v-if="currentUser"
              @click="logout"
              style="font-size: 0.875rem; padding: 0.375rem 0.75rem; color: #6b7280; border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent;"
              onmouseover="this.style.backgroundColor='#f3f4f6'; this.style.color='#111827'"
              onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6b7280'"
            >
              退出登录
            </button>
            <a
              v-else
              href="/"
              style="font-size: 0.875rem; padding: 0.375rem 0.75rem; background: #3b82f6; color: white; border-radius: 0.375rem; text-decoration: none; transition: background-color 0.2s;"
              onmouseover="this.style.backgroundColor='#2563eb'"
              onmouseout="this.style.backgroundColor='#3b82f6'"
            >
              登录
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main style="max-width: 1152px; margin: 0 auto; padding: 2rem 1rem;">
      <div style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid #e5e7eb; overflow: hidden;">
        <!-- 头部横幅 -->
        <div style="height: 8rem; position: relative; overflow: hidden;">
          <div
            v-if="isBase64Image(profileData.background)"
            style="width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;"
            :style="{ backgroundImage: `url(${profileData.background})` }"
          ></div>
          <div
            v-else
            style="width: 100%; height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);"
          ></div>
          <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.1);"></div>
        </div>

        <!-- 主要内容区域 -->
        <div style="padding: 2rem;">
          <!-- 用户头像和基本信息 -->
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: -4rem; position: relative; z-index: 10;">
            <div style="position: relative;">
              <div style="width: 8rem; height: 8rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: bold; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25); border: 4px solid white; overflow: hidden;">
                <template v-if="isBase64Image(profileData.avatar)">
                  <img :src="profileData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                </template>
                <template v-else>
                  {{ profileData.avatar || profileData.username.charAt(0).toUpperCase() }}
                </template>
              </div>
              <!-- 编辑按钮 - 更明显 -->
              <button
                v-if="canEdit"
                @click="editMode = !editMode"
                style="position: absolute; bottom: -0.5rem; right: -0.5rem; width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 50%; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; transform: scale(1);"
                onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 20px 25px -5px rgba(0, 0, 0, 0.1)'"
                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'"
              >
                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
            </div>
            <div style="flex: 1; padding-top: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                <h2 style="font-size: 1.875rem; font-weight: bold; color: #111827;">{{ profileData.name || profileData.username }}</h2>
                <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; font-size: 0.875rem; font-weight: 500; border-radius: 9999px;">
                  @{{ profileData.username }}
                </span>
              </div>
              <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 1rem; line-height: 1.75;">{{ profileData.bio || '这个人很懒，还没有写简介...' }}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
                <span v-if="profileData.location" style="display: flex; align-items: center; gap: 0.25rem;">
                  📍 {{ profileData.location }}
                </span>
                <span v-if="profileData.website" style="display: flex; align-items: center; gap: 0.25rem;">
                  🌐 <a :href="profileData.website" target="_blank" style="color: #3b82f6; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ profileData.website }}</a>
                </span>
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <div v-if="editMode && canEdit" style="margin-top: 2rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(90deg, #eff6ff, #f3e8ff); border-radius: 1rem; padding: 2rem; border: 1px solid #bfdbfe;">
              <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                编辑个人资料
              </h3>
              <form @submit.prevent="saveProfile" style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">姓名</label>
                    <input
                      v-model="editData.name"
                      type="text"
                      style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
                      placeholder="请输入姓名"
                      onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)'"
                      onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                    />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">头像</label>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                      <div style="width: 4rem; height: 4rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; border: 2px solid white; overflow: hidden;">
                        <template v-if="isBase64Image(editData.avatar)">
                          <img :src="editData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                        </template>
                        <template v-else>
                          {{ editData.avatar || profileData.username.charAt(0).toUpperCase() }}
                        </template>
                      </div>
                      <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                        <input
                          v-model="editData.avatar"
                          type="text"
                          style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
                          placeholder="请输入头像字符或emoji"
                          onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)'"
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
                    v-model="editData.bio"
                    rows="4"
                    style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; resize: none; transition: all 0.2s;"
                    placeholder="请输入个人简介"
                    onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)'"
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
                          style="width: 100%; height: 100%; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white;"
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
                          @click="editData.background = ''"
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
                      v-model="editData.location"
                      type="text"
                      style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
                      placeholder="请输入位置"
                      onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)'"
                      onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                    />
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151;">网站</label>
                    <input
                      v-model="editData.website"
                      type="text"
                      style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.75rem; outline: none; transition: all 0.2s;"
                      placeholder="请输入网站链接"
                      onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)'"
                      onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                    />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem;">
                  <button
                    type="button"
                    @click="cancelEdit"
                    style="padding: 0.75rem 1.5rem; color: #374151; background: white; border: 1px solid #d1d5db; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500;"
                    onmouseover="this.style.backgroundColor='#f9fafb'"
                    onmouseout="this.style.backgroundColor='white'"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
                  >
                    {{ saving ? '保存中...' : '保存资料' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 联系方式 -->
          <div style="margin-top: 2rem;">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
              <svg style="width: 1.5rem; height: 1.5rem; margin-right: 0.75rem; color: #8b5cf6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              联系方式
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
              <div
                v-for="contact in profileData.contacts"
                :key="contact.type"
                style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; transition: all 0.3s; cursor: pointer;"
                onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 25px -5px rgba(0, 0, 0, 0.1)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
              >
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">
                    {{ getContactIcon(contact.type) }}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <h4 style="font-weight: 600; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ getContactLabel(contact.type) }}</h4>
                    <p style="color: #6b7280; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ contact.value }}</p>
                  </div>
                </div>
              </div>
              <!-- 空状态 -->
              <div v-if="profileData.contacts.length === 0" style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
                <div style="width: 4rem; height: 4rem; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                  <svg style="width: 2rem; height: 2rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p style="color: #9ca3af;">暂无联系方式</p>
              </div>
            </div>
          </div>

          <!-- 编辑联系方式 -->
          <div v-if="editMode && canEdit" style="margin-top: 2rem;">
            <div style="background: linear-gradient(90deg, #faf5ff, #fdf2f8); border-radius: 1rem; padding: 2rem; border: 1px solid #e9d5ff;">
              <h4 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; color: #8b5cf6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                管理联系方式
              </h4>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div
                  v-for="(contact, index) in editData.contacts"
                  :key="index"
                  style="display: flex; align-items: center; gap: 1rem; background: white; border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;"
                >
                  <select
                    v-model="contact.type"
                    style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; background: white; transition: all 0.2s;"
                    onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'"
                    onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                  >
                    <option value="email">📧 邮箱</option>
                    <option value="phone">📱 电话</option>
                    <option value="wechat">💬 微信</option>
                    <option value="github">🐙 GitHub</option>
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="twitter">🐦 Twitter</option>
                  </select>
                  <input
                    v-model="contact.value"
                    type="text"
                    style="flex: 1; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s;"
                    :placeholder="`请输入${getContactLabel(contact.type)}`"
                    onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'"
                    onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
                  />
                  <button
                    @click="removeContact(index)"
                    style="padding: 0.5rem; color: #ef4444; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: all 0.2s;"
                    onmouseover="this.style.backgroundColor='#fef2f2'; this.style.color='#dc2626'"
                    onmouseout="this.style.backgroundColor='transparent'; this.style.color='#ef4444'"
                  >
                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addContact"
                  style="width: 100%; padding: 1rem; border: 2px dashed #d8b4fe; border-radius: 0.75rem; color: #8b5cf6; background: transparent; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500;"
                  onmouseover="this.style.borderColor='#c084fc'; this.style.backgroundColor='#faf5ff'"
                  onmouseout="this.style.borderColor='#d8b4fe'; this.style.backgroundColor='transparent'"
                >
                  <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span>添加联系方式</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

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
  contacts: []
})

// 编辑状态
const editMode = ref(false)
const saving = ref(false)
const editData = ref({ ...profileData.value })

// 文件输入引用
const fileInput = ref(null)
const backgroundInput = ref(null)

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

// 获取联系方式图标
const getContactIcon = (type) => {
  const icons = {
    email: '📧',
    phone: '📱',
    wechat: '💬',
    github: '🐙',
    linkedin: '💼',
    twitter: '🐦'
  }
  return icons[type] || '📞'
}

// 获取联系方式标签
const getContactLabel = (type) => {
  const labels = {
    email: '邮箱',
    phone: '电话',
    wechat: '微信',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    twitter: 'Twitter'
  }
  return labels[type] || type
}

// 加载用户资料
const loadProfile = async () => {
  try {
    const response = await fetch(`/user/${username}`)
    if (response.ok) {
      const data = await response.json()
      profileData.value = { ...profileData.value, ...data }
      editData.value = { ...profileData.value }
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

// 处理头像上传
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件大小（最大2MB）
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过2MB')
    return
  }

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.avatar = e.target.result // base64数据
  }
  reader.readAsDataURL(file)
}

// 处理背景上传
const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 检查文件大小（最大3MB）
  if (file.size > 3 * 1024 * 1024) {
    alert('背景图片大小不能超过3MB')
    return
  }

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.background = e.target.result // base64数据
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