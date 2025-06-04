import Fastify from 'fastify'
import cors from '@fastify/cors'
import { githubRoutes } from './routes/github.routes'

// Fastify 인스턴스 생성
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
})

// 서버 시작 함수
async function start() {
  try {
    // CORS 설정
    await fastify.register(cors, {
      origin: true, // 모든 origin 허용
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    })

    // GitHub 릴리즈 통계 라우트 등록
    await fastify.register(githubRoutes)

    // 서버 시작
    await fastify.listen({ port: 3000, host: 'localhost' })

    console.log(`서버가 http://localhost:3000 에서 실행 중입니다.`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

// 서버 시작
start()
