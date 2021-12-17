<template>
  <ClusterStatus />
  <div class="home">
    <div style="padding: 15px 15px 0 15px;">
      <div class="publickeys-banner">
        <span>{{ publicKeys.length }}</span> PublicKeys Detected
      </div>

      <a-spin tip="Verfying..." :spinning="verifying">
        <div class="verify-content-box">
          <a-checkbox-group v-model:value="checkedList">
            <div
              v-for="v in publicKeys"
              :key="`${v}`"
              style="display: flex; justify-content: flex-start;"
            >
              <a-checkbox :value="v">
                <span
                  :class="['select-item', verifyedList.includes(v) ? 'verified-item' : verifyFailedList.includes(v) ? 'verify-failed-item' : '']"
                >{{ v }}</span>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </a-spin>
    </div>

    <div style="padding: 14px;">
      <a-checkbox
        :disabled="verifying"
        v-model:checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      >
        <span>Select all</span>
      </a-checkbox>
      <a-button
        shape="round"
        type="primary"
        style="margin-right: 4px;"
        @click="handleLoadPageData"
        :loading="detecting"
        :disabled="verifying"
      >{{ detectButtonTitle }}</a-button>
      <a-button
        shape="round"
        type="primary"
        :loading="detecting || verifying"
        :disabled="!checkedList || !checkedList.length"
        @click="addToTask"
      >Add to Task</a-button>
    </div>

    <div>
      <a-button
        v-for="cluster in $bus.clusters"
        :key="`verify-${cluster}`"
        style="margin-right: 10px;"
        @click="handleVerify(cluster)"
        :loading="verifying || !$bus.candyPrograms[cluster]"
        :disabled="!checkedList || !checkedList.length"
      >Verify on {{ cluster }}</a-button>
    </div>
  </div>
</template>

<script>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { markRaw, createVNode } from 'vue'
import { tryGetPublicKeysFromPage, getPublicKeysFromStore, savePublicKeysToStore, getPublicKeySitiesFromStore, savePublicKeySitiesToStore } from '../utils/chrome'
import { cutAddress } from '../utils/common'
import { tryGetCandyMachine } from '../utils/solana'
import ClusterStatus from '../components/ClusterStatus.vue'

export default {
  name: 'Home',
  components: {
    ClusterStatus
  },
  data () {
    return {
      verifying: false,
      detecting: false,
      detectButtonTitle: 'Refresh',
      publicKeys: [],
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      verifyedList: [],
      verifyFailedList: [],
      data: {},
      cutAddress,
      tryGetCandyMachine,
      ExclamationCircleOutlined
    }
  },
  async created () {
    await this.handleLoadPageData()
  },
  methods: {
    async handleLoadPageData () {
      if (this.detecting) return

      this.detecting = true
      this.detectButtonTitle = 'Refreshing...'
      const { keys, data } = await tryGetPublicKeysFromPage()
      if (keys) {
        this.publicKeys = markRaw(keys)
        this.checkedList = [...keys]
        console.log('Detected keys:', keys)
        this.data = data
      }
      this.detectButtonTitle = 'OK'
      setTimeout(() => {
        this.detectButtonTitle = 'Refresh'
      }, 300)
      this.detecting = false
    },
    async handleVerify (cluster) {
      if (this.verifying) return

      this.verifying = true
      const program = this.$bus.candyPrograms[cluster]
      this.verifyedList = []
      this.verifyFailedList = []
      for (const mayPubKeys of this.checkedList) {
        try {
          const [publicKey] = await tryGetCandyMachine(mayPubKeys)
          const _candyProgram = await program.account.candyMachine.fetch(publicKey)
          this.verifyedList.push(mayPubKeys)
          console.log('Success Verified:', mayPubKeys)
        } catch (err) {
          this.verifyFailedList.push(mayPubKeys)
          console.error('Verify Error:', mayPubKeys, err)
        }
      }
      for (const i in this.checkedList) {
        if (!this.verifyedList.includes(this.checkedList[i])) {
          this.checkedList.splice(i, 1)
        }
      }
      if (this.verifyFailedList.length > 0) this.indeterminate = true
      this.$message.info(`Verify on "${cluster}" done. CandyMachine: ${this.verifyedList.length}, Others: ${this.verifyFailedList.length}`)
      this.verifying = false
    },
    onCheckAllChange (e) {
      this.checkedList = e.target.checked ? [...this.publicKeys] : []
      this.indeterminate = false
    },
    async addToTask () {
      this.$modal.confirm({
        title: `Add ${this.checkedList.length} PublicKeys to tasks?`,
        icon: createVNode(ExclamationCircleOutlined),
        content: 'PublicKeys will be saved in the browser extension, you can submit tasks to minter service.',
        onOk: async () => {
          await this.handleAddToTask()
          this.$message.success(`${this.checkedList.length} PublicKeys added!`)
        }
      })
    },
    async handleAddToTask () {
      await savePublicKeysToStore(await getPublicKeysFromStore(), this.checkedList)
      await savePublicKeySitiesToStore(await getPublicKeySitiesFromStore(), this.checkedList.reduce((pre, cur) => {
        pre[cur] = this.data.url
        return pre
      }, {}))
    }
  },
  watch: {
    'checkedList' (val) {
      this.indeterminate = !!val.length && val.length < this.publicKeys.length
      this.checkAll = val.length === this.publicKeys.length
    }
  }
}
</script>

<style lang="scss" scoped>
.publickeys-banner {
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  user-select: none;
  background-color: #f5eef8;

  span {
    color: #af7ac5;
  }
}

.select-item {
  padding: 2px;
  font-size: 12px;
}

.verify-content-box {
  height: 100px;
  border-radius: 4px;
  border: 1px solid rgb(217, 217, 217);
  overflow: auto;
  padding: 10px;
  margin: 10px 0 0 0;
}

.verified-item {
  font-weight: bold;
  background-color: #abebc6;
  color: #186a3b;
}

.verify-failed-item {
  font-weight: bold;
  background-color: #fadbd8;
  color: #78281f;
}
</style>
