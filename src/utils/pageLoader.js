import axios from './axios'

const MAX_INLINE_LEN = 100000

export async function loadItemData (item) {
  const resp = await axios.get(item.src)
  if (resp.status === 200) {
    item.data = resp.data
  } else {
    item.data = { err: resp.status }
  }
}

export async function updatePageData (data) {
  const promises = []
  const keys = ['js', 'json', 'html', 'others']

  for (const key of keys) {
    const dataItem = data[key]
    if (dataItem) {
      promises.push(Promise.allSettled(dataItem.filter(item => item.src).map((item) => loadItemData(item))))
    }
  }

  return { data, results: await Promise.allSettled(promises) }
}

export function loadPageData ({ request, showOnclick }) {
  const arrHtml = []
  const arrJs = []
  const arrJson = []
  const arrOthers = []

  const isInitial = !request

  try {
    getJs(
      arrJs,
      arrHtml,
      arrJson,
      arrOthers,
      isInitial,
      showOnclick
    )
    return {
      url: location.href,
      js: arrJs,
      json: arrJson,
      html: [
        { inline: getDom(), count: document.getElementsByTagName('*').length },
        ...arrHtml
      ],
      others: arrOthers
    }
  } catch (e) {
    return { err: '' + e }
  }
}

// get body as string
export function getDom () {
  // truncate long scripts+styles in HTML, they are listed separately
  const dupNode = document.documentElement.cloneNode(true)
  function truncate (nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const s = nodes[i].innerHTML
      if (s && s.length > MAX_INLINE_LEN) {
        nodes[i].innerHTML =
          s.substr(0, MAX_INLINE_LEN) + ' truncated ' + s.length + 'bytes...'
      }
    }
  }
  /* truncate(dupNode.getElementsByTagName('script'))
  truncate(dupNode.getElementsByTagName('style')) */
  return dupNode.outerHTML
}

// enumerate JS scripts in page
// returns 2 arrays: js and html content
export function getJs (arrJs, arrHtml, arrJson, arrOthers, markInitial, showOnclick) {
  const nodes = document.getElementsByTagName('script')
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (
      !node.type ||
      node.type === 'text/javascript' ||
      node.type === 'application/javascript'
    ) { pickNode(node, arrJs, markInitial) } else if (
      node.type === 'application/json' ||
      node.type === 'application/ld+json'
    ) { pickNode(node, arrJson, markInitial) } else if (
      node.type === 'text/template' ||
      node.type === 'text/x-template' ||
      node.type === 'text/html'
    ) { pickNode(node, arrHtml, markInitial) } else pickNode(node, arrOthers, markInitial)
  }
  // inline onclick-handlers
  if (showOnclick) {
    const nodes2 = document.getElementsByTagName('*')
    for (let i = 0; i < nodes2.length; i++) {
      const node = nodes2[i]
      if (node.getAttribute('onclick')) {
        const item = pickNode(node, arrJs, markInitial)
        let s = '/* ' + node.tagName.toLowerCase()
        if (node.id) s += '#' + node.id
        if (node.className) s += '.' + node.className
        s += '.onclick = */\n'
        item.inline = s + node.getAttribute('onclick')
        item.src = null
        item.dynamic = false
        item.onclick = true
      }
    }
  }
}

// picks element's src-url or inline content
export function pickNode (node, array, markInitial) {
  // skip extension scripts
  const src = node.href || node.src
  if (src && startsWith('' + src, 'chrome-extension:')) return null

  const item = src
    ? { src }
    : { inline: node.innerText || node.text || '' + node }

  // mark initially loaded elems
  if (markInitial) node._xinit = true
  if (!node._xinit) item.dynamic = true

  array.push(item)
  return item
}

export function startsWith (s, sub) {
  return s.indexOf(sub) === 0
}
