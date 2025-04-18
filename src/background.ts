// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with empty snippets array
  chrome.storage.sync.set({ snippets: [] })
})

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SNIPPETS') {
    chrome.storage.sync.get(['snippets'], (result) => {
      sendResponse({ snippets: result.snippets || [] })
    })
    return true // Will respond asynchronously
  }
}) 