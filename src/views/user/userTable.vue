<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.email" placeholder="电子邮箱" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="sort_type" placeholder="排序类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in sort_Types" :key="item.key" :label="item.display_name+'('+item.key+')'"
          :value="item.key" />
      </el-select>
      <el-select v-model="sort_order" placeholder="排序顺序" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in sort_Orders" :key="item.key" :label="item.display_name+'('+item.key+')'"
          :value="item.key" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <div>
      <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
        @sort-change="sortChange"> -->
      <el-table v-loading="listLoading" :data="list" :default-sort="{}" border fit highlight-current-row
        style="width: 100%;">
        <el-table-column label="名字" sortable prop="name" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱/账号" sortable prop="email" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" prop="role" sortable width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" sortable prop="mobile_phone" width align="center">
          <template slot-scope="{row}">
            <span>{{ row.mobile_phone }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="uuid" prop="uuid" width="350px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.uuid }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" sortable prop="active" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.active? "激活":"停用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330px" class-name="small-padding fixed-width">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
        style="width: 400px; margin-left:50px;">

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
        <!-- <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="temp.confirm_password" />
        </el-form-item> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <!-- <el-button type="primary" @click="outputTemp">
          输出temp控制台
        </el-button> -->
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
      @pagination="getList" />

  </div>
</template>

<script>
  import {
    fetchList,
    activateUser,
    deactivateUser,
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
    },


  ]
  const sort_Types = [{
      key: 'name',
      display_name: '名字'
    }, {
      key: 'email',
      display_name: '邮箱'
    },
    {
      key: 'role',
      display_name: '权限'
    },
    // {
    //   key: 'mobile_phone',
    //   display_name: '手机号码'
    // }, 
    {
      key: 'uuid',
      display_name: '用户ID'
    },
    // {
    //   key: 'active',
    //   display_name: '激活与否'
    // }


  ]
  const sort_Orders = [{
      key: 'asc',
      display_name: '升序'
    }, {
      key: 'desc',
      display_name: '降序'
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
        // tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        sort_type: '',
        sort_order: '',
        listQuery: {
          page: 1,
          size: 20,
          // title: undefined,
          // type: undefined,
          sort: ''
          // sort: ''
        },
        userOptions,
        // calendarTypeOptions,
        nationsOptions,
        sort_Types,
        sort_Orders,
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
        rules: {
          type: [{
            required: true,
            message: 'type is required',
            trigger: 'change'
          }],
          // timestamp: [{
          //   type: 'date',
          //   required: true,
          //   message: 'timestamp is required',
          //   trigger: 'change'
          // }],
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
      // this.listQuery.page = 0;
      // console.log(this.listQuery.page)
      this.getList()
    },
    methods: {
      outputTemp() {
        console.log(this.temp)
      },
      getList() {
        this.listLoading = true

        fetchList(this.listQuery).then(response => {
          // console.log("输出listquery")

          console.log(response)
          this.list = response.data
          this.total = response.totalItems

          this.listLoading = false
          // Just to simulate the time of the request
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 0
        this.listQuery.sort = this.sort_type + ',' + this.sort_order
        this.getList()
      },
      handleUpdate(row) {
        // console.log(row)
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
                title: '编辑成功',
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
            title: '激活成功',
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
            title: '成功停用',
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
            title: '成功删除用户',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })

      }
    }
  }

</script>
