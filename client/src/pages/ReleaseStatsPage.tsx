import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

      {/* 통계 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">릴리스 통계</h2>
        <div className="grid gap-6">
          {stats.map(stat => (
            <Card key={stat.repository}>
              <CardHeader>
                <CardTitle>{stat.repository}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Releases</div>
                    <div className="text-3xl font-bold text-blue-700">{stat.total}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Yearly Releases</div>
                    <div className="text-3xl font-bold text-green-700">{stat.yearly}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Monthly Releases</div>
                    <div className="text-3xl font-bold text-yellow-700">{stat.monthly}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Weekly Releases</div>
                    <div className="text-3xl font-bold text-purple-700">{stat.weekly}</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">Daily Releases</div>
                    <div className="text-3xl font-bold text-red-700">{stat.daily}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 font-medium">Last Updated</div>
                    <div className="text-xl text-gray-700">{stat.lastUpdated}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 원본 데이터 섹션 */}
      <div>
        <h2 className="text-2xl font-bold mb-6">원본 데이터</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Repository</th>
                <th className="border p-2 text-left">Tag Name</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Published At</th>
                <th className="border p-2 text-left">Author</th>
                <th className="border p-2 text-left">Body</th>
              </tr>
            </thead>
            <tbody>
              {rawReleases.map((release, index) => (
                <tr
                  key={`${release.repository}-${release.tagName}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border p-2">{release.repository}</td>
                  <td className="border p-2">{release.tagName}</td>
                  <td className="border p-2">{release.name}</td>
                  <td className="border p-2">{new Date(release.publishedAt).toLocaleString()}</td>
                  <td className="border p-2">{release.author}</td>
                  <td className="border p-2 whitespace-pre-wrap">{release.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
