<template>
  <div class="app-container">
    <!-- 查询过滤上传模块 -->
    <div class="filter-container">
      <el-button type="primary" size @click="upLoadVisible=true">上传文件</el-button>
    </div>
    <!-- 列表模块 -->
    <div>
      <el-table v-loading="listLoading" :data="list" stripe border highlight-current-row style="width:100%;">
        <el-table-column fixed label="序号" prop="id" sortable width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本号" prop="version" sortable width="150" align="center">
          <template slot-scope="{row}">
            <span>{{ row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件名" prop="fileName" sortable width="auto" align="center">
          <template slot-scope="{row}">
            <!-- <span>{{ row.fileName }}</span> -->
            <el-link :href="'http://175.178.33.163:8080/healthInfos/download?name='+row.fileName ">
              {{ row.fileName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="别名" prop="aliasName" width="150" align="center">
          <template slot-scope="{row}">
            <span>{{ row.aliasName }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="330px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
      @pagination="getList" />
    <el-dialog title="上传文件" :visible.sync="upLoadVisible">
      <div>
        <el-form :model="fileInfo" label-position="left" label-width="120px" style="width: 72%; margin-left:10%;">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="fileInfo.version" />
          </el-form-item>
          <el-form-item label="文件名" prop="fileName">
            <el-input v-model="fileInfo.fileName" disabled />

          </el-form-item>
          <el-form-item label="文件别名" prop="aliasName">
            <el-input v-model="fileInfo.aliasName" />

          </el-form-item>

          <el-upload ref="upload" :limit="1" :headers="headers" :before-upload="beforeUpload" :auto-upload="false"
            :on-success="handleSuccess" :on-error="handleError"
            :action="'http://175.178.33.163:8080/healthInfos/upload'">
            <!-- :on-success="handleSuccess" :on-error="handleError" :action="'http://192.168.1.83:8080/healthInfos/upload'"> -->
            <div><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过1000M</div>
          </el-upload>
          <el-button :loading="loading" type="primary" @click="upload">确认上传</el-button>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="编辑文件信息" :visible.sync="dialogEditVisible">
      <el-form :model="temp" label-position="left" label-width="120px" style="width: 72%; margin-left:10%;">
        <el-form-item label="序号" prop="id">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="temp.fileName" disabled />

        </el-form-item>
        <el-form-item label="文件别名" prop="aliasName">
          <el-input v-model="temp.aliasName" />

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="EditFileInfo">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  import {
    fetchFileNameList,
    addFileName,
    editFileName,
    deleteFileName,
    deleteFile
  } from '@/api/fileNameList'
  export default {
    name: 'upload',
    data() {
      return {
        dialogEditVisible: false,
        list: null,
        total: 0,
        upLoadVisible: false,
        loading: false,
        listLoading: true,
        headers: {
          'Authorization': getToken()
        },
        filename: '',
        listQuery: {

          page: 1,
          size: 20,
          sortType: '',
          sortFields: ''
        },
        fileInfo: {
          version: '',
          fileName: '',
          aliasName: ''

        },
        temp: {
          id: 0,
          version: '',
          fileName: '',
          aliasName: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 上传文件
      getList() {
        this.listLoading = true;
        fetchFileNameList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.totalItems
          this.listLoading = false;
        })
      },
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
        this.fileInfo.fileName = file.name
        return isLt2M
      },
      handleSuccess(response, file, fileList) {
        addFileName(this.fileInfo).then(resp => {
          this.getList();
          this.upLoadVisible = false;
          this.$refs.upload.clearFiles()
          if (response.status === 200 && resp.status === 200) {
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
        })


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
      },
      handleEdit(row) {
        this.temp = Object.assign({}, row);
        this.dialogEditVisible = true
      },
      EditFileInfo() {
        editFileName(this.temp.id, this.temp).then(resp => {
          if (resp.status === 200) {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogEditVisible = false
          }
        })
      },
      handleDelete(row) {
        const id = row.id;
        deleteFile(row.fileName).then(res => {
          if (res.status === 200) {
            deleteFileName(id).then(() => {
              //TODO:删除文件
              this.$notify({
                title: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })

      }
    }
  }

</script>


<style scoped>
</style>
