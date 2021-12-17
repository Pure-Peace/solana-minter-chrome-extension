import { updateBadge } from './utils/chrome'

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Hello from the background')
})

chrome.tabs.onActivated.addListener(function (info) {
  updateBadge()
})
chrome.tabs.onUpdated.addListener(function (tabid, info, tab) {
  updateBadge()
})
