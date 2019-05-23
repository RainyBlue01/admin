<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="inf.condition.headline" placeholder="标题搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="inf.condition.daysTrip" placeholder="时长搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-cascader style="top: -4px;"
                   @change="handleChange"
                   placeholder="请选择城市"
                   :show-all-levels="false"
                   filterable
                   :options="importanceOptions" v-model="allId"></el-cascader>
      <el-button v-waves class="filter-item ml" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加路书
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
      <el-table-column label="路书id" prop="id" sortable="custom" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路书名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.headline  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路书描述" align="center" width="200">
        <template slot-scope="scope">
          <span
            style="overflow : hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical">{{ scope.row.description  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行程天数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.daysTrip }}天</span>
        </template>
      </el-table-column>
      <el-table-column label="行程历程" width="110" align="center">
        <template slot-scope="scope">
          <span>
            {{scope.row.travelMileage}}km
          </span>
        </template>
      </el-table-column>
      <!--<el-table-column label="推荐指数" width="280px">
        <template slot-scope="scope">
          <el-rate
            style="display: inline-block"
            :max="10"
            disabled
            show-score
            v-model="scope.row.recommendIndex"
          ></el-rate>
        </template>
      </el-table-column>-->
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status == 0" type="success" size="mini" @click="handStatus(row)">上架</el-button>
          <el-button v-else type="primary" size="mini" @click="handStatus(row)">下架</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="next-footer">
      <el-button class="foot-upload" size="medium" type="primary" @click="delAll">批量删除</el-button>
      <el-button class="foot-upload" size="medium" type="primary" @click="upLoadAll">批量改变状态</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="inf.current" :limit.sync="inf.size"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetTemp()">
      <div style="height: 400px;overflow-y: scroll;">
        <el-form :model="scdes" style="padding:0 20px;" ref="dataForm" :rules="rules" label-position="left"
                 label-width="90px">
          <el-form-item label="路书标题" prop="name">
            <el-input v-model="scdes.name"/>
          </el-form-item>
          <el-form-item label="目的地位置" prop="areaId">
            <el-cascader ref="cascaderAddr"
                         @change="handleDialogChange"
                         placeholder="请选择省市"
                         filterable
                         :options="importanceOptions" v-model="areaId"
            ></el-cascader>
            <el-input v-on:input="inputForMap" v-model="keyword" placeholder="请填写目的地址或名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="推荐指数" prop="recommendIndex">
            <el-rate style="margin-top: 10px" v-model="scdes.recommendIndex" allow-half show-score :max="10"/>
          </el-form-item>
          <el-form-item label="行程天数" prop="tourDuration">
            <el-input v-model="scdes.tourDuration"/>
          </el-form-item>
          <el-form-item label="路书描述" prop="introduction">
            <el-input type="textarea" v-model="scdes.introduction"/>
          </el-form-item>
          <el-form-item label="其他描述" prop="fee">
            <el-input type="textarea" v-model="scdes.otherDescription"/>
          </el-form-item>
          <el-form-item label="封面图片" prop="mainUrl">
            <el-upload
              ref="bgImgupload"
              :data="ossinf ? ossinf : {}"
              list-type="picture-card"
              :action="serverUrl"
              :multiple="false"
              :auto-upload="false"
              :on-success="bgImguploadSuccess"
              :on-error="uploadError"
              :on-change="OnChange"
              :file-list="scdes.mainUrl"
              style="width: 200px;height: 100px"
            ><i class="el-icon-plus icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="轮播图" prop="spotDetaillImgAddVOS">
            <el-upload
              ref="bgImguploadCan"
              :data="ossCaninf ? ossCaninf : {}"
              list-type="picture-card"
              :action="serverUrl"
              :file-list="scdes.spotDetaillImgAddVOS"
              :auto-upload="false"
              :on-success="uploadCanSuccess"
              :on-error="uploadCanError"
              :on-change="OnCanChange"
              :limit='6'
            ><i class="el-icon-plus icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetTemp()">
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
  import { getRoadbookList, saveRoadbook, updateRoadbook, updateStatusRoadbook, delRoadBook } from '@/api/roadbook'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import { SignatureGET, getAllArea } from '@/api/common.js'
  import { LoginCheck } from '@/utils/loginCheck.js'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
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
        allId: null,
        area: '',
        tableKey: 0,
        areaId: [],
        list: false,
        total: 0,
        keyword: '',
        listLoading: true,
        importanceOptions: [],
        scdes: {
          "areaCode": "",
          "daysTrip": 0,
          "description": "",
          "destination": "",
          "headline": "",
          "id": 0,
          "otherDescription": "",
          "publishStatus": 0,
          "recommendationRate": 0,
          "mainUrl":[],
          "spotDetaillImgAddVOS":[],
          "saveVos": [
            {
              "areaCode": "",
              "daysNumber": 0,
              "description": "",
              "id": 0,
              "latitude": 0,
              "longitude": 0,
              "roadBookId": 0,
              "travelEnd": "",
              "travelMileage": 0,
              "travelStart": ""
            }
          ],
          "travelMileage": 0
        },
        ossinf: '',
        ossCaninf: '',
        sele: '',
        // serverUrl: 'https://testihospitalapi.ebaiyihui.com/oss/api/file/store/v1/saveFile', // 这里写你要上传的图片服务器地址
        serverUrl: 'http://cd-skm.oss-cn-shenzhen.aliyuncs.com/', // 这里写你要上传的图片服务器地址
        inf: {
          "condition": {
            "daysTrip": null,
            "destination": null,
            "headline": null,
            "travelMileageType": null
          },
          'current': 1,
          'size': 10
        },
        res: {
          records: []
        },
        statusOptions: [1, 2],
        showReviewer: false,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {},
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      this.getArea()
    },
    methods: {
      upLoadAll() {
        let a = []
        if (this.sele == []) {
          this.$message({
            message: '请选择景点',
            type: 'error'
          })
        } else {
          this.sele.map(v => {
            a.push({ id: v.id, status: v.status == 1 ? 0 : 1 })
          })
          updateScenicStatus(a).then(res => {
            this.getList()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      },
      delAll() {
        let a = []
        if (this.sele == []) {
          this.$message({
            message: '请选择景点',
            type: 'error'
          })
        } else {
          this.sele.map(v => {
            a.push(v.id)
          })
          delScenic(a).then(res => {
            this.getList()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      },
      handStatus(row) {
        let parmas = [{
          id: row.id,
          status: row.status == 1 ? 0 : 1
        }]
        console.log(parmas)
        updateScenicStatus(parmas).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        })
      },
      inputForMap() {
        this.scdes.destination = this.keyword
      },
      handleDialogChange(value) {
        let ar = this.$refs['cascaderAddr'].currentLabels
        this.scdes.areaCode = value[1]
      },
      handleChange() {
        this.inf.condition.destination = this.allId[1]
      },
      sendRes(poi) {
        console.log(poi)
        this.scdes.coordinate = JSON.stringify(poi.point)
        this.keyword = poi.address
        this.scdes.address = poi.address
      },
      checkMa(pois) {
      },
      select(selection) {
        this.sele = selection
      },
      getArea() {
        getAllArea().then(res => {
          this.importanceOptions = res.content
          let a = {
            'label': '全部',
            'value': null
          }
          this.importanceOptions.push(a)
        })
      },
      getList() {
        this.listLoading = true
        getRoadbookList(this.inf).then(res => {
          this.listLoading = false
          this.list = res.content.records
          this.total = res.content.total
        }).catch(err => {
          this.listLoading = false
        })
      },
      handleFilter() {
        this.inf.current = 1
        this.getList()
      },
      handleModifyStatus(row) {
        let parmas = []
        parmas.push(row.id)
        delScenic(parmas).then(res => {
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })

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
        this.scdes.fee = 0
        this.scdes.introduction = ''
        this.scdes.name = ''
        this.scdes.recommendIndex = 0
        this.scdes.provinceId = null
        this.scdes.address = ''
        this.scdes.cityId = null
        this.scdes.mainUrl = []
        this.scdes.coordinate = ''
        this.scdes.spotDetaillImgAddVOS = []
        this.scdes.tourDuration = ''
        this.areaId = []
        this.keyword = ''
        this.dialogFormVisible = false
        this.$refs['bgImgupload'].clearFiles()
        this.$refs['bgImguploadCan'].clearFiles()
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addScenic(this.scdes).then((res) => {
              this.getList()
              this.resetTemp()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            })
          }
        })
      },
      //点击编辑触发事件
      handleUpdate(row) {
        getScenicDes(row.id).then(res => {
          this.scdes = res.content
          this.scdes.spotDetaillImgAddVOS = res.content.spotDetailImgVOS
          delete this.scdes.spotDetailImgVOS
          this.dialogStatus = 'update'
          this.keyword = res.content.address
          let area = []
          area.push(res.content.provinceId)
          area.push(res.content.cityId)
          this.areaId = area
          this.dialogFormVisible = true
        })
        console.log(this.scdes)
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateScenic(this.scdes).then((res) => {
              this.getList()
              this.resetTemp()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            })
          }
        })
      },
      // 选择文件后请求权限并上传
      OnChange(file) {
        if (LoginCheck()) {
          if (this.ossinf == '') {
            var myDate = new Date()
            var mytime = Date.parse(myDate)     //获取当前时间
            SignatureGET(mytime).then(res => {
              this.ossinf = res.content
              console.log(res)
            }).then(() => {
              this.$refs.bgImgupload.submit()
            }).catch((err) => {
              console.log(err)
              this.scdes.mainUrl = []
            })
          } else {
            this.ossinf = ''
          }
        }
      },
      bgImguploadSuccess(res, file) {
        this.scdes.mainUrl = this.serverUrl + this.ossinf.key
      },

      uploadError() {
        this.$message.error('图片插入失败')
      },
      // 选择文件后请求权限并上传
      OnCanChange(file) {
        if (LoginCheck()) {
          var myDate = new Date()
          var mytime = Date.parse(myDate)     //获取当前时间
          SignatureGET(mytime).then(res => {
            this.ossCaninf = res.content
            console.log(res)
          }).then(() => {
            this.$refs.bgImguploadCan.submit()
          })
        }
      },
      uploadCanError() {
        this.$message.error('图片插入失败')
      },
      uploadCanSuccess(res, file) {
        this.scdes.spotDetaillImgAddVOS.push({ 'url': this.serverUrl + this.ossCaninf.key })
        this.ossCaninf = ''
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

  .el-upload--picture-card {
    width: 185px !important;
    height: 100px !important;
  }

  .icon {
    width: 185px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-upload-list__item {
    width: 185px !important;
    height: 100px !important;
  }
</style>
