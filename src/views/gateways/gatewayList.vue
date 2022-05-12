<template>
  <div class="app-container">
    <!-- 查询模块 -->

    <div class="filter-container">

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">新增</el-button>
    </div>
    <!-- 列表模块 -->
    <div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width:100%;">
        <el-table-column label="名字" prop="name" sortable width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版本" prop="version" sortable width align="center">
          <template slot-scope="{row}">
            <span>{{ row.version }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="corp" sortable width align="center">
          <template slot-scope="{row}">
            <span>{{ row.corp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备序列号" prop="mac" sortable width="300px" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleEdit(row)">{{ row.mac }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理员" prop="admin_name" sortable width align="center">
          <template slot-scope="{row}">
            <span>{{ row.admin_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作员" prop="maintain_name" sortable width align="center">
          <template slot-scope="{row}">
            <span>{{ row.maintain_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="active" sortable width align="center">
          <template slot-scope="{row}">
            <span>{{ row.active?"激活":"停用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <!-- <el-button type="primary" size @click="handleOperation(row)">
              连接
            </el-button> -->
            <el-button type="primary" size @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button v-if="!row.active" type="success" size @click="handleActivate(row)">
              激活
            </el-button>
            <el-button v-if="row.active" type size @click="handleStop(row)">
              停用
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

    <el-dialog title="新增设备" :visible.sync="dialogCreateVisible">
      <el-form :rules="createRules" :model="createList" label-position="left" label-width="120px"
        style="width: 72%; margin-left:10%;">
        <el-form-item label="名字" prop="name">
          <el-input v-model="createList.name" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="createList.version" />
        </el-form-item>
        <el-form-item label="设备序列号" prop="mac">
          <el-input v-model="createList.mac" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="createList.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createGateWays">
          新建
        </el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框界面 -->
    <el-dialog title="编辑" :visible.sync="dialogEditVisible">
      <el-form :rules="EditRules" :model="temp" label-position="left" label-width="120px"
        style="width: 72%; margin-left:10%;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="设备序列号" prop="mac">
          <el-input v-model="temp.mac" disabled />
        </el-form-item>
        <el-form-item label="公司" prop="corp">
          <el-input v-model="temp.corp" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="管理员" prop="admin_name">
          <el-input v-model="temp.admin_name" />
        </el-form-item>
        <el-form-item label="管理员联系方式" prop="admin_contact">
          <el-input v-model="temp.admin_contact" />
        </el-form-item>
        <el-form-item label="操作员" prop="maintain_name">
          <el-input v-model="temp.maintain_name" />
        </el-form-item>
        <el-form-item label="操作员联系方式" prop="maintain_contact">
          <el-input v-model="temp.maintain_contact" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-input v-model="temp.createdAt" disabled />
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <el-input v-model="temp.updatedAt" disabled />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="2" placeholder="请输入描述内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="EditGateWays">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {
    fetchGatewaysList,
    createNewGateway,
    deleteGateway,
    editGateway,
    activatedGateway,
    deactivatedGateway
  } from '@/api/gateways'

  export default {
    name: 'GatewayList',
    components: {
      Pagination
    },

    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        EditRules: {
          name: [{

          }]
        },
        createRules: {
          mac: [{
            required: true,
            message: '请输入mac地址',
            trigger: 'blur'
          }]
        },
        listQuery: {
          page: 1,
          size: 20,
          sort: ''
        },
        temp: {
          uuid: '',
          userId: '',
          mac: '',
          name: '',
          version: '',
          address: '',
          corp: '',
          admin_name: '',
          admin_contact: '',
          maintain_name: '',
          maintain_contact: '',
          description: '',
          status: null,
          updatedAt: 0,
          createdAt: 0,
          active: true
        },
        createList: {
          name: '',
          version: '',
          mac: '',
          description: ''
        },
        dialogCreateVisible: false,
        dialogEditVisible: false

      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchGatewaysList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.totalItems
          this.listLoading = false
        })
      },
      handleFilter(row) {
        console.log('过滤')
      },
      handleCreate() {
        this.dialogCreateVisible = true
      },
      handleEdit(row) {
        this.temp = Object.assign({}, row)
        this.dialogEditVisible = true
      },
      EditGateWays() {
        editGateway(this.temp).then(() => {
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogEditVisible = false
        })
      },
      createGateWays() {
        createNewGateway(this.createList).then(() => {
          this.$notify({
            title: '新建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.dialogCreateVisible = false
        })
      },
      handleActivate(row) {
        const mac = row.mac;
        activatedGateway(mac).then(() => {
          this.$notify({
            title: '设备已成功激活',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleStop(row) {
        const mac = row.mac;
        deactivatedGateway(mac).then(() => {
          this.$notify({
            title: '设备已成功停用',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleDelete(row) {
        const uuid = row.uuid
        deleteGateway(uuid).then(() => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleOperation(row) {
        console.log(row.mac)
        this.$router.push({
          name: 'mqtt_operation',
          params: {
            name: row.name,
            gateway: row.mac
          }
        })
      }

    }
  }

</script>

<style>

</style>
