import { markRaw } from 'vue'
import { Keypair } from '@solana/web3.js'
import { defineStore } from 'pinia'
import { readyProgramWithCluster } from '../utils/solana'

export const useBus = defineStore('bus', {
  state: () => ({
    initialingPrograms: false,
    clusters: ['mainnet-beta', 'devnet'],
    providers: {
      'mainnet-beta': null,
      devnet: null
    },
    candyPrograms: {
      'mainnet-beta': null,
      devnet: null
    }
  }),
  getters: {

  },
  actions: {
    async initialPrograms () {
      if (this.initialingPrograms) return

      this.initialingPrograms = true
      for (const cluster of this.clusters) {
        const { provider, program } = await readyProgramWithCluster(cluster, Keypair.fromSecretKey(new Uint8Array([97, 188, 159, 128, 31, 103, 47, 197, 185, 250, 242, 68, 90, 13, 65, 130, 182, 43, 52, 245, 179, 217, 88, 231, 160, 149, 147, 15, 168, 72, 58, 94, 218, 4, 136, 84, 113, 150, 138, 165, 36, 35, 52, 43, 92, 43, 164, 183, 146, 241, 249, 184, 99, 78, 1, 40, 136, 42, 44, 87, 83, 64, 58, 223])))
        this.providers[cluster] = markRaw(provider)
        this.candyPrograms[cluster] = markRaw(program)
      }
      this.initialingPrograms = false
    }
  }
})
