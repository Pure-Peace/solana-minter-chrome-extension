<template>
  <div class="cluster-status-box">
    <div class="cluster-status">Cluster Connection Status</div>
    <div
      v-for="(cluster, index) in $bus.clusters"
      :key="`cluster-status-${index}`"
      class="cluster-status-item"
    >
      <div :class="['cluster-status-circle', statusCircleColor(cluster)]"></div>
      <div class="cluster-status-title">{{ cluster }}</div>
      <div class="cluster-status-text">{{ $bus.candyPrograms[cluster] ? '(Connected)' : '(Connecting...)' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    statusCircleColor (cluster) {
      return this.$bus.candyPrograms[cluster] ? 'status-avaliable' : 'status-loading'
    }
  }
}
</script>

<style scoped>
.cluster-status {
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
}

.cluster-status-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.cluster-status-text {
  font-size: 10px;
  color: #666666;
  padding: 2px;
}

.cluster-status-item {
  display: flex;
  align-items: center;
}

.cluster-status-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.cluster-status-title {
  font-weight: bold;
}

.status-avaliable {
  background-color: #2ecc71;
}

.status-loading {
  background-color: #f7dc6f;
}
</style>
