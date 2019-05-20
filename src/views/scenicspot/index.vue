<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="景点名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="推荐指数" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="游玩天数" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button  v-waves class="filter-item ml" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item fr" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加景点
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
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
      <el-table-column label="景点名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="景点描述"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游玩天数"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="收费情况" width="110" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐指数" width="280px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button  size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="next-footer">
      <el-button class="foot-upload" size="medium" type="primary" >删除</el-button>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" >
        <el-form-item label="景点名称">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="地理位置">
          <el-select v-model="temp.status" style="width: 164px" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-input v-model="keyword" style="width: 162px"/>
          <baidu-map  :scroll-wheel-zoom="true"  class="map"  :zoom="15">
            <bm-local-search @infohtmlset="sendRes" @markersset="checkMa" :keyword="keyword" :auto-viewport="true" :panel="false"></bm-local-search>
            <!--<bm-marker  :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">-->
            <!--<bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>-->
            <!--</bm-marker>-->
            <!--<bm-geolocation :locationSuccess="checkMa" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>-->
          </baidu-map>
          </el-col>
        </el-form-item>
        <el-form-item label="推荐指数">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="10" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="收费情况">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="景点描述">
          <el-input type="textarea" />
        </el-form-item>
        <el-form-item label="封面图片">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>
      </el-form>
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
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getScenicList,addScenic,updateScenic,delScenic,updateScenicStatus } from '@/api/scenicspot'
  import Upload from '@/components/Upload/SingleImage'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination



  export default {
    name: 'ComplexTable',
    components: { Pagination , Upload},
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
        list: null,
        total: 0,
        keyword:'',
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        postForm:{image_uri:''},
        importanceOptions: [1, 2, 3,4,5,6,7,8,9,10],
        calendarTypeOptions:[
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
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
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
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      sendRes(poi){
        console.log(poi)
      },
      checkMa(pois){
        console.log(pois)
      },
      select(selection){
        console.log(selection)
      },
      // getList() {
      //   this.listLoading = true
      //   fetchList(this.listQuery).then(response => {
      //     this.list = response.data.items
      //     this.total = response.data.total
      //
      //     // Just to simulate the time of the request
      //
      //   })
      // },
      getList () {
        this.listLoading = true
        getScenicList(this.inf).then(res => {
          // console.log(res)
          this.list = res.items
          this.total = res.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch(err => {
          this.list = false
          console.log(err)
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
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
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
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
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
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
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
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
.ml{
  margin-left: 10px;
}
  .fr{
    float: right;
  }
  .next-footer{
    margin: 20px 20px;
  }
</style>
