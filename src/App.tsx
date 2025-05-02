import { useEffect, useState } from 'react'

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    // For new tab pages, we don't need to query for the current tab
    // as we're already in the tab, so we can just use window.location
    setCurrentUrl(window.location.href || 'Unable to get URL')
    
    // Optionally, you can still check other tabs or do additional operations
    const getCurrentUrl = async () => {
      try {
        //@ts-ignore
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab && tab.url) {
          setCurrentUrl(tab.url)
        }
      } catch (error) {
        console.error('Error getting tab URL:', error)
      }
    }

    getCurrentUrl()
  }, [])

  return (
    <div className="min-w-[300px] p-4 bg-gray-100 min-h-screen">
      <h1 className="text-lg font-bold mb-2">Current URL:</h1>
      <div className="p-3 bg-white rounded-md break-all">
        <code className="text-sm text-blue-600">{currentUrl}</code>
      </div>
    </div>
  )
}