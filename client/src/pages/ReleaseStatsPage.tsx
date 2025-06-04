import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ReleaseStats {
  repository: string
  total: number
  yearly: number
  monthly: number
  weekly: number
  daily: number
  lastUpdated: string
}

interface RawRelease {
  repository: string
  tagName: string
  name: string
  publishedAt: string
  author: string
  body: string
}

export default function ReleaseStatsPage() {
  const [stats, setStats] = useState<ReleaseStats[]>([])
  const [rawReleases, setRawReleases] = useState<RawRelease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/github/release-stats/csv')
        const csvText = await response.text()

        // 통계 데이터 파싱
        const rows = csvText.split('\n').slice(1) // 헤더 제외
        const parsedStats = rows
          .filter(row => row.trim()) // 빈 줄 제외
          .map(row => {
            const [repository, total, yearly, monthly, weekly, daily, lastUpdated] = row.split(',')
            return {
              repository,
              total: parseInt(total),
              yearly: parseInt(yearly),
              monthly: parseInt(monthly),
              weekly: parseInt(weekly),
              daily: parseInt(daily),
              lastUpdated
            }
          })

        // 원본 데이터 파싱
        const rawDataRows = csvText.split('\n').slice(parsedStats.length + 2) // 통계 데이터 이후의 행들
        const parsedRawReleases = rawDataRows
          .filter(row => row.trim())
          .map(row => {
            const [repository, tagName, name, publishedAt, author, body] = row.split(',')
            return {
              repository,
              tagName,
              name,
              publishedAt,
              author,
              body: body || ''
            }
          })

        setStats(parsedStats)
        setRawReleases(parsedRawReleases)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to fetch release statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">GitHub Release Statistics</h1>
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="raw">원본 데이터</TabsTrigger>
        </TabsList>
        <TabsContent value="stats">
          <div className="space-y-4">
            {stats.map(stat => (
              <div key={stat.repository} className="p-4 border rounded-lg">
                <h2 className="text-xl font-bold mb-2">{stat.repository}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>Total Releases: {stat.total}</div>
                  <div>Yearly Releases: {stat.yearly}</div>
                  <div>Monthly Releases: {stat.monthly}</div>
                  <div>Weekly Releases: {stat.weekly}</div>
                  <div>Daily Releases: {stat.daily}</div>
                  <div>Last Updated: {stat.lastUpdated}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="raw">
          <div className="space-y-4">
            {rawReleases.map((release, index) => (
              <div
                key={`${release.repository}-${release.tagName}-${index}`}
                className="p-4 border rounded-lg"
              >
                <div>Repository: {release.repository}</div>
                <div>Tag Name: {release.tagName}</div>
                <div>Name: {release.name}</div>
                <div>Published At: {new Date(release.publishedAt).toLocaleString()}</div>
                <div>Author: {release.author}</div>
                <div className="whitespace-pre-wrap">Body: {release.body}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
