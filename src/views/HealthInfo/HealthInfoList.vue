<template>
  <div class="app-container">
    <!-- 查询模块 -->
    <div class="filter-container">
      <el-input v-model="listQuery.owner" placeholder="输入查询的账户" style="width:300px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search"
        @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh"
        @click="refreshList">
        刷新</el-button>

    </div>
    <!-- 列表模块 -->
    <div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width:100%;">
        <el-table-column label="账号" prop="owner" align="center">
          <template slot-scope="{row}">
            <span>{{ row.owner }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本" prop="version" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备序列号" prop="sn" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.sn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="二维码类型" prop="type" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column label="姓名" prop="name" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="健康码状态" prop="code_color" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.code_color }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核酸结果" prop="pcr_result" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.pcr_result }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size @click="handleDetials(row)">
              详情
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

    <el-dialog title="新增健康码信息" :visible.sync="dialogCreateVisible">
      <el-form :rules="createRules" :model="createList" label-position="left" label-width="100px"
        style="width: 72%; margin-left:10%;">
        <el-form-item label="设备序列号" prop="sn">
          <el-input v-model="createList.sn" />
        </el-form-item>
        <el-form-item label="账号" prop="owner">
          <el-input v-model="createList.owner" />
        </el-form-item>
        <el-form-item label="信息类型" prop="type">
          <el-input v-model="createList.type" />
        </el-form-item>
        <el-form-item label="健康码颜色" prop="code_color">
          <el-input v-model="createList.code_color" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createHealthInfo">
          新建
        </el-button>
      </div>
    </el-dialog>

    <!-- 详情对话框界面 -->
    <el-dialog title="详情" :visible.sync="dialogDetailsVisible">
      <el-form :rules="EditRules" :model="temp" label-position="left" label-width="120px"
        style="width: 72%; margin-left:10%;">
        <el-form-item label="设备序列号" prop="sn">
          <el-input v-model="temp.sn" disabled />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="账号" prop="owner">
          <el-input v-model="temp.owner" disabled />
        </el-form-item>
        <el-form-item label="信息类型" prop="type">
          <el-input v-model="temp.type" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="id_card">
          <el-input v-model="temp.id_card" />
        </el-form-item>
        <el-form-item label="脱敏姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="脱敏电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="码颜色" prop="code_color" required>
          <el-input v-model="temp.code_color" />
        </el-form-item>
        <el-form-item label="抓拍照片" prop="photo">
          <el-button v-show="showimg_button_visible" type="primary" @click="showPhoto(temp.photo)">显示</el-button>
          <el-button v-show="!showimg_button_visible" type="info" plain disabled>未上传</el-button>
        </el-form-item>
        <el-form-item label="图片抓拍时间" prop="photo_time">
          <el-input v-model="temp.photo_time" />
        </el-form-item>
        <el-form-item label="核酸检测机构" prop="pcr_jgmc">
          <el-input v-model="temp.pcr_jgmc" />
        </el-form-item>
        <el-form-item label="核酸时间" prop="pcr_time">
          <el-input v-model="temp.pcr_time" />
        </el-form-item>
        <el-form-item label="核酸结果" prop="pcr_result">
          <el-input v-model="temp.pcr_result" />
        </el-form-item>
        <el-form-item label="疫苗" prop="vacc">
          <!-- <el-input v-model="temp.vacc" /> -->
          <div v-if="temp.vacc===-1">无数据</div>
          <div v-if="temp.vacc===0">未接种</div>
          <div v-if="temp.vacc===1">一针</div>
          <div v-if="temp.vacc===2">两针</div>
          <div v-if="temp.vacc===3">三针</div>
        </el-form-item>
        <el-form-item label="疫苗日期" prop="vacc_date">
          <el-input v-model="temp.vacc_date" />
        </el-form-item>
        <el-form-item label="健康码展示时间" prop="qr_show">
          <el-input v-model="temp.qr_show" />
        </el-form-item>
        <el-form-item label="健康码生成时间" prop="qr_create">
          <el-input v-model="temp.qr_create" />
        </el-form-item>
        <el-form-item label="行程信息" prop="trip">
          <el-input v-model="temp.trip" />
        </el-form-item>
        <el-form-item label="二维码内容" prop="qr_content">
          <el-input v-model="temp.qr_content" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailsVisible = false">
          关闭
        </el-button>
        <el-button type="success" @click="HandleEditHealthInfo">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片" :visible.sync="showImage">
      <img :src="'data:image/jpg;base64,'+photoBase64" width="100%" alt="图片未上传" />
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'

  import {
    fetchHealthInfoList,
    createNewHealthInfo,
    deleteHealthInfo,
    editHealthInfo
  } from '@/api/healthinfo'
  export default {
    name: 'GatewayList',
    components: {
      Pagination
    },

    data() {
      return {
        showimg_button_visible: false,
        showImage: false,
        photoBase64: '',
        list: null,
        total: 0,
        listLoading: true,
        EditRules: {
          code_color: [{
            required: true,
            message: '请输入健康码颜色',
            trigger: 'blur'
          }]
        },
        createRules: {
          sn: [{
            required: true,
            message: '请输入sn序列号',
            trigger: 'blur'
          }],
          owner: [{
            required: true,
            message: '请输入设备所有者账户',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请输入信息类型',
            trigger: 'blur'
          }],
          code_color: [{
            required: true,
            message: '请输入健康码颜色',
            trigger: 'blur'
          }]

        },
        listQuery: {
          owner: '',
          page: 1,
          size: 20,
          sort: ''
        },

        temp: {
          uuid: '',
          sn: '',
          version: '',
          owner: '',
          type: '',
          id_card: '',
          name: '',
          phone: '',
          code_color: '',
          photo: '',
          photo_time: '',
          pcr_jgmc: '',
          pcr_time: '',
          pcr_result: '',
          vacc: -1,
          vacc_date: '',
          qr_show: '',
          qr_create: '',
          trip: '',
          qr_content: ''
        },
        createList: {
          sn: '',
          version: '',
          owner: '',
          type: '',
          id_card: '',
          name: '',
          code_color: '',
          photo: '',
          photo_time: '',
          pcr_jgmc: '',
          pcr_time: '',
          pcr_result: '',
          qr_content: ''
        },
        dialogCreateVisible: false,
        dialogDetailsVisible: false

      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchHealthInfoList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.totalItems
          this.listLoading = false
        })
      },
      refreshList() {

        this.listLoading = true
        fetchHealthInfoList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.totalItems
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })


      },
      handleFilter(row) {
        if (this.$store.getters.roles[0] === 'USER' && this.listQuery.owner !== this.$store.getters.email) {
          this.$notify({
            title: '权限不足',
            message: '对不起，您无权查看其他用户信息',
            type: 'error',
            duration: 2000
          })
        } else {
          this.getList()
        }
      },
      handleCreate() {
        this.dialogCreateVisible = true
      },
      handleDetials(row) {
        this.temp = Object.assign({}, row)
        this.dialogDetailsVisible = true
        console.log(this.temp.photo)
        if (this.temp.photo.length > 0) {
          this.showimg_button_visible = true
        } else {
          this.showimg_button_visible = false
        }
      },
      HandleEditHealthInfo() {
        editHealthInfo(this.temp).then(() => {
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogDetailsVisible = false
          this.showimg_button_visible = false
        })
      },
      createHealthInfo() {
        createNewHealthInfo(this.createList).then(() => {
          this.$notify({
            title: '新建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogCreateVisible = false
        })
      },
      handleDelete(row) {
        const uuid = row.uuid
        deleteHealthInfo(uuid).then(() => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      showPhoto(photo) {
        this.photoBase64 = photo;
        this.showImage = true;
      }


    }
  }

</script>

<style>

</style>
