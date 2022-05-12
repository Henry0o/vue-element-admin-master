<template>
  <div>
    <el-upload ref="upload" :limit="1" :before-upload="beforeUpload" :auto-upload="false" :headers="headers"
      :on-success="handleSuccess" :on-error="handleError" :action="'http://localhost:8080/healthInfos/upload'">
      <div><i class="el-icon-upload" /> 添加文件</div>
      <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过1000M</div>
    </el-upload>
    <el-button :loading="loading" type="primary" @click="upload">确认上传</el-button>
  </div>
</template>

<script>
  export default {
    name: 'upload',
    data() {
      return {
        loading: false,

        filename: ''
      }
    },
    methods: {
      // 上传文件
      upload() {
        this.$refs.upload.submit()
      },
      beforeUpload(file) {
        let isLt2M = true
        isLt2M = file.size / 1024 / 1024 < 1000
        if (!isLt2M) {
          this.loading = false
          this.$message.error('上传文件大小不能超过 1000MB!')
        }
        this.filename = file.name
        return isLt2M
      },
      handleSuccess(response, file, fileList) {
        this.$refs.upload.clearFiles()
        if (response.status === 200) {
          this.$notify({
            title: '上传成功',
            type: 'success',
            duration: 2500
          })
        } else {
          this.$notify({
            title: response.message,
            type: 'error',
            duration: 2500
          })
        }

      },
      // 监听上传失败
      handleError(e, file, fileList) {
        const msg = JSON.parse(e.message)
        this.$notify({
          title: msg.message,
          type: 'error',
          duration: 2500
        })
        this.loading = false
      }
    }
  }

</script>


<style scoped>
</style>
