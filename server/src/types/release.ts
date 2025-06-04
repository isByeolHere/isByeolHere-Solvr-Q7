export interface Release {
  tag_name: string
  name: string
  created_at: string
  published_at: string
  body: string
  html_url: string
}

export interface ReleaseStats {
  year: number
  month: number
  week: number
  day: number
  total: number
}

export interface RepositoryStats {
  repository: string
  stats: ReleaseStats
  releases: Release[]
}
