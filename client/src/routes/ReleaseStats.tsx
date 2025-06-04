import { useEffect, useState } from 'react'

interface ReleaseStats {
  repository: string
  total: number
  yearly: number
  monthly: number
  weekly: number
  daily: number
  lastUpdated: string
}

export default function ReleaseStats() {
  const [stats, setStats] = useState<ReleaseStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // CSV 파일을 직접 파싱
        const csvResponse = await fetch('http://localhost:3000/api/github/release-stats/csv')
        const csvText = await csvResponse.text()

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

        setStats(parsedStats)
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">GitHub Release Statistics</h1>
      <div className="grid gap-4">
        {stats.map(stat => (
          <div key={stat.repository} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{stat.repository}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm text-blue-600">Total Releases</div>
                <div className="text-2xl font-bold">{stat.total}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm text-green-600">Yearly Releases</div>
                <div className="text-2xl font-bold">{stat.yearly}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-sm text-yellow-600">Monthly Releases</div>
                <div className="text-2xl font-bold">{stat.monthly}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-sm text-purple-600">Weekly Releases</div>
                <div className="text-2xl font-bold">{stat.weekly}</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-sm text-red-600">Daily Releases</div>
                <div className="text-2xl font-bold">{stat.daily}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Last Updated</div>
                <div className="text-lg">{stat.lastUpdated}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
