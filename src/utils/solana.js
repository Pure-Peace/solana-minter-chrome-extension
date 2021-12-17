import { PublicKey, Connection, Keypair, clusterApiUrl } from '@solana/web3.js'
import { Program, Provider, Wallet } from '@project-serum/anchor'

export const CANDY_MACHINE = 'candy_machine'
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)
export const CANDY_MACHINE_PROGRAM_ID = new PublicKey(
  'cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ'
)
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

/**
 * @param {string} publicKey
 * @return {Promise<[PublicKey, number]>}
 **/
export async function tryGetCandyMachine (publicKey) {
  return await PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), new PublicKey(publicKey).toBuffer(), Buffer.from(publicKey.slice(0, 6))],
    CANDY_MACHINE_PROGRAM_ID
  )
}

/**
 * @param {Provider} provider
 **/
export async function createCandyAnchorProgram (provider) {
  console.log(provider)
  const idl = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider)
  return new Program(idl, CANDY_MACHINE_PROGRAM_ID, provider)
}

/**
 * @param {Cluster} cluster
 **/
export function createConnection (cluster) {
  return new Connection(clusterApiUrl(cluster), 'confirmed')
}

/**
 * @param {Cluster} cluster
 * @param {Keypair?} keyPair
 **/
export async function readyProgramWithCluster (cluster, keyPair) {
  const provider = await createProvider(createConnection(cluster), keyPair || Keypair.generate())
  const program = await createCandyAnchorProgram(provider)
  return { provider, program }
}

/**
 * @param {Connection} connection
 * @param {Keypair} payer
 **/
export async function createProvider (connection, payer) {
  const provider = new Provider(connection, new Wallet(payer), {
    preflightCommitment: 'recent'
  })
  return provider
}
