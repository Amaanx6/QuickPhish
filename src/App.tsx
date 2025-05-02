import { useEffect, useState } from 'react'

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tabId, setTabId] = useState<number | null>(null)

  useEffect(() => {
    const getCurrentTab = async () => {
      try {
        //@ts-ignore
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (tab && tab.id) {
          setTabId(tab.id)
          
          // Get the pending URL from the background script
          //@ts-ignore
          chrome.runtime.sendMessage(
            { type: "GET_PENDING_URL", tabId: tab.id },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error getting pending URL:', chrome.runtime.lastError);
                setIsLoading(false);
                return;
              }
              
              if (response && response.url && response.url !== 'No pending navigation') {
                setCurrentUrl(response.url)
              } else {
                setCurrentUrl('No pending navigation')
              }
              setIsLoading(false)
            }
          )
        }
      } catch (error) {
        console.error('Error getting tab information:', error)
        setIsLoading(false)
      }
    }

    getCurrentTab()
    
    // Auto-close popup if no pending URL after 5 seconds
    const timer = setTimeout(() => {
      if (currentUrl === 'No pending navigation' || !currentUrl) {
        window.close()
      }
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])  // Only run on component mount

  const handleApprove = () => {
    if (tabId) {
      console.log("Approving URL for tab:", tabId);
      //@ts-ignore
      chrome.runtime.sendMessage(
        { type: "APPROVE_URL", tabId },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error in approve message:', chrome.runtime.lastError);
            return;
          }
          
          if (response && response.success) {
            window.close() // Close the popup after approval
          } else {
            console.error('Error approving URL:', response?.message)
          }
        }
      )
    }
  }

  const handleBlock = () => {
    if (tabId) {
      console.log("Blocking URL for tab:", tabId);
      //@ts-ignore
      
      chrome.runtime.sendMessage(
        { type: "BLOCK_URL", tabId },
        //@ts-ignore
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error in block message:', chrome.runtime.lastError);
            return;
          }
          
          window.close() // Close the popup after blocking
        }
      )
    }
  }

  return (
    <div className="min-w-[400px] p-4 bg-gray-100 min-h-[200px]">
      <h1 className="text-xl font-bold mb-4">QuickPhish Protection</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Approve navigation to:</h2>
            <div className="p-3 bg-white rounded-md break-all border border-gray-300">
              <code className="text-sm text-blue-600">{currentUrl}</code>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-700">
              For your protection, please review this URL before continuing.
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleBlock} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Block
            </button>
            <button 
              onClick={handleApprove} 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Approve
            </button>
          </div>
        </>
      )}
    </div>
  )
}