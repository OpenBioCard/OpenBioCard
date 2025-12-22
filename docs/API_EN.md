# OpenBioCard API Documentation

## Table of Contents

- [OpenBioCard API Documentation](#openbiocard-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Authentication](#authentication)
    - [Token Authentication](#token-authentication)
    - [Token Generation](#token-generation)
  - [User Types](#user-types)
  - [Error Responses](#error-responses)
    - [HTTP Status Codes](#http-status-codes)
  - [API Endpoints](#api-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
      - [1. User Registration](#1-user-registration)
      - [2. User Login](#2-user-login)
      - [3. Delete Account](#3-delete-account)
    - [User Profile](#user-profile)
      - [4. Get User Profile](#4-get-user-profile)
      - [5. Update User Profile](#5-update-user-profile)
      - [6. Export User Data](#6-export-user-data)
      - [7. Import User Data](#7-import-user-data)
    - [Admin Functions](#admin-functions)
      - [8. Check Permissions](#8-check-permissions)
      - [9. Get User List (POST)](#9-get-user-list-post)
      - [10. Get User List (GET)](#10-get-user-list-get)
      - [11. Create User](#11-create-user)
      - [12. Delete User](#12-delete-user)
    - [System Settings](#system-settings)
      - [13. Get Public System Settings](#13-get-public-system-settings)
      - [14. Get Full System Settings (Admin)](#14-get-full-system-settings-admin)
      - [15. Update System Settings](#15-update-system-settings)
    - [System Initialization \& Info](#system-initialization--info)
      - [16. Initialize Admin](#16-initialize-admin)
      - [17. Get API Information](#17-get-api-information)
  - [Data Storage](#data-storage)
    - [Durable Objects](#durable-objects)
    - [Data Consistency](#data-consistency)
  - [Environment Variables](#environment-variables)
  - [Frontend Routes](#frontend-routes)
    - [Page Routes](#page-routes)
  - [Security](#security)
  - [Version Information](#version-information)
  - [Contact](#contact)

---

## Overview

OpenBioCard backend is built on **Cloudflare Workers** and **Hono** framework, using **Durable Objects** for data persistence.

**Basic Information:**

- Base URL: `https://your-worker.your-subdomain.workers.dev/api`
- Content Type: `application/json`
- Encoding: `UTF-8`

---

## Authentication

### Token Authentication

The API supports two methods for passing authentication tokens:

1. **Request Body Method** (recommended for POST requests):

```json
{
  "username": "user123",
  "token": "your-token-here",
  ...
}
```

2. **Header Method** (recommended for GET/DELETE requests):

```http
Authorization: Bearer your-token-here
```

### Token Generation

- Tokens are automatically generated in UUID format during user registration
- Root user login generates tokens in `root-{UUID}` format
- Tokens remain valid throughout the user's lifetime

---

## User Types

The system supports three user types:

| Type | Description | Permissions |
|------|-------------|-------------|
| `root` | Super Administrator | Full control, configured via environment variables |
| `admin` | System Administrator | Can manage regular users, create/delete users |
| `user` | Regular User | Can only manage their own profile |

---

## Error Responses

All error responses follow a uniform format:

```json
{
  "error": "Error description message"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Request successful |
| `401` | Unauthorized - Invalid or missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict - Resource already exists |
| `500` | Internal server error |
| `503` | Service temporarily unavailable |

---

## API Endpoints

### Authentication Endpoints

#### 1. User Registration

Create a new user account.

**Endpoint:** `POST /api/signup/create`

**Request Body:**

```json
{
  "username": "newuser",
  "password": "securepassword123",
  "type": "user"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | Username, unique identifier |
| `password` | string | Yes | Password, will be hashed for storage |
| `type` | string | Yes | User type: `user` or `admin` |

**Success Response:** `200 OK`

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses:**

- `500` - Failed to create account
- `503` - Service temporarily unavailable

---

#### 2. User Login

Validate user credentials and return a token. Supports both POST and GET methods.

**Endpoint:** `POST /api/signin` or `GET /api/signin`

**POST Request Body / GET Query Parameters:**

```json
{
  "username": "existinguser",
  "password": "securepassword123"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |

**Success Response:** `200 OK`

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Special Notes:**

- For GET method, parameters are passed via URL query string: `/api/signin?username=...&password=...`
- Root user authenticates using `ROOT_USERNAME` and `ROOT_PASSWORD` environment variables
- Root user tokens are returned in `root-{UUID}` format

**Error Responses:**

- `401` - Invalid username or password
- `503` - Service temporarily unavailable

---

#### 3. Delete Account

Delete the current logged-in user's account and all related profile data.

**Endpoint:** `POST /api/delete`

**Authentication Required:** Yes

**Request Body:**

```json
{
  "username": "currentuser",
  "token": "your-token-here"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "Account deleted successfully"
}
```

**Error Responses:**

- `401` - Invalid or missing token
- `500` - Deletion failed
- `503` - Service temporarily unavailable

---

### User Profile

#### 4. Get User Profile

Retrieve public profile information for a specific user.

**Endpoint:** `GET /api/user/:username`

**Authentication Required:** No (Public endpoint)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username to query |

**Success Response:** `200 OK`

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

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Username |
| `name` | string | Display name |
| `userType` | string | Account type: `personal`, `company`, `organization` |
| `pronouns` | string | Pronouns (e.g., he/him, she/her, they/them) |
| `avatar` | string | Avatar (character, emoji, or base64 image) |
| `bio` | string | Bio/About me |
| `location` | string | Location |
| `website` | string | Personal website |
| `background` | string | Background image (base64) |
| `currentCompany` | string | Current company |
| `currentCompanyLink` | string | Link to current company |
| `currentSchool` | string | Current school |
| `currentSchoolLink` | string | Link to current school |
| `contacts` | array | Contact methods list |
| `socialLinks` | array | Social media links list |
| `projects` | array | Projects list |
| `workExperiences` | array | Work experiences list |
| `schoolExperiences` | array | Education experiences list |
| `gallery` | array | Photo gallery list |

**Contact Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Contact type: `email`, `phone`, `wechat`, `qq`, `whatsapp`, `telegram`, `discord`, `line`, `wecom` |
| `value` | string | Contact value (text or base64 QR code image) |

**Social Links Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Platform type: `github`, `twitter`, `facebook`, `instagram`, `youtube`, `bilibili`, `xiaohongshu`, `weibo`, `threads`, `huggingface`, `steam`, `spotify`, `qqmusic`, `neteasemusic`, `kugoumusic` |
| `value` | string | Username or link |
| `githubData` | object | (GitHub only) Contains avatar, follower count, etc. |

**Projects Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Project name |
| `url` | string | Project URL |
| `description` | string | Project description |
| `logo` | string | Project logo (base64 image) |

**Work Experiences Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `position` | string | Job position/title |
| `company` | string | Company name |
| `companyLink` | string | Company website link |
| `startDate` | string | Start date (YYYY-MM-DD) |
| `endDate` | string | End date (YYYY-MM-DD), empty string indicates "Present" |
| `description` | string | Job description |
| `logo` | string | Company logo (base64 image) |

**School Experiences Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `degree` | string | Degree obtained |
| `school` | string | School name |
| `schoolLink` | string | School website link |
| `major` | string | Major/Field of study |
| `startDate` | string | Start date (YYYY-MM-DD) |
| `endDate` | string | End date (YYYY-MM-DD), empty string indicates "Present" |
| `description` | string | Description of experience |
| `logo` | string | School logo (base64 image) |

**Gallery Object Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `image` | string | Photo (base64) |
| `caption` | string | Image caption |

**Error Responses:**

- `404` - User not found
- `500` - Internal server error

---

#### 5. Update User Profile

Update the current logged-in user's profile information.

**Endpoint:** `POST /api/user/:username`

**Authentication Required:** Yes (must be the profile owner)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username to update (must match token) |

**Authentication Method:**

```http
Authorization: Bearer your-token-here
```

**Request Body:**

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

**Parameter Notes:**

- All fields are optional
- Submitted data will completely replace existing profile
- Supported fields match those returned by the "Get User Profile" endpoint

**Success Response:** `200 OK`

```json
{
  "success": true
}
```

**Error Responses:**

- `401` - Invalid or missing token
- `401` - Token does not match username
- `500` - Update failed

---

#### 6. Export User Data

Export all data of the current logged-in user (including account info and profile info).

**Endpoint:** `GET /api/user/:username/export`

**Authentication Required:** Yes (must be the profile owner)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username to export |

**Authentication Method:**

```http
Authorization: Bearer your-token-here
```

**Success Response:** `200 OK`

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

**Error Responses:**

- `401` - Invalid or missing token
- `500` - Export failed

---

#### 7. Import User Data

Import full user data, overwriting the existing profile. The system will automatically maintain the current logged-in Token.

**Endpoint:** `POST /api/user/:username/import`

**Authentication Required:** Yes (must be the profile owner)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username to import |

**Authentication Method:**

```http
Authorization: Bearer your-token-here
```

**Request Body:**

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

**Success Response:** `200 OK`

```json
{
  "success": true
}
```

**Error Responses:**

- `401` - Invalid or missing token
- `500` - Import failed

---

### Admin Functions

All admin functions require `admin` or `root` permissions.

#### 8. Check Permissions

Verify the current user's admin permissions.

**Endpoint:** `POST /api/admin/check-permission`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Request Body:**

```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**Success Response:** `200 OK`

```json
{
  "success": true,
  "type": "admin"
}
```

**Error Responses:**

- `401` - Invalid or missing token
- `403` - Insufficient permissions

---

#### 9. Get User List (POST)

Retrieve all users list (POST method, for frontend use).

**Endpoint:** `POST /api/admin/users/list`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Request Body:**

```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**Success Response:** `200 OK`

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

**Notes:**

- Root user will not appear in the list
- Returns all non-root users

**Error Responses:**

- `401` - Invalid or missing token
- `403` - Insufficient permissions
- `500` - Failed to fetch user list

---

#### 10. Get User List (GET)

Retrieve all users list (GET method).

**Endpoint:** `GET /api/admin/users`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Authentication Method:**

```http
Authorization: Bearer your-token-here
```

**Request Body:**

```json
{
  "username": "adminuser",
  "token": "your-token-here"
}
```

**Success Response:** `200 OK`

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

**Error Responses:**

- `401` - Invalid or missing token
- `403` - Insufficient permissions
- `500` - Failed to fetch user list

---

#### 11. Create User

Create a new user (admin only).

**Endpoint:** `POST /api/admin/users`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Request Body:**

```json
{
  "username": "adminuser",
  "token": "your-admin-token",
  "newUsername": "newuser123",
  "password": "securepassword",
  "type": "user"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `username` | string | Yes | Current admin username |
| `token` | string | Yes | Current admin token |
| `newUsername` | string | Yes | New user's username |
| `password` | string | Yes | New user's password |
| `type` | string | Yes | User type: `user` or `admin` |

**Success Response:** `200 OK`

```json
{
  "message": "User created",
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Restrictions:**

- Cannot create `root` type users
- Username must be unique

**Error Responses:**

- `401` - Invalid or missing token
- `403` - Insufficient permissions
- `403` - Attempted to create root user
- `409` - Username already exists
- `500` - Creation failed

---

#### 12. Delete User

Delete a specific user and all their profile data.

**Endpoint:** `DELETE /admin/users/:username`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Username to delete |

**Request Body:**

```json
{
  "username": "adminuser",
  "token": "your-admin-token"
}
```

**Success Response:** `200 OK`

```json
{
  "message": "User deleted"
}
```

**Restrictions:**

- Cannot delete yourself
- Cannot delete root user
- Deletion operation will remove all user profile data

**Error Responses:**

- `401` - Invalid or missing token
- `403` - Insufficient permissions
- `403` - Attempted to delete yourself or root user
- `500` - Deletion failed

---

---

### System Settings

#### 13. Get Public System Settings

Retrieve public system configuration (e.g., site title, logo).

**Endpoint:** `GET /api/settings`

**Authentication Required:** No

**Success Response:** `200 OK`

```json
{
  "title": "OpenBioCard",
  "logo": "data:image/png;base64,...",
  "favicon": "...",
  "footer": "..."
}
```

---

#### 14. Get Full System Settings (Admin)

Retrieve complete system configuration.

**Endpoint:** `POST /api/admin/settings`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Success Response:** `200 OK`

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

#### 15. Update System Settings

Update system configuration.

**Endpoint:** `POST /api/admin/settings/update`

**Authentication Required:** Yes

**Required Permissions:** `admin` or `root`

**Request Body:**

```json
{
  "title": "New Title",
  "logo": "...",
  ...
}
```

**Success Response:** `200 OK`

```json
{
  "success": true
}
```

---

### System Initialization & Info

#### 16. Initialize Admin

Initialize the system and create the default admin user.

**Endpoint:** `GET /api/init-admin`

**Authentication Required:** No

**Success Response:** `200 OK`

```text
Admin initialized
```

**Notes:**

- Only used during initial system deployment
- This endpoint should be disabled or protected in production

---

#### 17. Get API Information

Retrieve basic API information and available endpoints.

**Endpoint:** `GET /api/`

**Authentication Required:** No

**Success Response:** `200 OK`

```json
{
  "message": "OpenBioCard API",
  "version": "1.0.0",
  "endpoints": {
    "auth": ["/signup", "/signin", "/delete"],
    "user": ["/user/:username", "/user/:username/export", "/user/:username/import"],
    "admin": ["/admin/users", "/admin/settings", "/init-admin"],
    "system": ["/settings"]
  }
}
```

---

## Data Storage

### Durable Objects

The system uses two Durable Objects:

1. **UserDO** - Stores individual user account and profile data
    - Each user has a separate DO instance
    - Instance ID is generated from username (`idFromName(username)`)
    - Storage contents:
        - `user`: Account information (username, password hash, token, type)
        - `profile`: Profile information (personal info, contacts, social links, projects, gallery, work experiences, education experiences)

2. **AdminDO** - Stores system-level data
    - Global singleton, instance name is `admin-manager`
    - Storage contents:
        - `users`: List of all usernames and types
        - `settings`: Global system settings (title, logo, SEO, etc.)
        - `rootToken`: Currently valid root user token

### Data Consistency

- Create user: Write to UserDO first, then sync to AdminDO, rollback on failure
- Delete user: Delete from UserDO first, then sync to AdminDO
- Profile update: Only operates on UserDO

---

## Environment Variables

Required configuration in Cloudflare Workers environment:

| Variable | Description | Example |
|----------|-------------|---------|
| `ROOT_USERNAME` | Root username | `root` |
| `ROOT_PASSWORD` | Root password | `your-secure-password` |
| `USER_DO` | UserDO binding | (auto-configured) |
| `ADMIN_DO` | AdminDO binding | (auto-configured) |

---

## Frontend Routes

### Page Routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/frontend` | Login page |
| `/:username` | User profile page |

**Reserved Route Names:**

- `signup`
- `signin`
- `delete`
- `admin`
- `init-admin`
- `frontend`

These names cannot be used as usernames.

---

## Security

1. **Password Security**
    - All passwords are hashed using bcrypt before storage
    - Passwords are never stored or transmitted in plain text

2. **Token Security**
    - Tokens are generated using UUID v4
    - Token validity is verified with each request
    - Tokens do not expire but can be invalidated by deleting the account

3. **Permission Control**
    - Strict permission checking middleware
    - Users can only modify their own profiles
    - Admin operations require appropriate permission verification

4. **Input Validation**
    - All API endpoints perform input validation
    - Prevents creation of root users
    - Prevents users from deleting themselves or root

---

## Version Information

- **API Version:** 1.0
- **Last Updated:** 2025-11-26
- **Framework Versions:**
    - Hono: ^4.10.6
    - Cloudflare Workers
    - Durable Objects

---

## Contact

For questions or suggestions, please submit via project GitHub Issues.