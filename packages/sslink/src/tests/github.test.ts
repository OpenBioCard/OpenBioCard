/*
获取Github相关资料模块
*/

// Mock console.error to suppress error logs in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

import { getUserInfo, getUserRepos, getRepoInfo } from '../components/github';

describe('GitHub API Tests', () => {
  describe('getUserInfo', () => {
    it('should fetch user info for a valid GitHub username', async () => {
      const username = 'dongguacute'; // 使用真实的 GitHub 用户

      const userInfo = await getUserInfo(username);

      console.log('用户显示名字:', userInfo.displayName);
      console.log('用户简介:', userInfo.bio);
      console.log('头像地址 (base64):', userInfo.avatarBase64.substring(0, 50) + '...'); // 只显示前50字符

      expect(userInfo).toBeDefined();
      expect(userInfo.username).toBe(username);
      expect(typeof userInfo.displayName).toBe('string');
      expect(typeof userInfo.bio).toBe('string');
      expect(typeof userInfo.avatarBase64).toBe('string');
    });

    it('should throw an error for an invalid username', async () => {
      const invalidUsername = 'invaliduser123456789';

      await expect(getUserInfo(invalidUsername)).rejects.toThrow();
    });
  });

  describe('getUserRepos', () => {
    it('should fetch repositories for a valid user', async () => {
      const username = 'octocat';

      const repos = await getUserRepos(username);

      expect(Array.isArray(repos)).toBe(true);
      if (repos.length > 0) {
        expect(repos[0]).toHaveProperty('name');
        expect(repos[0]).toHaveProperty('full_name');
      }
    });
  });

  describe('getRepoInfo', () => {
    it('should fetch repository info', async () => {
      const owner = 'octocat';
      const repo = 'Hello-World';

      const repoInfo = await getRepoInfo(owner, repo);

      expect(repoInfo).toBeDefined();
      expect(repoInfo.name).toBe(repo);
      expect(repoInfo.owner.login).toBe(owner);
    });
  });
});