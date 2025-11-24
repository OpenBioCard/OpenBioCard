/*
获取Github相关资料模块
*/

import { Octokit } from '@octokit/rest';

// 示例：获取用户的仓库列表
export async function getUserRepos(username: string, token?: string): Promise<any[]> {
  const octokit = new Octokit({
    auth: token, // 可选：如果需要认证
  });

  try {
    const response = await octokit.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 10,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
}

// 示例：获取仓库信息
export async function getRepoInfo(owner: string, repo: string, token?: string): Promise<any> {
  const octokit = new Octokit({
    auth: token,
  });

  try {
    const response = await octokit.repos.get({
      owner,
      repo,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching repo info:', error);
    throw error;
  }
}
