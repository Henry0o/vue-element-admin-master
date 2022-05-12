<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb style="float: left">
        你的权限
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <div class="info-container">
        <span class="display_name">{{ name }}</span>
        <span style="font-size:20px;padding-top:20px;display:inline-block;">管理员桌面</span>
      </div>
    </div>
    <div>
      <vue-qr style="float:left;margin-left:200px;" :text="config.value" :size="200" :margin="0"></vue-qr>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import GithubCorner from '@/components/GithubCorner'
  import VueQr from 'vue-qr'


  export default {
    name: 'DashboardEditor',
    components: {
      PanThumb,
      GithubCorner,
      VueQr
    },
    data() {
      return {
        QRCreateForm: {
          owner: '123',
          address: '123',
          contact: '123',
          phone: '123'
        },
        config: {
          value: 'QRCreateForm.Cowner + QRCreateForm.address + QRCreateForm.contact + QRCreateForm.phone', //显示的值、跳转的地址
          // imagePath: require('../../icons/nuttu.ico') //中间logo的地址
        },
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles'
      ])
    }
  }

</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0px;

    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;

      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }

</style>
