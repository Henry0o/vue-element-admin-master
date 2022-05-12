<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="更新包发布">
        <el-switch v-model="form.boardUpdate"></el-switch>
      </el-form-item>
      <el-form-item label="最新版本">
        <el-input v-model="form.new_version"></el-input>
      </el-form-item>
      <el-form-item label="更新包路径">
        <el-input v-model="form.update_url"></el-input>
      </el-form-item>
      <el-form-item label="广播配置设置">
        <el-switch v-model="form.boardConfig"></el-switch>
      </el-form-item>
      <el-form-item label="图片上报">
        <el-switch v-model="form.openPhotoUpload"></el-switch>
      </el-form-item>
      <el-form-item label="超时警报">
        <!-- <el-radio v-model="form.TimeOverWarn" label=0 border>超时不告警</el-radio>
        <el-radio v-model="form.TimeOverWarn" label=1 border>超过24小时告警</el-radio>
        <el-radio v-model="form.TimeOverWarn" label=2 border>超过48小时告警</el-radio>
        <el-radio v-model="form.TimeOverWarn" label=3 border>超过72小时告警</el-radio> -->
        <!-- <el-select v-model="form.TimeOverWarn" placeholder="请选择活动区域">
          <el-option label="超时不告警" value=0></el-option>
          <el-option label="超过24小时告警" value=1></el-option>
          <el-option label="超过48小时告警" value=2></el-option>
          <el-option label="超过72小时告警" value=3></el-option>
        </el-select> -->
        <el-radio-group v-model="form.TimeOverWarn">
          <el-radio :label=0>超时不告警</el-radio>
          <el-radio :label=1>超过24小时告警</el-radio>
          <el-radio :label=2>超过48小时告警</el-radio>
          <el-radio :label=3>超过72小时告警</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="EditList(form)">修改</el-button>
        <el-button @click="getList">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {
    getDeviceConfig,
    editDeviceConfig,
  } from '@/api/healthinfo'

  const OPEN_PHOTO_UPLOAD = '0366H0001';
  const CLOSE_PHOTO_UPLOAD = '0366H0000';
  const OVER_24H_WARN = '0369H0001';
  const OVER_48h_WARN = '0369H0002';
  const OVER_72h_WARN = '0369H0003';
  const OVER_NO_WARN = '0369H0000';

  export default {

    data() {

      return {
        form: {
          boardUpdate: false,
          new_version: '',
          update_url: '',
          boardConfig: false,
          openPhotoUpload: false,
          TimeOverWarn: 0,
        },
        editform: {
          version: '',
          boardConfig: 0,
          config: '',
          upg_path: '',
          boardUpdate: 0,
        }
      }
    },
    created() {
      this.getList();
    },
    watch() {

    },
    methods: {
      getList() {
        getDeviceConfig().then(response => {
          this.editform = response.data;
          console.log(this.editform)
          if (this.editform.boardUpdate === 1) {
            this.form.boardUpdate = true;
          } else {
            this.form.boardUpdate = false;
          }
          if (this.editform.boardConfig === 1) {
            this.form.boardConfig = true;
          } else {
            this.form.boardConfig = false;
          }
          this.form.new_version = this.editform.version;
          this.form.update_url = this.editform.upg_path;
          if (this.editform.config.includes(OPEN_PHOTO_UPLOAD)) {
            this.form.openPhotoUpload = true;
          }
          if (this.editform.config.includes(CLOSE_PHOTO_UPLOAD)) {
            this.form.openPhotoUpload = false;
          }
          if (this.editform.config.includes(OVER_24H_WARN)) {
            this.form.TimeOverWarn = 1;
          }
          if (this.editform.config.includes(OVER_48h_WARN)) {
            this.form.TimeOverWarn = 2;
          }
          if (this.editform.config.includes(OVER_72h_WARN)) {
            this.form.TimeOverWarn = 3;
          }
          if (this.editform.config.includes(OVER_NO_WARN)) {
            this.form.TimeOverWarn = 0;
          }
          console.log(this.form)
        })
      },
      EditList(form) {
        console.log(form)
        this.editform.version = form.new_version;
        this.editform.upg_path = form.update_url;
        if (form.boardUpdate) {
          this.editform.boardUpdate = 1;
        } else {
          this.editform.boardUpdate = 0;
        }
        if (form.boardConfig) {
          this.editform.boardConfig = 1;
        } else {
          this.editform.boardConfig = 0;
        }
        let config_temp = '~';
        if (form.openPhotoUpload) {
          config_temp += OPEN_PHOTO_UPLOAD;
          config_temp += ';'
        } else {
          config_temp += CLOSE_PHOTO_UPLOAD;
          config_temp += ';'
        }
        if (form.TimeOverWarn === 0) {
          config_temp += OVER_NO_WARN;
        } else if (form.TimeOverWarn === 1) {
          config_temp += OVER_24H_WARN;
        } else if (form.TimeOverWarn === 2) {
          config_temp += OVER_48h_WARN;
        } else {
          config_temp += OVER_72h_WARN;
        }
        config_temp += '.';
        console.log(config_temp)
        this.editform.config = config_temp;
        console.log(this.editform.config)
        editDeviceConfig(this.editform).then(response => {
            if (response.status == 200) {
              this.$notify({
                title: '修改成功',
                type: 'success'
              });

            } else {
              this.$notify({
                title: '修改失败',
                type: 'error'
              });
            }
          }

        )

      }
    }
  }

</script>

<style scoped>

</style>
