import { loadPageData } from '../utils/pageLoader'

console.log('Hello from the content-script')

let __tabId

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (!request.getData) return

  if (!__tabId) __tabId = request.tabId
  else if (!request.forceUpdate) return
  sendResponse(loadPageData({ request, showOnclick: request.showOnclick }))
})
