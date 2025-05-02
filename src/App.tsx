import { useEffect, useState } from 'react'

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    const getCurrentUrl = async () => {
      //@ts-ignore
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      setCurrentUrl(tab.url || 'Unable to get URL')
    }

    getCurrentUrl()
  }, [])

  return (
    <div className="min-w-[300px] p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-lg font-bold mb-2">Current URL:</h1>
      <div className="p-3 bg-white rounded-md break-all">
        <code className="text-sm text-blue-600">{currentUrl}</code>
      </div>
    </div>
  )
}