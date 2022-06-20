<template>
  <div class="app-container">
    <!-- 查询模块 -->
    <div class="filter-container" style="width:100%;display: inline-block">
      <el-input v-model="listQuery.owner" clearable placeholder="账户邮箱" style="width:11%;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sn" clearable placeholder="设备序列号" style="width:11%;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.code_color" clearable placeholder="健康码状态" style="width:11%;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.type" clearable placeholder="二维码类型" style="width:11%;" class="filter-item"
        @keyup.enter.native="handleFilter" />

      <el-button class="filter-item" style="margin-left: 10px;width:;" type="primary" icon="el-icon-search"
        @click="handleFilter">
        查询
      </el-button>
      <el-select v-model="listQuery.sortFields" placeholder="请选择排序关键字" class="filter-item"
        style="margin-left: 10px;width:11%;">
        <el-option v-for="item in options_sortFields" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.sortType" placeholder="请选择排序方式" class="filter-item" style="width:11%;">
        <el-option v-for="item in options_sortType" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;width:;" type="primary" icon="el-icon-search"
        @click="handleFilter">
        排序
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;width:;" type="primary" icon="el-icon-refresh"
        @click="refreshList">
        刷新</el-button>

    </div>

    <!-- 列表模块 -->
    <div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width:100%;">
        <el-table-column label="设备注册地址" prop="address" align="center">
          <template slot-scope="{row}">
            <span>{{ row.address }}</span>
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

            <el-popconfirm icon="el-icon-info" iconColor="red" v-model="popconfirm_visible" title="删除后不可恢复,确定删除吗？"
              @onConfirm="handleDelete(row)" style="margin-left: 10px;">
              <el-button type="danger" size slot="reference">
                删除
              </el-button>
            </el-popconfirm>
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
          <el-button v-show="showimg_button_visible" type="primary" @click="showPhoto(temp.photo)">显示
          </el-button>
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
          <!-- <el-input v-model="temp.trip" type="textarea" :rows="2" /> -->
          <div>{{temp.trip}}</div>
        </el-form-item>
        <el-form-item label="二维码内容" prop="qr_content">
          <!-- <el-input v-model="temp.qr_content" type="textarea" :rows="2" /> -->
          <div>{{temp.qr_content}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailsVisible = false">
          关闭
        </el-button>
        <!-- <el-button type="success" @click="HandleEditHealthInfo">修改</el-button> -->
      </div>
    </el-dialog>
    <el-dialog id="photo-dialog" :visible.sync="showImage">
      <!-- <tr>
        <el-button @click="rotate('left')" style="position: relative">左旋</el-button>
        <el-button @click="rotate('right')">右旋</el-button>
      </tr> -->
      <el-image style="width: 100%; height: auto" :src="photoBase64" :preview-src-list="photoBase64List">
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination'

  import {
    fetchHealthInfoList,
    fetchHealthInfobyUuid,
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
        popconfirm_visible: false,
        showimg_button_visible: false,
        showImage: false,
        photoBase64: '',
        photoBase64List: [],
        list: null,
        total: 0,
        listLoading: true,
        options_sortFields: [{
          value: 'sn',
          label: '设备序列号'
        }, {
          value: 'code_color',
          label: '健康码状态'
        }, {
          value: 'type',
          label: '二维码类型'
        }],
        options_sortType: [{
            value: 'DESC',
            label: '降序'
          },
          {
            value: 'ASC',
            label: '升序'
          }
        ],
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
          sn: '',
          code_color: '',
          type: '',
          page: 1,
          size: 20,
          sortType: '',
          sortFields: ''
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
          qr_content: '',
          address: ''
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
        console.log(row)
        fetchHealthInfobyUuid(row.uuid).then(response => {
          this.temp = Object.assign({}, response.data)
          console.log(this.temp)
          if (this.temp.qr_show.length === 6) {
            let qrShowTimeRotate = this.temp.qr_show;
            let hour = qrShowTimeRotate.substring(0, 2);
            let min = qrShowTimeRotate.substring(2, 4);
            let sec = qrShowTimeRotate.substring(4, 6);
            qrShowTimeRotate = hour + ':' + min + ':' + sec;
            this.temp.qr_show = qrShowTimeRotate;
          }
        }).then(() => {
          if (this.temp.photo.length > 0) {
            this.showimg_button_visible = true
          } else {
            this.showimg_button_visible = false
          }
          this.dialogDetailsVisible = true
        })
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
        this.photoBase64 = 'data:image/jpg;base64,' + photo;
        // var tempList = [this.photoBase64]
        this.photoBase64List = [this.photoBase64]
        this.showImage = true;
      },
      rotate(direction) {
        const img = document.getElementById("photo-health")
        console.log(img.className)
        if (direction === 'right') {
          if (img.className === 'style1') {
            img.setAttribute("class", "style2")
          } else if (img.className === 'style2') {
            img.setAttribute("class", "style3")
          } else if (img.className === 'style3') {
            img.setAttribute("class", "style4")
          } else {
            img.setAttribute("class", "style1")
          }
        } else {
          if (img.className === 'style1') {
            img.setAttribute("class", "style4")
          } else if (img.className === 'style2') {
            img.setAttribute("class", "style1")
          } else if (img.className === 'style3') {
            img.setAttribute("class", "style2")
          } else {
            img.setAttribute("class", "style3")
          }
        }
        // 这里的思维就是，把图片映射到一个画板上，然后对图片进行重新绘制，所以这里要建一个canvas对象来充当我们的画板
        // const canvas = document.createElement('canvas')
        // // base64转换image对象
        // img.src = this.photoBase64
        // console.log(img.src)
        // // 这里记得一定要在base64转换成图片对象后再进行其它操作，笔者在这里踩了个坑，onload方法就是图片加载再进行其它操作，如果图片是文件路径方式跨域调用效果更加明显
        // img.onload = () => {
        // // img的高度和宽度不能在img元素隐藏后获取，否则会出错
        // const height = img.height
        // const width = img.width
        // console.log(height)
        // // 旋转角度以弧度值为参数
        // const ctx = canvas.getContext('2d')
        // if (direction === 'right') {
        // canvas.width = height
        // canvas.height = width
        // ctx.rotate(90 * Math.PI / 180)
        // ctx.drawImage(img, 0, 0, width, -height)
        // } else {
        // canvas.width = height
        // canvas.height = width
        // ctx.rotate(-90 * Math.PI / 180)
        // ctx.drawImage(img, 0, 0, -width, height)
        // }
        // // 旋转后的图片重新转为base64
        // }
      }

    }
  }

</script>
<style scoped>
  #photo_rotate {
    transform: rotate(270deg);
    transition: all 1ms;
  }


  #photo-dialog {
    background: rgba(185, 92, 92, 0);

    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0);

    box-shadow: 0 1px 3px rgba(0, 0, 0, 0);
  }

  .style1 {
    display: block;
    max-width: 100%;
    height: auto;
  }

  .style2 {
    display: block;
    transform: rotate(90deg);
    height: auto;
    max-width: 50%;
  }

  .style3 {
    display: block;
    transform: rotate(180deg);
    max-width: 100%;
    height: auto;
  }

  .style4 {
    display: block;
    transform: rotate(270deg);
    max-width: 50%;
    height: auto;
  }

</style>
