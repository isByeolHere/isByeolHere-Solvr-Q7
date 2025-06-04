import { RepositoryStats, Release } from '../types/release'
import fs from 'fs'
import path from 'path'

export class CsvGenerator {
  private static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private static generateHeader(): string {
    return 'Repository,Total Releases,Yearly Releases,Monthly Releases,Weekly Releases,Daily Releases,Last Updated\n'
  }

  private static generateRow(stats: RepositoryStats): string {
    const now = this.formatDate(new Date())
    return `${stats.repository},${stats.stats.total},${stats.stats.year},${stats.stats.month},${stats.stats.week},${stats.stats.day},${now}\n`
  }

  private static generateRawDataHeader(): string {
    return '\nRepository,Tag Name,Name,Published At,Author,Body\n'
  }

  private static generateRawDataRow(release: Release, repository: string): string {
    return `${repository},${release.tag_name},${release.name},${release.published_at},github-actions[bot],${release.body}\n`
  }

  public static async generateCsv(stats: RepositoryStats[]): Promise<string> {
    const csvContent = [
      this.generateHeader(),
      ...stats.map(stat => this.generateRow(stat)),
      this.generateRawDataHeader(),
      ...stats.flatMap(stat =>
        stat.releases.map(release => this.generateRawDataRow(release, stat.repository))
      )
    ].join('')

    const outputPath = path.join(process.cwd(), 'release-stats.csv')
    await fs.promises.writeFile(outputPath, csvContent, 'utf-8')

    return outputPath
  }
}
