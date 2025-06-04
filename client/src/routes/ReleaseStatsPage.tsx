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

export default function ReleaseStatsPage() {
  const [stats, setStats] = useState<ReleaseStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/github/release-stats/csv')
        const csvText = await response.text()

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">GitHub Release Statistics</h1>
      <div className="grid gap-6">
        {stats.map(stat => (
          <div key={stat.repository} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{stat.repository}</h2>
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
          </div>
        ))}
      </div>
    </div>
  )
}
