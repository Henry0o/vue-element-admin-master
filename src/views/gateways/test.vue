<template>
  <div>Demo</div>
</template>
<script>
export default {
  name: 'Test'
}
var mqtt = require('mqtt')

var clientId = 'my_mqtt'

var host = 'ws://192.168.1.83'

var globalCallback = null

var options = {
  keepalive: 10,

  clientId: clientId,

  protocolId: 'MQTT',

  protocolVersion: 4,

  clean: true,

  reconnectPeriod: 1000,

  connectTimeout: 30 * 1000,

  will: {
    topic: 'WillMsg',

    payload: 'Connection Closed abnormally..!',

    qos: 0,

    retain: false

  },

  username: 'admin',

  password: 'admin',

  rejectUnauthorized: false

}

var client = mqtt.connect(host, options)

function websocketMQTT(theme) {
  client.on('error', function(err) {
    console.log('connect is error!', err)

    client.end()
  })

  client.on('connect', function() {
    console.log('client connected(连接成功):' + clientId)
  })

  client.subscribe(theme, { qos: 0 })

  // client.publish(theme, data, { qos: 0, retain: false })

  client.on('message', function(theme, message, packet) {
    // console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)

    globalCallback(message)
  })

  client.on('close', function() {
    console.log(clientId + ' disconnected')
  })
}

function websocketSend(theme, data) {
  client.publish(theme, data, { qos: 0, retain: false })
}

function sendSock(theme, data, callback) {
  globalCallback = callback

  if (client.readyState === client.OPEN) {
    websocketSend(theme, data)
  } else if (client.readyState === client.CONNECTING) {
    setTimeout(function() {
      sendSock(theme.data, callback)
    }, 1000)
  } else {
    setTimeout(function() {
      sendSock(theme.data, callback)
    }, 1000)
  }
}

export {
  websocketMQTT, sendSock

}
</script>

<style scoped>

</style>
