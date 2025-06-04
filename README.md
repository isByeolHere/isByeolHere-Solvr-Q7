# GitHub Release Statistics Dashboard

당근 로컬팀의 GitHub 저장소의 릴리스 통계를 시각화하는 대시보드입니다.
<img width="783" alt="스크린샷 2025-06-04 오후 5 13 47" src="https://github.com/user-attachments/assets/d6c5eb87-ea89-412a-bb6b-3bd7dedcb7a0" />

## 주요 기능

- 저장소별 릴리스 통계 시각화
- 연간/월간/주간/일간 릴리스 수 추적
- 원본 릴리스 데이터 표시
- CSV 형식의 데이터 다운로드

## 기술 스택

### 클라이언트

- React
- TypeScript
- shadcn/ui
- Tailwind CSS

### 서버

- Fastify
- TypeScript
- CSV 파일 처리

## 아키텍처

이 프로젝트는 클라이언트-서버 아키텍처로 설계되어 있습니다:

### 클라이언트

- React 기반의 프론트엔드 애플리케이션
- 서버로부터 API를 통해 데이터를 받아 시각화
- 통계 정보와 원본 데이터를 사용자 친화적으로 표시
- 순수하게 데이터 표시 역할만 수행

### 서버

- Fastify 기반의 백엔드 서버
- GitHub API를 통해 릴리스 데이터 수집
- 데이터 가공 및 통계 계산
- CSV 파일 생성 및 관리
- RESTful API 엔드포인트 제공

## 실행 방법

### 서버 실행

```bash
cd server
npm install
npm run dev
```

### 클라이언트 실행

```bash
cd client
npm install
npm run dev
```

## API 엔드포인트

### GET /api/github/release-stats

릴리스 통계 정보를 반환합니다.

### GET /api/github/release-stats/csv

CSV 형식의 릴리스 데이터를 반환합니다.

## 데이터 업데이트

서버는 구동 시 GitHub API를 통해 최신 릴리스 데이터를 가져와 CSV 파일로 저장합니다. 이 데이터는 클라이언트의 요청에 따라 API를 통해 제공됩니다
