<template>

  <div>
    <h>wing阿里云服务器</h>
    <br />
    <!-- <video id="videoElement" controls autoplay width="720px" height="auto"></video> -->
    <JessibucaDemo />
    <br />
    <!-- <button @click="play">播放</button> -->

  </div>


</template>

<script>
  import flvjs from 'flv.js'
  import JessibucaDemo from '@/components/Jessibuca/Jessibuca.vue'
  export default {
    // data() {
    //   return {
    //     msg: 'Welcome to Your Vue.js App',
    //     flvPlayer: null
    //   }
    // },
    // mounted() {
    //   if (flvjs.isSupported()) {
    //     var videoElement = document.getElementById('videoElement');
    //     this.flvPlayer = flvjs.createPlayer({
    //       type: 'flv',
    //       isLive: true,
    //       hasAudio: true,
    //       url: 'http://120.76.249.195:82/rtmpLive?port=1935&app=myapp&stream=mystream'
    //     });
    //     this.flvPlayer.attachMediaElement(videoElement);
    //     this.flvPlayer.load();
    //     this.flvPlayer.play();
    //   }
    // },
    // methods: {
    //   play() {
    //     this.flvPlayer.play();
    //   }
    // },
    components: {
      JessibucaDemo
    }
  }

</script>

<style>

</style>
