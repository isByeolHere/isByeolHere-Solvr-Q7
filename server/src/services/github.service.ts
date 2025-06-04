import { Release, ReleaseStats, RepositoryStats } from '../types/release'

const GITHUB_API_BASE = 'https://api.github.com'
const REPOSITORIES = ['daangn/stackflow', 'daangn/seed-design']

export class GitHubService {
  private async fetchReleases(repo: string): Promise<Release[]> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}/releases`)
    if (!response.ok) {
      throw new Error(`Failed to fetch releases for ${repo}`)
    }
    return response.json()
  }

  private calculateStats(releases: Release[]): ReleaseStats {
    const now = new Date()
    const stats: ReleaseStats = {
      year: 0,
      month: 0,
      week: 0,
      day: 0,
      total: releases.length
    }

    releases.forEach(release => {
      const releaseDate = new Date(release.published_at)

      // 연간 통계
      if (releaseDate.getFullYear() === now.getFullYear()) {
        stats.year++
      }

      // 월간 통계
      if (
        releaseDate.getMonth() === now.getMonth() &&
        releaseDate.getFullYear() === now.getFullYear()
      ) {
        stats.month++
      }

      // 주간 통계
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (releaseDate >= weekAgo) {
        stats.week++
      }

      // 일간 통계
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      if (releaseDate >= dayAgo) {
        stats.day++
      }
    })

    return stats
  }

  public async getRepositoryStats(): Promise<RepositoryStats[]> {
    const stats: RepositoryStats[] = []

    for (const repo of REPOSITORIES) {
      const releases = await this.fetchReleases(repo)
      const releaseStats = this.calculateStats(releases)

      stats.push({
        repository: repo,
        stats: releaseStats,
        releases
      })
    }

    return stats
  }
}
