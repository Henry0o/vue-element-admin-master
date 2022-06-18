<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-position="center" label-width="100px"
      style="width: 800px; margin-left:50px;">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="邮箱/账户" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="uuid">
        <el-input v-model="form.uuid" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item label="手机号码">
        <el-select v-model="form.nationcode" slot="prepend" class="filter-item" placeholder="Please select">
          <el-option v-for="nationcode in nationsOptions" :key="nationcode.key" :label="nationcode.display_name"
            :value="nationcode.key" />
        </el-select>
        <el-input v-model="form.mobile_phone"></el-input>
      </el-form-item> -->
      <el-form-item label="手机号码" prop="mobile_phone">
        <el-input placeholder="请输入手机号" v-model="form.mobile_phone" class="input-with-select">
          <el-select v-model="form.nationcode" slot="prepend" class="filter-item" placeholder="号码归属地"
            style="width:110px;text-align:center;">
            <el-option v-for="nationcode in nationsOptions" :key="nationcode.key" :label="nationcode.display_name"
              :value="nationcode.key" />
          </el-select>
        </el-input>
      </el-form-item>

      <el-dialog :title="修改密码" :visible.sync="PasswordVisible">
        <el-form :rules="rules" :model="form" label-position="left" label-width="120px"
          style="width: 72%; margin-left:10%;">
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm_password">
            <el-input placeholder="请再次输入密码" v-model="form.confirm_password" show-password></el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form>
      </el-dialog>
      <el-form-item>
        <el-button type="primary" @click="onUpdatePassword">修改密码</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
  import {
    updateArticle
  } from '@/api/article'
  import {
    getInfo
  } from '@/api/user'
  const nationsOptions = [{
      key: '86',
      display_name: '中国'
    }, {
      key: '886',
      display_name: '中国台湾'
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
  export default {
    data() {
      var RegTest = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (this.form.password !== '' && value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        PasswordVisible: false,
        form: {
          name: '',
          email: '',
          uuid: this.$store.getters.uuid,
          nationcode: '86',
          mobile_phone: '',
          password: '',
          confirm_password: '',
        },
        nationsOptions,
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            validator: RegTest,
            trigger: 'blur'
          }],
          mobile_phone: [{
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            min: 11,
            max: 12,
            message: '请输入11位手机号码',
            trigger: 'blur'
          }],
          password: [{
            min: 6,
            message: '密码至少6位',
            trigger: 'blur'
          }],
          confirm_password: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      }
    },

    created() {
      this.getList()
    },
    methods: {
      onUpdatePassword() {
        this.PasswordVisible = true;
      },
      onSubmit() {
        // this.$refs['dataForm'].validate((valid) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.form)
            // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {

              this.$notify({
                title: '用户信息修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          } else {
            this.$notify({
              title: '表单验证未通过',
              type: 'error',
              duration: 2000
            })
            this.getList()
          }
          this.PasswordVisible = false;
        })
      },
      // })

      onCancel() {
        this.getList()
        this.form.password = ''
        this.form.confirm_password = ''
        this.$message({
          message: '重置表单',
          type: 'success'
        })

      },
      getList() {
        this.listLoading = true

        getInfo(this.form.uuid).then(response => {
          console.log(response)
          this.form.name = response.data.name;
          this.form.email = response.data.email;
          this.form.nationcode = response.data.nationcode;
          // this.form.mobile_phone = this.$store.getters.mobile_phone;
          this.form.mobile_phone = response.data.mobile_phone;
        })

        this.listLoading = false
      },
    }
  }

</script>

<style scoped>
  .line {
    text-align: center;
  }

</style>
