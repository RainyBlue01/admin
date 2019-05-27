<template>
  <div id="activities">
    <div class="filter-container">
      <el-input
        v-model="inf.areaCodeEq"
        placeholder="活动名称"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="Init"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="Init">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="ClickEdit(1)"
      >添加</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table :data="list.records" fit style="width: 100%;" @selection-change="SelectionChange">
      <el-table-column type="selection" align="center" width="50px" />
      <el-table-column label="ID" prop="id" align="center" width="100px" sortable />
      <el-table-column label="价格" prop="price" min-width="50px" align="center" sortable />
      <el-table-column label="活动名称" prop="headline" min-width="200px" align="center" />
      <el-table-column label="发布时间" width="300px" prop="entryDt" align="center" sortable>
        <template slot-scope="scope">{{ scope.row.entryDt }}</template>
      </el-table-column>
      <el-table-column label="发布人" width="150px" prop="publisherName" align="center" sortable>
        <template slot-scope="scope">{{ scope.row.publisherName }}</template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" prop="publishStatus" width="150" sortable>
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.publishStatus===0"
            type="warning"
          >{{ scope.row.publishStatus | publishStatusFormat }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===1"
            type="success"
          >{{ scope.row.publishStatus | publishStatusFormat }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===2"
            type="danger"
          >{{ scope.row.publishStatus | publishStatusFormat }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===3"
            type="info"
          >{{ scope.row.publishStatus | publishStatusFormat }}</el-tag>
          <el-tag v-else>{{ scope.row.publishStatus |publishStatusFormat }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="ClickEdit(2,scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="ClickEdit(0,scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top:10px">
      <transition name="el-zoom-in-top">
        <template v-if="editVisible">
          <el-col :span="12">
            <el-button type="danger" size="mini" @click="ClickBatch(9)">删除</el-button>
            <el-button type="warning" size="mini" @click="ClickBatch(0)">未发布</el-button>
            <el-button type="success" size="mini" @click="ClickBatch(1)">已发布</el-button>
            <el-button type="danger" size="mini" @click="ClickBatch(2)">进行中</el-button>
            <el-button type="info" size="mini" @click="ClickBatch(3)">已结束</el-button>
          </el-col>
        </template>
      </transition>
      <el-col :span="12" style="text-align: right">
        <el-pagination
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <el-dialog :title="DialogTitle===1? '添加活动':'编辑活动'" :visible.sync="dialogFormVisible">
      <el-tabs tab-position="left" style="height: 400px;">
        <el-tab-pane label="基本设置">
          <el-form :model="form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动名称" label-width="100px" prop="headline">
                  <el-input v-model="form.headline" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="活动路书" label-width="100px" prop="roadBookId">
                  <el-select v-model="form.roadBookId" placeholder="请选择活动路书" filterable>
                    <el-option label="路书一" value="1" />
                    <el-option label="路书二" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="推荐指数" label-width="100px" prop="recommendationRate">
                  <div style="padding:8px 0;">
                    <el-rate
                      v-model="form.recommendationRate"
                      show-score
                      :max="10"
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="活动天数" label-width="100px" prop="daysTrip">
                  <el-select v-model="form.daysTrip" placeholder="请选择活动天数">
                    <el-option label="1天" value="1" />
                    <el-option label="3天" value="3" />
                    <el-option label="7天" value="7" />
                    <el-option label="15天" value="15" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单人价格" label-width="100px" prop="price">
                  <el-select v-model="form.price" placeholder="请选择活动路书">
                    <el-option label="500" value="500" />
                    <el-option label="800" value="800" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="活动里程" label-width="100px" prop="travelMileage">
                  <el-select v-model="form.travelMileage" placeholder="请选择活动路书">
                    <el-option label="5" value="5" />
                    <el-option label="10" value="10" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="报名截止" label-width="100px" prop="deadlineDt">
                  <el-date-picker
                    v-model="form.deadlineDt"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width:200px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="出发时间" label-width="100px" prop="departureDt">
                  <el-date-picker
                    v-model="form.departureDt"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width:200px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动城市" label-width="100px" prop="areaCode">
                  <el-select v-model="form.areaCode" placeholder="请选择活动路书">
                    <el-option label="成都" value="2525" />
                    <el-option label="重庆" value="68682" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="发布者" label-width="100px" prop="deadlineDt">
                  <el-select v-model="form.price" placeholder="请选择活动路书">
                    <el-option label="500" value="500" />
                    <el-option label="800" value="800" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="21">
                <el-form-item label="详细地址" label-width="100px" prop="destination">
                  <el-input
                    v-model="form.destination"
                    type="textarea"
                    placeholder="请输入内容"
                    :rows="4"
                    maxlength="50"
                    show-word-limit
                    resize="none"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="行程安排">行程安排</el-tab-pane>
        <el-tab-pane label="其他设置">
          <el-form>
            <el-row>
              <el-col :span="20">
                <el-form-item label="背景图片" label-width="100px">
                  <div class="img">
                    <img :src="form.imageUrl" alt>
                    <el-upload
                      ref="imageUpload"
                      class="upload-demo"
                      drag
                      :action="ossUrl"
                      :data="ossData"
                      :on-success="OnSuccess"
                      :on-change="OnChange"
                      :auto-upload="false"
                      :limit="1"
                      :show-file-list="false"
                    >
                      <i class="el-icon-upload" />
                      <i v-if="form.imageUrl" class="el-icon-delete" @click.stop="test" />
                    </el-upload>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="活动描述" label-width="100px">
                  <el-input
                    v-model="form.description"
                    type="textarea"
                    placeholder="请输入内容"
                    :rows="4"
                    maxlength="500"
                    show-word-limit
                    resize="none"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="其他备注" label-width="100px">
                  <el-input
                    v-model="form.otherDescription"
                    type="textarea"
                    placeholder="请输入内容"
                    :rows="2"
                    maxlength="500"
                    show-word-limit
                    resize="none"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="info" @click="ClickRelease(0)">草稿箱</el-button>
        <el-button type="primary" @click="ClickRelease(1)">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ActivtiesGet, ActiveDel, ActivePublish, ActiveAdd } from '@/api/activities'
import { SignatureGET } from '@/api/common'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Activities',
  directives: { waves },
  filters: {
    publishStatusFormat(val) {
      switch (val) {
        case 0:
          return '未发布'
        case 1:
          return '已发布'
        case 2:
          return '进行中'
        case 3:
          return '已结束'
        default:
          return '未知状态'
      }
    }
  },
  data() {
    return {
      value: 10,
      value1: 10,
      ossData: null,
      ossUrl: 'http://cd-skm.oss-cn-shenzhen.aliyuncs.com/',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogFormVisible: false,
      editVisible: false,
      DialogTitle: null,
      selectionChange: {},
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 活动列表接口数据
      inf: {
        'condition': {
          'areaCodeEq': null,
          'daysTripBetweenEnd': null,
          'daysTripBetweenStart': null,
          'daysTripGe': null,
          'deadlineDtBetweenEnd': null,
          'deadlineDtBetweenStart': null,
          'destinationLike': null,
          'headlineLike': null,
          'likeOverall': null,
          'travelMileage': null
        },
        'current': 1,
        'size': 10,
        'sorts': [
        ]
      },
      // 批量修改状态操作
      inf2: {
        'activityIds': [

        ],
        'status': 0
      },
      list: {
        records: [],
        total: 0
      } // 接收列表结果
    }
  },
  created() {
    this.Init()
  },
  methods: {
    test() {
      this.form.imageUrl = null
      console.log('sss')
    },
    // 初始化页面数据
    Init() {
      ActivtiesGet(this.inf).then(res => {
        this.list = res.content
        // console.log(res)
      })
    },
    // 多少条
    handleSizeChange(val) {
      this.inf.current = 1
      this.inf.size = val
      // console.log(`每页 ${val} 条`)
      this.Init()
    },
    // 第几页
    handleCurrentChange(val) {
      this.inf.current = val
      // console.log(`当前页: ${val}`)
      this.Init()
    },
    // 多选操作
    SelectionChange(val) {
      if (val.length === 0) {
        this.editVisible = false
      } else {
        this.editVisible = true
      }
      this.selectionChange = val
    },
    // 添加/编辑/删除 按钮
    ClickEdit(model, val) {
      // console.log(model)
      if (model === 0) {
        // 删除操作
        ActiveDel([val.row.id]).then(res => {
          this.list.records.splice(val.$index, 1)
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        })
      } else {
        if (val) {
          this.form = val.row
        } else {
          this.form = null
        }
        this.DialogTitle = model
        this.dialogFormVisible = true
      }
    },
    // 批量操作
    ClickBatch(val) {
      this.inf2.activityIds = []
      this.selectionChange.forEach(element => {
        this.inf2.activityIds.push(element.id)
      })
      this.inf2.status = val
      // 删除/批量删除
      this.$confirm('确定批量操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val === 9) {
          // 删除操作
          ActiveDel(this.inf2.activityIds).then(res => {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
          })
        } else {
          // 批量修改状态
          ActivePublish(this.inf2).then(res => {
            this.Init()
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
          })
        }
        this.Init()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 选择图片
    OnChange(file) {
      console.log(file)
      if (this.ossData === null) {
        SignatureGET(file.name).then(res => {
          console.log(res)
          this.ossData = res.content // 拿到上传证书
        }).then(() => {
          this.$refs.imageUpload.submit() // 执行上传
        })
      } else {
        this.ossData = null
      }
    },
    // 图片上传成功
    OnSuccess() {
      this.form.imageUrl = this.ossUrl + this.ossData.key
    },
    ClickRelease(status) {
      this.form.publishStatus = status
      ActiveAdd(this.form).then(res => {
        console.log(res)
        this.$message({
          message: '操作成功!',
          type: 'success'
        })
        this.Init()
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/zp.scss";
d {
  text-align: right;
}
</style>
