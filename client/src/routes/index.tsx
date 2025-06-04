import { createBrowserRouter } from 'react-router-dom'
import ReleaseStats from './ReleaseStats'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ReleaseStats />
  }
])
