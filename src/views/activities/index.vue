<template>
  <div id="activities">
    <div class="filter-container">
      <el-input
        v-model="inf.areaCodeEq"
        placeholder="活动名称"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="Click(1)"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="Click(1)"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="Click(2)"
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
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="Click(0,scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top:10px">
      <transition name="el-zoom-in-top">
        <template v-if="editVisible">
          <el-col :span="12">
            <el-button type="danger" size="mini" @click="Click(0,scope)">删除</el-button>
            <el-button type="warning" size="mini" @click="Click(3,0)">未发布</el-button>
            <el-button type="success" size="mini" @click="Click(3,1)">已发布</el-button>
            <el-button type="danger" size="mini" @click="Click(3,2)">进行中</el-button>
            <el-button type="info" size="mini" @click="Click(3,3)">已结束</el-button>
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
    <el-dialog title="编辑活动" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称" label-width="100px">
              <el-input v-model="form.name" autocomplete="off" width="200px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动路书" label-width="100px">
              <!-- <el-select v-model="form.region" placeholder="请选择活动路书">
                <el-option label="路书一" value="shanghai" />
                <el-option label="路书二" value="beijing" />
              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ActivtiesGet, ActiveDel, ActivePublish } from '@/api/activities'
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
      dialogFormVisible: false,
      editVisible: false,
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
    Init() {
      ActivtiesGet(this.inf).then(res => {
        this.list = res.content
        console.log(res)
      })
    },
    handleSizeChange(val) {
      this.inf.current = 1
      this.inf.size = val
      // console.log(`每页 ${val} 条`)
      this.Init()
    },
    handleCurrentChange(val) {
      this.inf.current = val
      // console.log(`当前页: ${val}`)
      this.Init()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    SelectionChange(val) {
      if (val.length === 0) {
        this.editVisible = false
      } else {
        this.editVisible = true
      }
      this.selectionChange = val
    },
    Click(model, val) {
      switch (model) {
        case 0: // 删除按钮
          this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ActiveDel([val.row.id]).then(res => {
              this.list.records.splice(val.$index, 1)
              this.$message({
                message: '删除成功!',
                type: 'success'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        case 1: // 搜索按钮
          return this.Init()
        case 2: // 添加活动
          this.dialogFormVisible = true
          break
        case 3: // 批量修改状态
          this.$confirm('确定批量修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.inf2.activityIds = []
            this.selectionChange.forEach(element => {
              this.inf2.activityIds.push(element.id)
            })
            this.inf2.status = val
            console.log(this.inf2)
            ActivePublish(this.inf2).then(res => {
              this.Init()
              this.$message({
                message: '修改成功!',
                type: 'success'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })

          break
        default:
          console.log('错误点击事件model:' + model)
      }
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
