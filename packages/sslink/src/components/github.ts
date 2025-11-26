/*
获取Github相关资料模块
*/

import { UserInfo } from '../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// 示例：获取用户的仓库列表
export async function getUserRepos(username: string, token?: string): Promise<any[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=10`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
}

// 示例：获取仓库信息
export async function getRepoInfo(owner: string, repo: string, token?: string): Promise<any> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repo info:', error);
    throw error;
  }
}

// 获取用户信息：用户名、简介和头像（base64）
export async function getUserInfo(username: string, token?: string): Promise<UserInfo> {

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();

    // 获取头像并转换为 base64
    const avatarResponse = await fetch(user.avatar_url);
    if (!avatarResponse.ok) {
      throw new Error(`Failed to fetch avatar: ${avatarResponse.status} ${avatarResponse.statusText}`);
    }
    const avatarBuffer = await avatarResponse.arrayBuffer();
    const avatarBase64 = Buffer.from(avatarBuffer).toString('base64');

    return {
      username: user.login,
      displayName: user.name || user.login,
      bio: user.bio || '',
      avatarBase64,
      homepageUrl: user.html_url,
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}
