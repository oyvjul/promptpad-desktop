import { useEffect } from 'react'
import Editor from './components/Editor'

export default function App() {
  useEffect(() => {
    if ((window as any).electronAPI?.platform === 'win32') {
      document.body.classList.add('platform-win')
    }
  }, [])
  return <Editor />
}
