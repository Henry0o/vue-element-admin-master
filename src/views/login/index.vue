<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">牛图云平台登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="请输入账户邮箱" name="username" type="text"
          tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="请输入密码" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock"
            @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">登录</el-button>
      <el-link type="success" style="width:100%;margin-bottom:30px;" @click="onRegister">如果未拥有账号，请点击注册</el-link>
      <!-- <div class="app-container"> -->
      <div>
        <el-dialog title="注册" :visible.sync="dialogFormVisible" style="width:50%;margin-left:25%;">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="name">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input ref v-model="ruleForm.name" placeholder="用户名称" type="text" class="register_input" />
            </el-form-item>
            <el-form-item prop="mobile_phone">
              <span class="svg-container">
                <i class="el-icon-phone" />
              </span>
              <el-input ref v-model="ruleForm.mobile_phone" placeholder="手机号码" type="text" class="register_input" />
            </el-form-item>

            <el-form-item prop="email">
              <span class="svg-container">
                <svg-icon icon-class="email" />
              </span>
              <el-input ref v-model="ruleForm.email" placeholder="邮箱" type="text" class="register_input" />
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input ref v-model="ruleForm.password" placeholder="密码" type="password" class="register_input" />
            </el-form-item>
            <el-form-item prop="checkpass">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input ref v-model="ruleForm.checkpass" placeholder="确认密码" type="password" class="register_input" />
            </el-form-item>
            <span style="width:50%;">
              <el-button type="success" style="margin-left:28%;margin-right:10%;" @click="handleRegister">注册</el-button>
              <el-button type="info" @click="onCancel">取消</el-button>
            </span>
          </el-form>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {
    validUsername
  } from '@/utils/validate'
  import SocialSign from './components/SocialSignin'

  export default {
    name: 'Login',
    components: {
      SocialSign
    },
    data() {

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

      ];
      var vaildatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback()
        }
      };
      var RegTest = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      };
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('请输入正确的邮箱账号'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码至少6位'))
        } else {
          callback()
        }
      }
      return {
        nationsOptions,
        loginForm: {
          username: '',
          password: ''
        },

        loginRules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {},

        rules: {
          name: [{
              required: true,
              message: '请输入用户名称',
              trigger: 'blur'
            },
            // {
            //   min: 3,
            //   max: 20,
            //   message: '长度在 3 到 20 个字符',
            //   trigger: 'blur'
            // }
          ],
          mobile_phone: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            }, {
              min: 11,
              max: 11,
              message: '请输入11位手机号',
              trigger: 'blur'
            }

          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: RegTest,
              message: '请输入正确的邮箱',
              trigger: 'blur'
            },
          ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            message: '密码至少6位',
            trigger: 'blur'
          }],
          checkpass: [{
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          }, {
            message: '两次输入密码不一致',
            validator: vaildatePassCheck,
            trigger: 'blur'
          }]

        },

        dialogFormVisible: false,
        ruleForm: {
          name: '',
          mobile_phone: '',
          email: '',
          password: '',
          nationcode: '',
          checkpass: '',
        }



      }
    },
    watch: {
      $route: {
        handler: function (route) {

          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true

      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)

    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock(e) {
        const {
          key
        } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {

                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })

                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      onRegister() {
        this.dialogFormVisible = true
      },
      onCancel() {
        this.dialogFormVisible = false
      },
      handleRegister() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/register', this.ruleForm)
              .then(() => {
                this.$message({
                  message: '注册成功，请等待管理员激活',
                  type: 'success'
                });
                this.loading = false
              })
              .catch(error => {
                console.log(error)
                this.loading = false
              })
          } else {
            this.$message({
              message: '表单验证未通过',
              type: 'error'
            }, )
          }
        })
      }
    }
  }

</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }

    ::v-deep .register_input .el-input__inner {
      width: 100%;
      background-color: #e8e8e8;
      // text-align: center;
      border-color: #c0c4cc;
      color: #000
    }
  }

</style>
