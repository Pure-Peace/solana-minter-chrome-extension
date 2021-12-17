import { tryGetCandyMachine } from '../utils/solana'
import base58 from 'bs58'
import { PublicKey } from '@solana/web3.js'

export const CANDY_REGEX = /(?<=")([1-9A-HJ-NP-Za-km-z]{32,44})?(?=")/g

export const EXCLUDES = [
  '11111111111111111111111111111111',
  'SysvarC1ock11111111111111111111111111111111',
  'SysvarRecentB1ockHashes11111111111111111111',
  'SysvarRent111111111111111111111111111111111',
  'SysvarRewards111111111111111111111111111111',
  'Stake11111111111111111111111111111111111111',
  'Va1idator1nfo111111111111111111111111111111',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  'So11111111111111111111111111111111111111112',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ'
]

export async function getCandiesFromContent (checkContent) {
  if (!checkContent || typeof checkContent !== 'string') return

  const matchResults = checkContent.match(CANDY_REGEX)
  if (!matchResults) return
  const results = []
  for (const r of [...new Set(matchResults.filter(v => v && !EXCLUDES.includes(v)))]) {
    try {
      if (PublicKey.isOnCurve(base58.decode(r))) {
        await tryGetCandyMachine(r)
        results.push(r)
      }
    } catch (_err) {}
  }

  return results
}

export async function getSolanaPubKeysFromLoadedPage (data) {
  if (!data) return []

  const tasks = []
  const solanaPubKeys = []
  const keys = ['js', 'json', 'html', 'others']
  const keys2 = ['data', 'inline']

  for (const key of keys) {
    if (!data[key]) return
    const dataItem = data[key]
    for (const item of dataItem) {
      for (const key2 of keys2) {
        tasks.push(new Promise((resolve) => {
          getCandiesFromContent(item[key2]).then(res => {
            if (res) solanaPubKeys.push(...res)
            resolve()
          })
        }))
      }
    }
  }

  await Promise.allSettled(tasks)

  return solanaPubKeys
}
