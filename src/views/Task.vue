<template>
  <div style="padding: 15px 15px 0 15px">
    <div class="publickeys-banner">
      <span>{{ publicKeys.length }}</span> PublicKeys Founded
    </div>

    <a-spin tip="Sending..." :spinning="Sending">
      <div class="verify-content-box">
        <a-checkbox-group v-model:value="checkedList">
          <div
            v-for="v in publicKeys"
            :key="`${v}`"
            style="display: flex; justify-content: flex-start;"
          >
            <a-checkbox :value="v">
              <div class="select-site">{{ publicKeysSities[v] }}</div>
              <div :class="['select-item']">{{ v }}</div>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </a-spin>
    <a-select
      ref="select"
      style="width: 100%; padding: 10px;"
      placeholder="Select minter service"
      v-model:value="value1"
      @focus="focus"
      @change="handleChange"
    >
      <a-select-option value="jack">Jack</a-select-option>
      <a-select-option value="lucy">Lucy</a-select-option>
      <a-select-option value="disabled" disabled>Disabled</a-select-option>
      <a-select-option value="Yiminghe">yiminghe</a-select-option>
    </a-select>
  </div>
</template>

<script>
import {
  getPublicKeysFromStore,
  getPublicKeySitiesFromStore
} from '../utils/chrome'

export default {
  data () {
    return {
      Sending: false,
      publicKeys: [],
      checkedList: [],
      publicKeysSities: {}
    }
  },
  async created () {
    await this.init()
  },
  methods: {
    async init () {
      this.publicKeys = await getPublicKeysFromStore()
      this.publicKeysSities = await getPublicKeySitiesFromStore()
    }
  }
}
</script>

<style scoped lang="scss">
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
  margin: 10px 0 10px 0;
}

.select-site {
  color: #af7ac5;
}
</style>
