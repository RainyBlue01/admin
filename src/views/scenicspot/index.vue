<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="inf.search" placeholder="关键字搜索" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="inf.cityId" placeholder="城市名称" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves class="filter-item ml" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加景点
      </el-button>
    </div>

    <el-table
      v-if="list"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      @sort-change="sortChange"
      @selection-change="select"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="景点id" prop="id" sortable="custom" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="景点名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="景点描述" align="center" width="200">
        <template slot-scope="scope">
          <span style="overflow : hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical">{{ scope.row.introduction  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游玩天数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tourDuration }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收费情况" width="110" align="center">
        <template slot-scope="scope">
          <span style="color:red;">
            {{scope.row.tourDuration.length > 10 ? scope.row.tourDuration.Substring(0,10):scope.row.tourDuration}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推荐指数" width="280px">
        <template slot-scope="scope">
          <el-rate
            style="display: inline-block"
            :max="10"
            disabled
            show-score
            v-model="scope.row.recommendIndex"
          ></el-rate>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="next-footer">
      <el-button class="foot-upload" size="medium" type="primary">删除</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="inf.page" :limit.sync="inf.size"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <div style="height: 400px;overflow-y: scroll;">
        <el-form ref="dataForm" :rules="rules" :model="scdes" label-position="left" label-width="70px">
          <el-form-item label="景点名称">
            <el-input v-model="scdes.name"/>
          </el-form-item>
          <el-form-item label="地理位置">
            <el-select v-model="scdes.cityId" style="width: 164px" class="filter-item" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
            </el-select>
            <el-input v-model="keyword" style="width: 162px"/>
            <baidu-map v-if="checkMap" :scroll-wheel-zoom="true" class="map" :zoom="15">
              <bm-local-search  @infohtmlset="sendRes" @markersset="checkMa" :keyword="keyword" :auto-viewport="true"
                               :panel="false"></bm-local-search>
              <!--<bm-marker  :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">-->
              <!--<bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>-->
              <!--</bm-marker>-->
              <!--<bm-geolocation :locationSuccess="checkMa" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>-->
            </baidu-map>
            </el-col>
          </el-form-item>
          <el-form-item label="推荐指数">
            <el-rate style="margin-top: 10px" v-model="scdes.recommendIndex"  :max="10" />
          </el-form-item>
          <el-form-item label="收费情况">
            <el-input v-model="scdes.fee"/>
          </el-form-item>
          <el-form-item label="景点描述">
            <el-input type="textarea" v-model="scdes.introduction"/>
          </el-form-item>
          <el-form-item label="封面图片">
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-upload
              ref="bgImgupload"
              :data="ossinf"
              list-type="picture-card"
              :action="serverUrl"
              :headers="header"
              :show-file-list="false"
              :multiple="false"
              :auto-upload="false"
              :on-success="bgImguploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload"
              :on-change="OnChange"
            ><i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="轮播图">
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-upload
              list-type="picture-card"
              action="https://httpbin.org/post"
            ><i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getScenicList, addScenic, updateScenic, delScenic, updateScenicStatus } from '@/api/scenicspot'
  import Upload from '@/components/Upload/SingleImage'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import { LoginCheck } from '@/utils/loginCheck.js'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination, Upload },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: false,
        total: 0,
        keyword: '',
        checkMap:false,
        listLoading: true,
        postForm: { image_uri: '' },
        importanceOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        dialogVisible:false,
        dialogImageUrl:[],
        scdes:{
          fee:'',
          introduction:'',
          recommendIndex : 0,
          address:null,
          cityId:"published",
          mainUrl:'',
        },
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        ossinf: {},
        // serverUrl: 'https://testihospitalapi.ebaiyihui.com/oss/api/file/store/v1/saveFile', // 这里写你要上传的图片服务器地址
        serverUrl: 'http://cd-skm.oss-cn-shenzhen.aliyuncs.com/', // 这里写你要上传的图片服务器地址
        header: {
          // 'x-oss-security-token': 'abc'
          // token: 'abs'
        }, // 有的图片服务器要求请求头需要有token
        calendarTypeOptions: [
          {
            value: null,
            label: '全部'
          },
          {
            value: 0,
            label: '1天以内'
          },
          {
            value: 1,
            label: '2~3天'
          },
          {
            value: 2,
            label: '3~5天'
          },
          {
            value: 3,
            label: '5~7天'
          },
          {
            value: 4,
            label: '7~15天'
          },
          {
            value: 5,
            label: '15天以上'
          }
        ],
        inf: {
          'condition': {
            'cityId': null,
            'search': null
          },
          'page': 1,
          'size': 10
        },
        res: {
          records: []
        },
        statusOptions: [],
        showReviewer: false,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {

        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      sendRes(poi) {
        console.log(poi)
      },
      checkMa(pois) {
        console.log(pois)
      },
      select(selection) {
        console.log(selection)
      },
      getList() {
        this.listLoading = true
        getScenicList(this.inf).then(res => {
          this.list = res.content.records
          this.total = res.content.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch(err => {
          this.listLoading = false
        })
      },
      handleFilter() {
        this.inf.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.scdes = {
          fee:'',
          introduction:'',
          recommendIndex:'',
          address:'',
          cityId:'',
          mainUrl:''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.scdes)
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      // 选择文件后请求权限并上传
      OnChange (file) {
        if (LoginCheck()) {
          SignatureGET(file.name).then(res => {
            this.ossinf = res
            console.log(res)
          }).then(() => {
            this.$refs.bgImgupload.submit()
          })
        } else {
          this.$confirm('先去登录一下吧？', '未登录', {
            distinguishCancelAndClose: true,
            confirmButtonText: '好的',
            cancelButtonText: '不了，我先看看'
          })
            .then(() => {
              this.$router.push({ name: 'Login', params: { url: this.$route.fullPath } })
            })
        }
      },
      // 图片上传前
      beforeUpload (file) {

      },
      bgImguploadSuccess (res, file) {
        console.log(file)
        this.inf.bgImage = this.serverUrl + this.ossinf.key
      },
      uploadSuccess (res, file) {
        console.log(file)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        let quill = this.$refs.myQuillEditor.quill
        // 如果上传成功
        // console.log(res)
        // 获取光标所在位置
        let length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', this.serverUrl + this.ossinf.key)
        // 调整光标到最后
        quill.setSelection(length + 1)
      },
      // 富文本图片上传失败
      uploadError () {
        this.$message.error('图片插入失败')
      }
    }
  }
</script>
<style lang="scss">
  .map {
    display: flex;
    width: 100%;
    height: 400px;
    margin-top: 10px;
  }

  .ml {
    margin-left: 10px;
  }

  .fr {
    float: right;
  }

  .next-footer {
    margin: 20px 20px;
  }
</style>
