import { updatePageData } from './pageLoader'
import { getSolanaPubKeysFromLoadedPage } from '../utils/scrape'

export async function dataReceived (tabId, resp) {
  if (!resp) {
    const err = chrome.extension.lastError
    // still loading page?
    chrome.tabs.get(tabId, (tab) => {
      if (tab.status === 'complete' && err) {
        return {}
      }
      setTimeout(askPageData, 500)
    })
    return {}
  } else if (resp.err) {
    console.error(resp.err)
    return {}
  }
  const { data } = await updatePageData(resp)

  let keys
  if (data) {
    keys = await getSolanaPubKeysFromLoadedPage(data)
    // set badge for this source tab too
    updateBadge(keys.length)
  }

  return { data, keys }
}

export function updateBadge (count) {
  chrome.browserAction.setBadgeText({ text: count ? `${count}` : count === 0 ? '0' : count })
  chrome.browserAction.setBadgeBackgroundColor({ color: count > 0 ? '#2ECC71' : '#D7D7D7' })
}

export async function tryGetPublicKeysFromPage () {
  return await askPageData()
}

export function askPageData () {
  return new Promise((resolve) => {
    // call content script: ask js+css nodes
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs) return
        const tab = tabs[0]
        // ask to return onclick handlers too?
        chrome.tabs.sendMessage(
          tab.id,
          { getData: true, showOnclick: true },
          async (resp) => {
            return resolve(await dataReceived(tab.id, resp))
          }
        )
      })
    }
  })
}

export async function getPublicKeysFromStore () {
  return (await new Promise((resolve) => {
    chrome.storage.sync.get(['savedPublicKeys'], (result) => {
      resolve(result.savedPublicKeys)
    })
  })) || []
}

export async function savePublicKeysToStore (old, news) {
  const savedPublicKeys = [...new Set([...old, ...news])]
  await new Promise((resolve) => {
    chrome.storage.sync.set({ savedPublicKeys }, () => {
      resolve()
    })
  })
}

export async function getPublicKeySitiesFromStore () {
  return (await new Promise((resolve) => {
    chrome.storage.sync.get(['savedPublicKeysSite'], (result) => {
      resolve(result.savedPublicKeysSite)
    })
  })) || {}
}

export async function savePublicKeySitiesToStore (old, news) {
  const savedPublicKeysSite = { ...old, ...news }
  await new Promise((resolve) => {
    chrome.storage.sync.set({ savedPublicKeysSite }, () => {
      resolve()
    })
  })
}
