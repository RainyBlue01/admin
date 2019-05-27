<template>
  <div id="travelnotes">
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
      >添加</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      :data="list.records"
      fit
      style="width: 100%;"
      @selection-change="SelectionChange"
    >
      <el-table-column type="selection" align="center" width="50px" />
      <el-table-column label="ID" prop="id" sortable align="center" width="100px" />
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
          >{{ scope.row.publishStatus | publishStatus }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===1"
            type="success"
          >{{ scope.row.publishStatus | publishStatus }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===2"
            type="danger"
          >{{ scope.row.publishStatus | publishStatus }}</el-tag>
          <el-tag
            v-else-if="scope.row.publishStatus===3"
            type="info"
          >{{ scope.row.publishStatus | publishStatus }}</el-tag>
          <el-tag v-else>{{ publishStatus |publishStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="danger" size="mini" @click="Click(2,scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="1"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ActivtiesGet, ActiveDel } from '@/api/activities'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Travelnotes',
  directives: { waves },
  filters: {
    publishStatus(val) {
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
      console.log(val)
    },
    Click(model, val) {
      switch (model) {
        case 1: // 搜索按钮
          return this.Init()
        case 2: // 删除按钮
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
        case 3:
          console.log(val)
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
</style>
