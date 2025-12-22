# OpenBioCard API 文档

## 目录

- [OpenBioCard API 文档](#openbiocard-api-文档)
  - [目录](#目录)
  - [概述](#概述)
  - [认证机制](#认证机制)
    - [Token 认证](#token-认证)
    - [Token 生成](#token-生成)
  - [用户类型](#用户类型)
  - [错误响应](#错误响应)
    - [HTTP 状态码](#http-状态码)
  - [API 端点](#api-端点)
    - [认证相关](#认证相关)
      - [1. 用户注册](#1-用户注册)
      - [2. 用户登录](#2-用户登录)
      - [3. 删除账号](#3-删除账号)
    - [用户资料](#用户资料)
      - [4. 获取用户资料](#4-获取用户资料)
      - [5. 更新用户资料](#5-更新用户资料)
      - [6. 导出用户数据](#6-导出用户数据)
      - [7. 导入用户数据](#7-导入用户数据)
    - [管理员功能](#管理员功能)
      - [8. 检查权限](#8-检查权限)
      - [9. 获取用户列表（POST）](#9-获取用户列表post)
      - [10. 获取用户列表（GET）](#10-获取用户列表get)
      - [11. 创建用户](#11-创建用户)
      - [12. 删除用户](#12-删除用户)
    - [系统设置](#系统设置)
      - [13. 获取公开系统设置](#13-获取公开系统设置)
      - [14. 获取完整系统设置（管理员）](#14-获取完整系统设置管理员)
      - [15. 更新系统设置](#15-更新系统设置)
    - [系统初始化与信息](#系统初始化与信息)
      - [16. 初始化管理员](#16-初始化管理员)
      - [17. 获取 API 信息](#17-获取-api-信息)
  - [数据存储说明](#数据存储说明)
    - [Durable Objects](#durable-objects)
    - [数据一致性](#数据一致性)
  - [环境变量](#环境变量)
  - [前端路由](#前端路由)
    - [页面路由](#页面路由)
  - [安全说明](#安全说明)
  - [版本信息](#版本信息)
  - [联系方式](#联系方式)

---

## 概述

OpenBioCard 后端基于 **Cloudflare Workers** 和 **Hono** 框架构建，使用 **Durable Objects** 进行数据持久化存储。

**基础信息：**
- 基础 URL: `https://your-worker.your-subdomain.workers.dev/api`
- 内容类型: `application/json`
- 编码: `UTF-8`

---

## 认证机制

### Token 认证

API 使用两种方式传递认证 Token：

1. **请求体方式**（推荐用于 POST 请求）：
```json
{
  "username": "user123",
  "token": "your-token-here",
  ...
}
```

2. **Header 方式**（推荐用于 GET/DELETE 请求）：
```
Authorization: Bearer your-token-here
```

### Token 生成

- 用户注册时自动生成 UUID 格式的 Token
- Root 用户登录时生成 `root-{UUID}` 格式的 Token
- Token 在用户整个生命周期内保持不变

---

## 用户类型

系统支持三种用户类型：

| 类型 | 说明 | 权限 |
|------|------|------|
| `root` | 超级管理员 | 完全控制权限，通过环境变量配置 |
| `admin` | 系统管理员 | 可管理普通用户，创建/删除用户 |
| `user` | 普通用户 | 仅能管理自己的资料 |

---

## 错误响应

所有错误响应遵循统一格式：

```json
{
  "error": "错误描述信息"
}
```

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| `200` | 请求成功 |
| `401` | 未授权 - Token 无效或缺失 |
| `403` | 禁止访问 - 权限不足 |
| `404` | 资源不存在 |
| `409` | 冲突 - 资源已存在 |
| `500` | 服务器内部错误 |
| `503` | 服务暂时不可用 |

---

## API 端点

### 认证相关

#### 1. 用户注册

创建新用户账号。

**端点:** `POST /api/signup/create`

**请求体:**
```json
{
  "username": "newuser",
  "password": "securepassword123",
  "type": "user"
}
```

**参数说明:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名，唯一标识 |
| `password` | string | 是 | 密码，会被哈希存储 |
| `type` | string | 是 | 用户类型：`user` 或 `admin` |

**成功响应:** `200 OK`
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**错误响应:**
- `500` - 创建账号失败
- `503` - 服务暂时不可用

---

#### 2. 用户登录

验证用户凭据并返回 Token。支持 POST 和 GET 两种方式。

**端点:** `POST /api/signin` 或 `GET /api/signin`

**POST 请求体 / GET 查询参数:**
```json
{
  "username": "existinguser",
  "password": "securepassword123"
}
```

**参数说明:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**成功响应:** `200 OK`
```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**特殊说明:**
- 使用 GET 方式时，参数通过 URL 查询字符串传递：`/api/signin?username=...&password=...`
- Root 用户使用环境变量 `ROOT_USERNAME` 和 `ROOT_PASSWORD` 进行认证
- Root 用户返回的 Token 格式为 `root-{UUID}`

**错误响应:**
- `401` - 用户名或密码错误
- `503` - 服务暂时不可用

---

#### 3. 删除账号

删除当前登录用户的账号及所有相关资料。

**端点:** `POST /api/delete`

**需要认证:** 是

**请求体:**
```json
{
  "username": "currentuser",
  "token": "your-token-here"
}
```

**成功响应:** `200 OK`
```json
{
  "message": "Account deleted successfully"
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `500` - 删除失败
- `503` - 服务暂时不可用

---

### 用户资料

#### 4. 获取用户资料

获取指定用户的公开资料信息。

**端点:** `GET /api/user/:username`

**需要认证:** 否（公开接口）

**URL 参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 要查询的用户名 |

**成功响应:** `200 OK`
```json
{
  "username": "johndoe",
  "name": "John Doe",
  "pronouns": "he/him",
  "avatar": "👨",
  "bio": "Full-stack developer",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com",
  "background": "",
  "currentCompany": "Tech Corp",
  "currentCompanyLink": "https://techcorp.com",
  "currentSchool": "University of Tech",
  "currentSchoolLink": "https://uni.edu",
  "contacts": [
    {
      "type": "email",
      "value": "john@example.com"
    },
    {
      "type": "wechat",
      "value": "data:image/png;base64,..."
    }
  ],
  "socialLinks": [
    {
      "type": "github",
      "value": "johndoe",
      "githubData": {
        "login": "johndoe",
        "name": "John Doe",
        "avatar_url": "https://avatars.githubusercontent.com/u/...",
        "bio": "Developer",
        "followers": 100,
        "public_repos": 50
      }
    }
  ],
  "projects": [
    {
      "name": "My Awesome Project",
      "url": "https://github.com/johndoe/project",
      "description": "A cool project",
      "logo": "data:image/png;base64,..."
    }
  ],
  "workExperiences": [
    {
      "position": "Senior Developer",
      "company": "Tech Corp",
      "companyLink": "https://techcorp.com",
      "startDate": "2020-01-01",
      "endDate": "",
      "description": "Leading the frontend team.",
      "logo": "data:image/png;base64,..."
    }
  ],
  "schoolExperiences": [
    {
      "degree": "Bachelor of Science",
      "school": "University of Tech",
      "schoolLink": "https://uni.edu",
      "major": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-06-30",
      "description": "Graduated with honors.",
      "logo": "data:image/png;base64,..."
    }
  ],
  "gallery": [
    {
      "image": "data:image/jpeg;base64,...",
      "caption": "Beautiful sunset"
    }
  ]
}
```

**字段说明:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `username` | string | 用户名 |
| `name` | string | 显示名称 |
| `userType` | string | 账户类型：`personal` (个人), `company` (公司), `organization` (组织) |
| `pronouns` | string | 人称代词（如：he/him, she/her, they/them） |
| `avatar` | string | 头像（字符、emoji 或 base64 图片） |
| `bio` | string | 个人简介 |
| `location` | string | 所在地 |
| `website` | string | 个人网站 |
| `background` | string | 背景图片（base64） |
| `currentCompany` | string | 当前就职公司 |
| `currentCompanyLink` | string | 当前就职公司链接 |
| `currentSchool` | string | 当前就读学校 |
| `currentSchoolLink` | string | 当前就读学校链接 |
| `contacts` | array | 联系方式列表 |
| `socialLinks` | array | 社交媒体链接列表 |
| `projects` | array | 项目列表 |
| `workExperiences` | array | 工作经历列表 |
| `schoolExperiences` | array | 教育经历列表 |
| `gallery` | array | 相册照片列表 |

**contacts 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 联系方式类型：`email`, `phone`, `wechat`, `qq`, `whatsapp`, `telegram`, `discord`, `line`, `wecom` |
| `value` | string | 联系方式值（文本或 base64 二维码图片） |

**socialLinks 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 平台类型：`github`, `twitter`, `facebook`, `instagram`, `youtube`, `bilibili`, `xiaohongshu`, `weibo`, `threads`, `huggingface`, `steam`, `spotify`, `qqmusic`, `neteasemusic`, `kugoumusic` |
| `value` | string | 用户名或链接 |
| `githubData` | object | （仅 GitHub）包含头像、粉丝数等信息 |

**projects 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 项目名称 |
| `url` | string | 项目链接 |
| `description` | string | 项目描述 |
| `logo` | string | 项目 Logo（base64 图片） |

**workExperiences 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `position` | string | 职位 |
| `company` | string | 公司名称 |
| `companyLink` | string | 公司链接 |
| `startDate` | string | 开始日期 (YYYY-MM-DD) |
| `endDate` | string | 结束日期 (YYYY-MM-DD)，为空表示至今 |
| `description` | string | 工作描述 |
| `logo` | string | 公司 Logo（base64 图片） |

**schoolExperiences 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `degree` | string | 学位 |
| `school` | string | 学校名称 |
| `schoolLink` | string | 学校链接 |
| `major` | string | 专业 |
| `startDate` | string | 开始日期 (YYYY-MM-DD) |
| `endDate` | string | 结束日期 (YYYY-MM-DD)，为空表示至今 |
| `description` | string | 经历描述 |
| `logo` | string | 学校 Logo（base64 图片） |

**gallery 对象结构:**

| 字段 | 类型 | 说明 |
|------|------|------|
| `image` | string | 照片（base64） |
| `caption` | string | 图片说明 |

**错误响应:**
- `404` - 用户不存在
- `500` - 服务器内部错误

---

#### 5. 更新用户资料

更新当前登录用户的资料信息。

**端点:** `POST /api/user/:username`

**需要认证:** 是（必须是资料所有者）

**URL 参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 要更新的用户名（必须与 Token 匹配） |

**认证方式:**
```
Authorization: Bearer your-token-here
```

**请求体:**
```json
{
  "username": "johndoe",
  "name": "John Doe Updated",
  "userType": "personal",
  "pronouns": "he/him",
  "avatar": "👨‍💻",
  "bio": "Updated bio",
  "location": "New York",
  "website": "https://newwebsite.com",
  "background": "data:image/png;base64,...",
  "currentCompany": "New Tech Corp",
  "currentCompanyLink": "https://newtech.com",
  "currentSchool": "",
  "currentSchoolLink": "",
  "contacts": [...],
  "socialLinks": [...],
  "projects": [...],
  "workExperiences": [...],
  "schoolExperiences": [...],
  "gallery": [...]
}
```

**参数说明:**
- 所有字段均为可选
- 提交的数据会完整替换现有资料
- 支持的字段与"获取用户资料"接口返回的字段一致

**成功响应:** `200 OK`
```json
{
  "success": true
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `401` - Token 与用户名不匹配
- `500` - 更新失败

---

#### 6. 导出用户数据

导出当前登录用户的全量数据（包含账号信息和资料信息）。

**端点:** `GET /api/user/:username/export`

**需要认证:** 是（必须是资料所有者）

**URL 参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 要导出的用户名 |

**认证方式:**
```
Authorization: Bearer your-token-here
```

**成功响应:** `200 OK`
```json
{
  "user": {
    "username": "johndoe",
    "type": "user",
    "token": "..."
  },
  "profile": {
    "name": "John Doe",
    "avatar": "👨",
    "bio": "Full-stack developer",
    ...
  }
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `500` - 导出失败

---

#### 7. 导入用户数据

导入用户全量数据，覆盖现有资料。系统会自动保持当前登录使用的 Token。

**端点:** `POST /api/user/:username/import`

**需要认证:** 是（必须是资料所有者）

**URL 参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 要导入的用户名 |

**认证方式:**
```
Authorization: Bearer your-token-here
```

**请求体:**
```json
{
  "user": {
    "username": "johndoe",
    "type": "user",
    "token": "..."
  },
  "profile": {
    "name": "John Doe",
    "avatar": "👨",
    ...
  }
}
```

**成功响应:** `200 OK`
```json
{
  "success": true
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `500` - 导入失败

---

### 管理员功能

所有管理员功能需要 `admin` 或 `root` 权限。

#### 8. 检查权限

验证当前用户的管理员权限。

**端点:** `POST /api/admin/check-permission`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**请求体:**
```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**成功响应:** `200 OK`
```json
{
  "success": true,
  "type": "admin"
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `403` - 权限不足

---

#### 9. 获取用户列表（POST）

获取所有用户列表（POST 方式，供前端使用）。

**端点:** `POST /api/admin/users/list`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**请求体:**
```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**成功响应:** `200 OK`
```json
{
  "users": [
    {
      "username": "user1",
      "type": "user"
    },
    {
      "username": "admin1",
      "type": "admin"
    }
  ]
}
```

**说明:**
- Root 用户不会出现在列表中
- 返回所有非 root 用户

**错误响应:**
- `401` - Token 无效或缺失
- `403` - 权限不足
- `500` - 获取用户列表失败

---

#### 10. 获取用户列表（GET）

获取所有用户列表（GET 方式）。

**端点:** `GET /api/admin/users`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**认证方式:**
```
Authorization: Bearer your-token-here
```

**请求体:**
```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**成功响应:** `200 OK`
```json
{
  "users": [
    {
      "username": "user1",
      "type": "user"
    },
    {
      "username": "admin1",
      "type": "admin"
    }
  ]
}
```

**错误响应:**
- `401` - Token 无效或缺失
- `403` - 权限不足
- `500` - 获取用户列表失败

---

#### 11. 创建用户

创建新用户（仅管理员可用）。

**端点:** `POST /api/admin/users`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**请求体:**
```json
{
  "username": "adminuser",
  "token": "your-admin-token",
  "newUsername": "newuser123",
  "password": "securepassword",
  "type": "user"
}
```

**参数说明:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 当前管理员用户名 |
| `token` | string | 是 | 当前管理员 Token |
| `newUsername` | string | 是 | 新用户的用户名 |
| `password` | string | 是 | 新用户的密码 |
| `type` | string | 是 | 用户类型：`user` 或 `admin` |

**成功响应:** `200 OK`
```json
{
  "message": "User created",
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**限制:**
- 不能创建 `root` 类型的用户
- 用户名必须唯一

**错误响应:**
- `401` - Token 无效或缺失
- `403` - 权限不足
- `403` - 尝试创建 root 用户
- `409` - 用户名已存在
- `500` - 创建失败

---

#### 12. 删除用户

删除指定用户及其所有资料。

**端点:** `DELETE /admin/users/:username`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**URL 参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `username` | string | 要删除的用户名 |

**请求体:**
```json
{
  "username": "adminuser",
  "token": "your-admin-token"
}
```

**成功响应:** `200 OK`
```json
{
  "message": "User deleted"
}
```

**限制:**
- 不能删除自己
- 不能删除 root 用户
- 删除操作会同时清除用户的所有资料数据

**错误响应:**
- `401` - Token 无效或缺失
- `403` - 权限不足
- `403` - 尝试删除自己或 root 用户
- `500` - 删除失败

---

### 系统设置

#### 13. 获取公开系统设置

获取系统的公开配置（如站点标题、Logo 等）。

**端点:** `GET /api/settings`

**需要认证:** 否

**成功响应:** `200 OK`
```json
{
  "title": "OpenBioCard",
  "logo": "data:image/png;base64,...",
  "favicon": "...",
  "footer": "..."
}
```

---

#### 14. 获取完整系统设置（管理员）

获取系统的完整配置。

**端点:** `POST /api/admin/settings`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**成功响应:** `200 OK`
```json
{
  "title": "OpenBioCard",
  "logo": "...",
  "favicon": "...",
  "footer": "...",
  "allowSignup": true,
  ...
}
```

---

#### 15. 更新系统设置

更新系统配置。

**端点:** `POST /api/admin/settings/update`

**需要认证:** 是

**需要权限:** `admin` 或 `root`

**请求体:**
```json
{
  "title": "New Title",
  "logo": "...",
  ...
}
```

**成功响应:** `200 OK`
```json
{
  "success": true
}
```

---

### 系统初始化与信息

#### 16. 初始化管理员

初始化系统，创建默认的 admin 用户。

**端点:** `GET /api/init-admin`

**需要认证:** 否

**成功响应:** `200 OK`
```
Admin initialized
```

**说明:**
- 仅在系统首次部署时使用
- 该端点应在生产环境中禁用或保护

---

#### 17. 获取 API 信息

获取 API 的基本信息和可用端点。

**端点:** `GET /api/`

**需要认证:** 否

**成功响应:** `200 OK`
```json
{
  "message": "OpenBioCard API",
  "version": "1.0.0",
  "endpoints": {
    "auth": ["/signup/create", "/signin", "/delete"],
    "user": ["/user/:username", "/user/:username/export", "/user/:username/import"],
    "admin": ["/admin/users", "/admin/settings", "/init-admin"],
    "system": ["/settings"]
  }
}
```

---

## 数据存储说明

### Durable Objects

系统使用两个 Durable Objects：

1. **UserDO** - 存储单个用户的账号和资料数据
    - 每个用户对应一个独立的 DO 实例
    - 实例 ID 基于用户名生成（`idFromName(username)`）
    - 存储内容：
        - `user`: 账号信息（用户名、密码哈希、Token、类型）
        - `profile`: 资料信息（个人信息、联系方式、社交链接、项目、相册、工作经历、教育经历）

2. **AdminDO** - 存储系统级数据
    - 全局单例，实例名为 `admin-manager`
    - 存储内容：
        - `users`: 所有用户的用户名和类型列表
        - `settings`: 系统全局设置（标题、Logo、SEO 等）
        - `rootToken`: 当前有效的 root 用户 Token

### 数据一致性

- 创建用户：先写入 UserDO，再同步到 AdminDO，失败时回滚
- 删除用户：先删除 UserDO，再同步到 AdminDO
- 资料更新：仅操作 UserDO

---

## 环境变量

需要在 Cloudflare Workers 环境中配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ROOT_USERNAME` | Root 用户名 | `root` |
| `ROOT_PASSWORD` | Root 密码 | `your-secure-password` |
| `USER_DO` | UserDO 绑定 | (自动配置) |
| `ADMIN_DO` | AdminDO 绑定 | (自动配置) |

---

## 前端路由

### 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/frontend` | 登录页面 |
| `/:username` | 用户个人资料页 |

**保留路由名称:**
- `signup`
- `signin`
- `delete`
- `admin`
- `init-admin`
- `frontend`

以上名称不能用作用户名。

---

## 安全说明

1. **密码安全**
    - 所有密码使用 bcrypt 哈希存储
    - 不会以明文形式存储或传输密码

2. **Token 安全**
    - Token 使用 UUID v4 生成
    - 每次请求都需验证 Token 有效性
    - Token 不会过期，但可通过删除账号使其失效

3. **权限控制**
    - 严格的权限检查中间件
    - 用户只能修改自己的资料
    - 管理员操作需要相应权限验证

4. **输入验证**
    - 所有 API 端点都进行输入验证
    - 防止创建 root 用户
    - 防止用户删除自己或 root

---

## 版本信息

- **API 版本:** 1.0
- **最后更新:** 2025-11-26
- **框架版本:**
    - Hono: ^4.10.6
    - Cloudflare Workers
    - Durable Objects

---

## 联系方式

如有问题或建议，请通过项目 GitHub Issues 提交。
