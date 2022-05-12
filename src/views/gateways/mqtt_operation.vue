<template>
  <div id="app">
    <el-container style="width: auto; height: auto;overflow-y:scroll;overflow-x:hidden;">
      <el-header style="font-weight: bolder;font-size: larger">远程操控设备客户端</el-header>
      <el-container direction="horizontal ">
        <el-aside width="20%">
          <div style="text-align: center">MQTT消息栏</div>
          <ul id="messages_list" style="background-color: white;height: 800px;overflow-y: scroll">
            <li v-for="message in messageList" style="list-style-type:none;">
              <span v-html="message">{{ message }}</span>
            </li>
          </ul>
        </el-aside>
        <el-container direction="vertical">
          <el-main>
            <div>
              <video id="videoElement" controls autoplay  width="960px" height="auto" ></video>
<!--              <br/>-->
<!--              <button @click="play">播放</button>-->
            </div>
          </el-main>
          <el-footer style="height: auto">
            <el-form label-width="100px">
              <el-form-item label="消 息  订 阅">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-select v-model="gatewayMac" clearable placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in list"
                        :key="item.uuid"
                        :label="item.mac"
                        :value="item.mac">
                        <span style="float: left">{{ item.mac }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-input v-model="gatewayMac" placeholder="请输入要连接的设备Mac地址" disabled></el-input>
                  </el-col>
                  <el-col :span="6" :offset="1">
                    <el-button type="success" circle icon="el-icon-connection" @click="handleConnection"></el-button>
                    <el-button type="danger" circle icon="el-icon-close" @click="onDisConnect"></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="版 本  查 询">
                <el-row :gutter="20">

                  <el-col :span="12">
                    <div v-model="version" style="text-align: center">当前版本信息：{{ version }}</div>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-search" round @click="QueryVersion">查询</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="视频帧率设置">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-slider v-model="fps" input-size=mini :max=60 show-input></el-slider>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-s-tools" round @click="FpsSet">设置</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="图框位置设置" size="small">
                <el-row :gutter="20">
                  <el-col :span="3">
                    <el-form-item label="x" label-width="30%">
                      <el-input v-model="blockLocation.x" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="y" label-width="30%">
                      <el-input v-model="blockLocation.y" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="wide" label-width="30%">
                      <el-input v-model="blockLocation.with" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="high" label-width="30%">
                      <el-input v-model="blockLocation.high" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-setting" round @click="SetLocation" size="medium">设置
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="曝光能力查询">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div v-model="ExposureCapacity" style="text-align: center">
                      最大曝光时间:{{ ExposureCapacity.exp }} 曝光步长:{{ ExposureCapacity.exp_step }}</br>
                      最大数字增益:{{ ExposureCapacity.dgain }} 数字增益步长:{{ ExposureCapacity.dgain_step }}</br>
                      最大模拟增益:{{ ExposureCapacity.again }} 模拟增益步长:{{ ExposureCapacity.again_step }}</br>
                    </div>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-camera" round @click="ExposureCapQuery" size="medium">查询
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="曝光参数设置">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-form-item label="曝光时间" label-width="40%">
                      <el-input v-model="ExposureParam.exp" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="数字增益" label-width="40%">
                      <el-input v-model="ExposureParam.dgain" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="模拟增益" label-width="40%">
                      <el-input v-model="ExposureParam.again" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-setting" round @click="ExpParamSet" size="medium">设置
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="最优曝光设置">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-form-item label="曝光时间" label-width="40%">
                      <el-input v-model="OptimalExposureParam.exp" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="数字增益" label-width="40%">
                      <el-input v-model="OptimalExposureParam.dgain" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="模拟增益" label-width="40%">
                      <el-input v-model="OptimalExposureParam.again" style="width: 80px"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button type="primary" icon="el-icon-setting" round @click="OptimalExpParamSet" size="medium">
                      设置
                    </el-button>
                  </el-col>
                </el-row>

              </el-form-item>
            </el-form>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>

</template>
<script type="text/javascript">
import Paho from '../../paho-mqtt.js'
import flvjs from 'flv.js'
import {fetchGatewaysList} from "@/api/gateways";
import {
  gwVerQuery,
  gwSetFps,
  gwSetLocation,
  gwExposureCapQuery,
  gwExpParamSet,
  gwOptimalExpParamSet
} from "@/api/mqtt-operation"
import Vue from "vue";

const MQTT_IP = '192.168.1.83'
const MQTT_PORT = 9001
const MQTT_PATH = ''
const MQTT_CLIENTID = 'ClientIdVueTest'

export default {
  name: 'mqtt_operation',
  data: function () {
    return {
      client: new Paho.MQTT.Client(MQTT_IP, MQTT_PORT, MQTT_PATH, MQTT_CLIENTID),
      topic: '/gw/#',
      messageList: [],

      gatewayMac: '',
      list: null,
      version: '暂无设备版本信息',
      fps: 0,
      blockLocation: {
        x: 0,
        y: 0,
        with: 0,
        high: 0
      },
      ExposureCapacity: {
        exp: 0,         //最大曝光时间
        exp_step: 0,    //曝光步长
        dgain: 0,       //最大数字增益
        dgain_step: 0,  //数字增益步长
        again: 0,       //最大模拟增益
        again_step: 0   //模拟增益步长
      },
      ExposureParam: {
        exp: 0,
        dgain: 0,
        again: 0
      },
      OptimalExposureParam: {
        exp: 0,
        dgain: 0,
        again: 0
      },

      msg: 'Welcome to Your Vue.js App',
      flvPlayer:null

    }
  },
  created: function () {
    this.getList()
    this.gatewayMac = this.$route.params.gateway
  },
  mounted() {
    this.gatewayMac = this.$route.params.gateway
    if (flvjs.isSupported()) {
      var videoElement = document.getElementById('videoElement');
      this.flvPlayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        hasAudio: true,
        //wing阿里云服务器推流地址
        // url: 'http://120.76.249.195:82/rtmpLive?port=1935&app=myapp&stream=mystream'
        //公司83服务器推流地址,其中stream选项可以由设备mac地址更换
        //设备推流地址rtmp://192.168.1.83:1936/myapp/mystream
        url:'http://192.168.1.83:81/rtmplive?port=1936&app=myapp&stream=mystream'
      });
      this.flvPlayer.attachMediaElement(videoElement);
      this.flvPlayer.load();
      this.flvPlayer.play();
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchGatewaysList({page: 1, size: 1000}).then(response => {
        this.list = response.data
      })
    },
    handleConnection: function () {
      if ((this.client === null)) {
        this.client = new Paho.MQTT.Client(MQTT_IP, MQTT_PORT, MQTT_PATH, MQTT_CLIENTID)
      }
      this.client.connect({
        onSuccess: this.onConnect,
        userName: 'admin',
        password: 'admin'
      })
      this.client.onConnectedLost = this.onConnectedLost
      this.client.onMessageArrived = this.onMessageArrived
    },
    onConnectedLost: function (responseObject) {
      console.log('onConnectionLost:' + responseObject.errorMessage)
    },
    onMessageArrived: function (message) {
      console.log('onMessageArrived:' + message.payloadString)
      if (message.topic.endsWith('/register')) {
        this.$notify({
          title: '成功',
          message: '有设备申请注册',
          type: 'success'
        })
      } else if (message.topic.endsWith('/ver_query')) {
        // 接收到的为版本查询消息
        console.log(JSON.parse(message.payloadString))
        this.messageList.push("版本信息:</br>" + JSON.parse(message.payloadString).version)
        this.version = JSON.parse(message.payloadString).version
      } else if (message.topic.endsWith('/set_fps')) {
        //  接收到的为视频帧率设置回复消息
        console.log(JSON.parse(message.payloadString).head)
        let fpsParam = JSON.parse(message.payloadString).head
        let res_value = 0
        //  后八位代表帧率数值，截取出来
        fpsParam = fpsParam.slice(10)

        console.log(this.Str2Int(fpsParam.substr(6, 2)))
        //  转换为十进制
        res_value = this.Str2Int(fpsParam.substr(0, 2)) * 16 * 16 * 16 +
          this.Str2Int(fpsParam.substr(2, 2)) * 16 * 16 +
          this.Str2Int(fpsParam.substr(4, 2)) * 16 +
          this.Str2Int(fpsParam.substr(6, 2))
        this.messageList.push("帧率设置成功！</br>当前帧率:" + res_value)
        this.fps = res_value

      } else if (message.topic.endsWith('/set_location')) {
        //  接收到的为图框位置设置回复消息
        if (JSON.parse(message.payloadString).result === 0) {
          this.messageList.push("框图位置设置成功!")
        } else {
          this.messageList.push("框图位置设置失败!")
        }
      } else if (message.topic.endsWith('/expcap_query')) {
        //  接收到的为曝光能力查询回复消息
        this.ExposureCapacity = Object.assign({}, JSON.parse(message.payloadString))
        console.log(JSON.stringify(this.ExposureCapacity))
        this.messageList.push("查询到设备曝光能力为:</br>" +
          "最大曝光时间:" + this.ExposureCapacity.exp + "</br>" +
          "曝光时间步长:" + this.ExposureCapacity.exp_step + "</br>" +
          "最大数字增益:" + this.ExposureCapacity.dgain + "</br>" +
          "数字增益步长:" + this.ExposureCapacity.dgain_step + "</br>" +
          "最大模拟增益:" + this.ExposureCapacity.again + "</br>" +
          "模拟增益步长:" + this.ExposureCapacity.again_step + "</br>")

      } else if (message.topic.endsWith('/expparam_set')) {
        //  接收到的为曝光参数设置回复消息
        if (JSON.parse(message.payloadString).result === 0) {
          this.messageList.push("曝光参数设置成功!")
        } else {
          this.messageList.push("曝光参数设置失败!")
        }
      } else if (message.topic.endsWith('/optexp_set')) {
        //  接收到的为最优曝光参数设置回复消息
        if (JSON.parse(message.payloadString).result === 0) {
          this.messageList.push("最优曝光参数设置成功!")
        } else {
          this.messageList.push("最优曝光参数设置失败!")
        }
      }
      // TODO:其他后缀
    },
    Str2Int: function Str2Int(str) {
      let res = 0
      let temp = 0
      temp = (str.charCodeAt(0) - 48) * 16 + (str.charCodeAt(1) - 48)
      if (temp >= 48 && temp <= 57) {
        res = temp - 48
      } else if (temp >= 65 && temp <= 70) {
        res = temp - 65 + 10
      } else if (temp >= 97 && temp <= 102) {
        res = temp - 97 + 10
      }
      return res
    },
    onConnect: function onConnect() {
      console.log('onConnect')
      this.topic = '/gw/' + this.gatewayMac + '/#'
      this.client.subscribe(this.topic, 0)
      this.$notify({
        title: '成功',
        message: '成功订阅设备' + this.gatewayMac,
        type: 'success'
      })
    },
    onDisConnect: function () {
      this.client.unsubscribe(this.topic)
      this.client = null
      console.log("lost connection")
      this.$notify({
        title: '断开连接',
        message: '取消订阅设备' + this.gatewayMac,
      })
    },
    //POST后端，通过后端发送MQTT的publish消息
    //版本查询请求
    QueryVersion() {
      gwVerQuery(this.gatewayMac).then((response) => {
        console.log(response)
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送版本查询消息成功',
            type: 'success'
          });
        } else {
          this.$notify({
            title: '失败',
            message: '发送版本查询消息失败',
            type: 'error'
          });
        }
      })
    },
    FpsSet() {
      gwSetFps(this.gatewayMac, this.fps).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送视频帧率设置消息成功',
            type: 'success'
          });
        } else {
          this.$notify({
            title: '失败',
            message: '发送视频帧率设置消息失败',
            type: 'error'
          });
        }
      })
    },
    SetLocation() {
      let blockLocation = this.blockLocation;
      console.log(blockLocation)
      gwSetLocation(this.gatewayMac, blockLocation).then(response => {
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送框图位置设置消息成功',
            type: 'success'
          });
        }
      })
    },
    ExposureCapQuery() {
      gwExposureCapQuery(this.gatewayMac).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送设备曝光能力查询消息成功',
            type: 'success'
          });
        }
      })
    },
    ExpParamSet() {
      gwExpParamSet(this.gatewayMac, this.ExposureParam).then(response => {
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送曝光参数设置消息成功',
            type: 'success'
          });
        }
      })
    },
    OptimalExpParamSet() {
      gwOptimalExpParamSet(this.gatewayMac, this.OptimalExposureParam).then(response => {
        if (response.status === 200) {
          this.$notify({
            title: '成功',
            message: '发送最优曝光参数设置消息成功',
            type: 'success'
          });
        }
      })
    },
    play () {
      this.flvPlayer.play();
    }
  }
}
</script>
<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-footer {
  background-color: #ffffff;
  color: #333;
  text-align: left;
  line-height: 60px;
  scroll-behavior: auto;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  margin-bottom: 0px;
  /*text-align: center;*/
  /*line-height: 200px;*/
  /*height: 500px;*/
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  /*line-height: 160px;*/
}

.title {
  text-align: center;
}
</style>
