# GitHub Release Statistics Dashboard

## 대시보드 소개

이 대시보드는 당근 로컬팀의 GitHub 릴리즈 통계를 시각화하여 보여줍니다.

### 주요 기능

1. **통계 뷰**

   - 각 저장소별 릴리스 통계를 보여줍니다
   - 총 릴리스 수, 연간/월간/주간/일간 릴리스 수를 확인할 수 있습니다
   - 마지막 업데이트 시간을 표시합니다

2. **원본 데이터 뷰**
   - 모든 릴리스의 상세 정보를 확인할 수 있습니다
   - 저장소, 태그명, 릴리스명, 발행일, 작성자, 릴리스 내용을 포함합니다
   - 시간순으로 정렬되어 있어 최신 릴리스를 쉽게 확인할 수 있습니다

### 기술 스택

- Frontend: React, TypeScript
- UI Components: shadcn/ui
- Styling: Tailwind CSS

### 사용 방법

1. 서버 실행

```bash
cd server
npm install
npm run dev
```

2. 클라이언트 실행

```bash
cd client
npm install
npm run dev
```

3. 웹 브라우저에서 `http://localhost:5173` 접속

### 데이터 업데이트

- 서버는 GitHub API를 통해 최신 릴리스 데이터를 가져옵니다
- 데이터는 CSV 형식으로 저장되며, 클라이언트에서 이를 파싱하여 표시합니다
- 실시간 업데이트를 위해 서버를 재시작하면 최신 데이터를 확인할 수 있습니다
