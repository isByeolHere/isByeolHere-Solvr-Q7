import { FastifyInstance } from 'fastify'
import { GitHubService } from '../services/github.service'
import { CsvGenerator } from '../utils/csv.generator'
import fs from 'fs'
import path from 'path'

export async function githubRoutes(fastify: FastifyInstance) {
  const githubService = new GitHubService()

  fastify.get('/api/github/release-stats', async (request, reply) => {
    try {
      const stats = await githubService.getRepositoryStats()
      const csvPath = await CsvGenerator.generateCsv(stats)

      return {
        success: true,
        message: 'Release statistics generated successfully',
        csvPath
      }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        success: false,
        message: 'Failed to generate release statistics'
      })
    }
  })

  fastify.get('/api/github/release-stats/csv', async (request, reply) => {
    try {
      const csvPath = path.resolve(__dirname, '../../release-stats.csv')
      const csvContent = await fs.promises.readFile(csvPath, 'utf-8')

      reply.header('Content-Type', 'text/csv')
      return csvContent
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({
        success: false,
        message: 'Failed to read CSV file'
      })
    }
  })
}
