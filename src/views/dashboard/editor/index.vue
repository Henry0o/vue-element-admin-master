<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb style="float: left">
        权限
        <span v-for="item in roles" :key="item" class="pan-info-roles">普通用户</span>
      </pan-thumb>
      <div class="info-container">
        <span class="display_name">你好，{{ name }}</span>
      </div>
    </div>
    <div>
      <el-form :model="QRForm" ref="QRForm" :rules="QRCreaterules" label-width="100px"
        style="width:50%;margin-left:25%;margin-top:3%">
        <el-form-item prop=" address" label="地址">
          <el-input v-model="QRForm.address"></el-input>
        </el-form-item>
        <el-form-item prop="owner" label="账号">
          <el-input v-model="QRForm.owner"></el-input>
        </el-form-item>
        <el-form-item prop="contact" label="联系人">
          <el-input v-model="QRForm.contact"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="QRForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="margin-left:40%" round @click="CreateQR('QRForm')">生成注册码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-dialog title="注册码" :visible.sync="ShowQR" width="30%" class="qrCode-dialog">
        <span>
          <vue-qr style=" margin-left:25%;" :text="config.value" :logoSrc="config.imagePath" :size="250" :margin="0">
          </vue-qr>
        </span>
        <span slot="footer" class="dialog-footer">

        </span>

      </el-dialog>
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
        QRForm: {
          address: '',
          owner: '',
          contact: '',
          phone: '',
          RegisterServerAdd: 'http://192.168.1.83:8080/gateways/addHealthCode',
          DataServerAdd: 'http://192.168.1.83:8080/healthInfos'
        },
        QRCreaterules: {
          owner: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }]
        },
        config: {
          value: '', //显示的值、跳转的地址
          imagePath: require('') //中间logo的地址
        },
        ShowQR: false

      }
    },
    methods: {
      CreateQR(QRForm) {
        this.$refs[QRForm].validate((valid) => {
          if (valid) {
            this.config.value = '~' + '{"address":"' + this.QRForm.address + '","owner":"' + this.QRForm.owner +
              '","contact":"' + this.QRForm.contact + '","phone":"' + this.QRForm.phone +
              '","RegisterServerAdd":"' +
              this.QRForm.RegisterServerAdd + '","DataServerAdd":"' + this.QRForm.DataServerAdd + '"}' + '.';
            this.ShowQR = true;
          } else {
            this.$message({
              showClose: true,
              message: '请输入账户',
              type: 'error'
            });
            return false;
          }
        })
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

    // .qrCode-dialog {
    //   padding: 50px;
    //   width: 100%;
    //   height: 100%;

    // }
  }

</style>
