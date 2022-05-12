<template>
  <div class="app-container">
    <el-autocomplete
      v-model="gateway"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      @select="handleSelect"
    />
    <el-button @click="handlConnection(gateway)"></el-button>
    <div> {{ this.$route.query.gateway }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gateWayList: [],
      gateway: '',
      timeout: null,
      websocket: null
    }
  },
  mounted() {
    this.gateway = this.$route.params.gateway
    this.gateWayList = this.loadAll()
    console.log(this.gateway)
    console.log(this.$route.params.gateway)
  },
  methods: {
    loadAll() {
      return [
      ]
    },
    querySearchAsync(queryString, cb) {
      var gateWayList = this.gateWayList
      var results = queryString ? gateWayList.filter(this.createStateFilter(queryString)) : gateWayList

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (gateway) => {
        return (gateway.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    handlConnection(gateway){
      this.websocket = new WebSocket('ws://localhost:8080/ws/' + gateway)
      this.websocket.addEventListener('open',this.handleWsOpen.bind(this),false)
      this.websocket.addEventListener('close',this.handleWsClose.bind(this),false)
      this.websocket.addEventListener('error',this.handleWsError.bind(this),false)
      this.websocket.addEventListener('message',this.handleWsMessage.bind(this),false)
    },
    handleWsOpen(e){
      console.log('FE:WebSocket open',e);
    },
    handleWsClose(e){
      console.log('FE:WebSocket close',e);
    },
    handleWsError(e){
      console.log('FE:WebSocket error',e);
    },
    handleWsMessage(e){
      console.log('FE:WebSocket message',e);
      const msg = JSON.parse(e.data);
      this.msgList.push(msg);
    }
  }
}
</script>

<style scoped>

</style>
