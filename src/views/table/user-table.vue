<template>
  <div class="app-container">
    <div class="filter-container">

    </div>
    <div>
      <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
        @sort-change="sortChange"> -->
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="名字" prop="name" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱/账号" prop="email" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" prop="role" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="mobile_phone" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.mobile_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="激活与否" prop="active" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.active }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="!row.active" size="mini" type="success" @click="handleActivate(row)">
              激活
            </el-button>
            <el-button v-if="row.active" size="mini" @click="handleDeactivate(row)">
              停用
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name"
              :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3"
            style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"
            placeholder="Please input" />
        </el-form-item> -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="邮箱/账号" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="权限" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="Please select">
            <el-option v-for="role in userOptions" :key="role.key" :label="role.display_name" :value="role.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="nationcode">
          <el-select v-model="temp.nationcode" class="filter-item" placeholder="Please select">
            <el-option v-for="nationcode in nationsOptions" :key="nationcode.key" :label="nationcode.display_name"
              :value="nationcode.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile_phone">
          <el-input v-model="temp.mobile_phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="temp.confirm_password" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button type="primary" @click="outputTemp">
          输出temp控制台
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    fetchList,
    activateUser,
    deactivateUser,
    createArticle,
    deleteUser,
    updateArticle
  } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination




  // const calendarTypeOptions = [{
  //     key: 'CN',
  //     display_name: 'China'
  //   },
  //   {
  //     key: 'US',
  //     display_name: 'USA'
  //   },
  //   {
  //     key: 'JP',
  //     display_name: 'Japan'
  //   },
  //   {
  //     key: 'EU',
  //     display_name: 'Eurozone'
  //   }
  // ]
  const userOptions = [{
      key: 'USER',
      display_name: '普通用户'
    }, {
      key: 'ADMIN',
      display_name: '超级管理员'
    },

  ]
  const nationsOptions = [{
      key: '86',
      display_name: '中国'
    }, {
      key: '886',
      display_name: '中国台湾省'
    }, {
      key: '852',
      display_name: '中国香港'
    }, {
      key: '853',
      display_name: '中国澳门'
    }, {
      key: '81',
      display_name: '日本'
    }, {
      key: '82',
      display_name: '韩国'
    }, {
      key: '1',
      display_name: '美国'
    }, {
      key: '61',
      display_name: '澳大利亚'
    }, {
      key: '44',
      display_name: '英国'
    }

  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  // const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  //   acc[cur.key] = cur.display_name
  //   return acc
  // }, {})

  export default {
    name: 'UserTable',
    components: {
      Pagination
    },
    directives: {
      waves
    },
    // filters: {
    //   statusFilter(status) {
    //     const statusMap = {
    //       published: 'success',
    //       draft: 'info',
    //       deleted: 'danger'
    //     }
    //     return statusMap[status]
    //   },
    //   typeFilter(type) {
    //     return calendarTypeKeyValue[type]
    //   }
    // },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,

          title: undefined,
          type: undefined,
          sort: '+id'
        },

        userOptions,
        // calendarTypeOptions,
        nationsOptions,
        sortOptions: [{
          label: 'ID Ascending',
          key: '+id'
        }, {
          label: 'ID Descending',
          key: '-id'
        }],
        showReviewer: false,
        temp: {
          name: '',
          email: '',
          uuid: '',
          nationcode: '',
          mobile_phone: '',
          password: '',
          confirm_password: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{
            required: true,
            message: 'type is required',
            trigger: 'change'
          }],
          timestamp: [{
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }],
          title: [{
            required: true,
            message: 'title is required',
            trigger: 'blur'
          }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      outputTemp() {
        console.log(this.temp)
      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          console.log(response)
          this.list = response.data
          this.total = response.totalItems
          console.log(this.list)
          console.log(this.total)

          this.listLoading = false
          // Just to simulate the time of the request
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) {
        console.log(row)
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.email === this.temp.email)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleActivate(row) {
        const email = row.email;
        activateUser(email).then(() => {
          this.$notify({
            title: 'Success',
            message: '激活成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleDeactivate(row) {
        const email = row.email;
        deactivateUser(email).then(() => {
          this.$notify({
            title: 'Success',
            message: '成功停用',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      handleDelete(row) {
        const uuid = row.uuid;
        deleteUser(uuid).then(() => {
          this.$notify({
            title: 'Success',
            message: '成功删除用户',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })

      }
    }
  }

</script>
