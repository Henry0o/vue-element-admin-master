<template>

  <div class="app-container">
    <div>Socket测试</div>
    <li  v-for="msg of msgList" :key="msg">
      <span>{{msg}}</span>
    </li>
<!--    <el-input v-model="message" placeholder="等待客户端发送消息" :disabled="true" />-->
  </div>

</template>

<script>
// import jsCookie from 'js-cookie'
export default {
  name: 'Test',
  data() {
    // const msgList = []
    // const uuid = jsCookie.get('uuid')
    return {
      webSocket: null,
      // uuid,
      // message: null,
      msgList: []
    }
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.webSocket.close()
  },
  mounted() {
    // WebSocket
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://localhost:8080/ws/' + '08201E5048F943639A093718C6ACA5E2')
      console.log('准备连接websocket')
      console.log('08201E5048F943639A093718C6ACA5E3')
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  beforeDestroy() {
    this.onbeforeunload()
  },
  methods: {
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
      console.log('WebSocket连接发生错误 状态码：' + this.websocket.readyState)
    },
    setOnopenMessage() {
      console.log('WebSocket连接成功 状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log(event)
      console.log('服务端返回：' + event.data)
      this.msgList.push(event.data)
    },
    setOncloseMessage() {
      console.log('WebSocket连接关闭 状态码：' + this.websocket.readyState)
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      this.websocket.close()
    }
  }
}

</script>
<style scoped>

</style>
