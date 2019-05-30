<template>
  <div id="travelnotes">
    <div class="filter-container">
      <el-input
        v-model="inf.areaCodeEq"
        placeholder="游记名称"
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
    <el-tabs type="border-card">
      <el-table :data="list.records" fit style="width: 100%;" @selection-change="SelectionChange">
        <el-table-column type="selection" align="center" width="50px" />
        <el-table-column label="ID" prop="id" align="center" width="100px" sortable />
        <el-table-column label="游记名称" prop="name" min-width="200px" align="center" />
        <el-table-column label="旅游时间" width="300px" prop="tourDt" align="center" sortable>
          <template slot-scope="scope">{{ scope.row.tourDt }}</template>
        </el-table-column>
        <el-table-column label="作者" width="150px" prop="userName" align="center" sortable>
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column
          label="收藏数量"
          class-name="status-col"
          prop="collectCount"
          width="150"
          sortable
        />
        <el-table-column
          label="评论数量"
          class-name="status-col"
          prop="commentCount"
          width="150"
          sortable
        />
        <el-table-column label="状态" class-name="status-col" prop="status" width="150" sortable>
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status===0"
              type="warning"
            >{{ scope.row.status | publishStatusFormat }}</el-tag>
            <el-tag
              v-else-if="scope.row.status===1"
              type="success"
            >{{ scope.row.status | publishStatusFormat }}</el-tag>
            <el-tag
              v-else-if="scope.row.status===2"
              type="info"
            >{{ scope.row.status | publishStatusFormat }}</el-tag>
            <el-tag v-else>{{ scope.row.status |publishStatusFormat }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status!==1"
              type="success"
              size="mini"
              @click="ClickEdit(1,scope)"
            >通过</el-button>
            <el-button
              v-if="scope.row.status!==2"
              type="info"
              size="mini"
              @click="ClickEdit(2,scope)"
            >不通过</el-button>
            <el-button type="danger" size="mini" @click="ClickEdit(9,scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>

    <el-row type="flex" justify="end" style="margin-top:10px">
      <transition name="el-zoom-in-top">
        <template v-if="editVisible">
          <el-col :span="12">
            <el-button type="danger" size="mini" @click="ClickBatch(9)">删除</el-button>
            <el-button type="warning" size="mini" @click="ClickBatch(0)">审核中</el-button>
            <el-button type="success" size="mini" @click="ClickBatch(1)">已通过</el-button>
            <el-button type="info" size="mini" @click="ClickBatch(2)">未通过</el-button>
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
    <el-dialog title="添加游记" :visible.sync="dialogFormVisible">
      <el-form
        ref="travelnotesForm"
        :rules="rules"
        :model="form"
        style="height:400px; overflow-y:scroll"
      >
        <el-col :span="20">
          <el-row>
            <el-form-item label="游记名称" label-width="100px" prop="name">
              <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="旅游地点" label-width="100px" prop="destination">
                <el-select v-model="form.destination" placeholder="请选择活动城市" filterable>
                  <el-option
                    v-for="(item,index) in allCityList "
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="旅游时间" label-width="100px" prop="tourDt">
                <el-date-picker v-model="form.tourDt" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row v-if="DialogTitle!==1">
            <el-col :span="12">
              <el-form-item label="收藏数量" label-width="100px">
                <el-input v-model="form.collectCount" autocomplete="off" style="width:220px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="评论数量" label-width="100px">
                <el-input v-model="form.commentCount" autocomplete="off" style="width:220px" />
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-form-item label="背景图片" label-width="100px">
              <div class="img">
                <img :src="form.bgImage" alt>
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
          </el-row>
          <el-row>
            <el-form-item label="简要描述" label-width="100px" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请输入内容"
                :rows="4"
                maxlength="50"
                show-word-limit
                resize="none"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主体内容" label-width="100px" prop="content">
              <div class="tinymce">
                <!-- 图片上传组件辅助-->
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :action="ossUrl"
                  :data="ossData"
                  :show-file-list="false"
                  list-type="picture"
                  :multiple="false"
                  :on-success="OnSuccess2"
                  :on-change="OnChange2"
                  :auto-upload="false"
                />
                <quill-editor
                  ref="myQuillEditor"
                  v-model="form.content"
                  class="editor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @change="onEditorChange($event)"
                />
              </div>
            </el-form-item>
          </el-row>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="ClickRelease('travelnotesForm')">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AllCityGet } from '@/api/activities'
import { TravelPage, TravelBatchDelete, TravelSave, TravelStatus } from '@/api/travelnotes'
import { SignatureGET } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { list: 'ordered' }, { list: 'bullet' }, { script: 'sub' }, { script: 'super' }, { indent: '-1' }, { indent: '+1' }, { color: [] }, { background: [] }, 'link', 'image', { size: ['small', false, 'large', 'huge'] }, { header: [1, 2, 3, 4, 5, 6, false] }, 'clean'] // 加粗 斜体 下划线 删除线
]
export default {
  name: 'Travelnotes',
  components: {
    quillEditor
  },
  directives: { waves },
  filters: {
    publishStatusFormat(val) {
      switch (val) {
        case 0:
          return '审核中'
        case 1:
          return '已通过'
        case 2:
          return '未通过'
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
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入游记名称', trigger: 'blur' }
        ],
        destination: [
          { required: true, message: '请输入旅游地点', trigger: 'blur' }
        ],
        tourDt: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入游记描述', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入主体内容', trigger: 'blur' }
        ]
      },
      // 富文本设置
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '内容',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
              // link: function (value) {
              //   console.log(value)
              //   if (value) {
              //     var href = prompt('请输入url')
              //     this.quill.format('link', href)
              //   } else {
              //     this.quill.format('link', false)
              //   }
              // },
              // video: function (value) {
              //   console.log(value)
              //   if (value) {
              //     var href = prompt('请输入url')
              //     this.quill.format('video', href)
              //   } else {
              //     this.quill.format('video', false)
              //   }
              // }
            }
          }
        }
      },
      form: {
        'bgImage': null,
        'content': null,
        'description': null,
        'destination': null,
        'label': 0,
        'name': null,
        'status': 1,
        'tourDt': null
      },
      // 活动列表接口数据
      inf: {
        'condition': {
          'descriptionLike': null,
          'destination': null,
          'nameLike': null,
          'userNameLike': null
        },
        'current': 1,
        'size': 10,
        'sorts': []
      },
      // 批量修改状态操作
      inf2: [

      ],
      allCityList: [],
      list: {
        records: [],
        total: 0
      } // 接收列表结果
    }
  },
  created() {
    this.Init()
    // 获取全部城市
    AllCityGet().then(res => {
      // 处理全部城市数据
      res.content.forEach(element => {
        // console.log(element.children)
        element.children.forEach(element => {
          // console.log(element)
          this.allCityList.push(element)
        })
      })
      // console.log(this.allCityList)
    })
  },
  methods: {
    // 初始化页面数据
    Init() {
      TravelPage(this.inf).then(res => {
        this.list = res.content
        console.log(res)
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
      if (model === 9) {
        // 删除操作
        TravelBatchDelete([val.row.id]).then(res => {
          this.list.records.splice(val.$index, 1)
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        })
      } else {
        console.log(val)
        // 修改状态
        TravelStatus(
          [{ id: val.id,
            state: model }]
        ).then(res => {
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.Init()
        })
      }
    },
    // 批量操作
    ClickBatch(val) {
      this.$confirm('确定批量操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (val === 9) {
          // 删除操作
          const id = []
          this.selectionChange.forEach(element => {
            id.push(element.id)
          })
          TravelBatchDelete(id).then(res => {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.Init()
          })
        } else {
          // 批量修改状态
          this.selectionChange.forEach(element => {
            this.inf2.push({
              'id': element.id,
              'status': val
            })
          })
          TravelStatus(this.inf2).then(res => {
            this.Init()
            this.$message({
              message: '修改成功!',
              type: 'success'
            })
          })
        }
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
      this.form.bgImage = this.ossUrl + this.ossData.key
    },
    // 确定发布
    ClickRelease(formName) {
      // 表单验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          TravelSave(this.form).then(res => {
            console.log(res)
            this.$message({
              message: '发布成功!',
              type: 'success'
            })
            this.Init()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 富文本上传图片
    OnChange2(file) {
      // console.log(file)
      if (this.ossData === null) {
        SignatureGET(file.name).then(res => {
          console.log(res)
          this.ossData = res.content // 拿到上传证书
        }).then(() => {
          this.$refs.upload.submit() // 执行上传
        })
      } else {
        this.ossData = null
      }
    },
    onEditorBlur() {
      // 失去焦点事件
    },
    onEditorFocus(res) {
      // 获得焦点事件
      // console.log(res)
    },
    onEditorChange() {
      // 内容改变事件
      this.$emit('input', this.content)
    },
    // 富文本图片上传成功
    OnSuccess2() {
      // this.form.imageUrl = this.ossUrl + this.ossData.key
      this.$message({
        message: '插入成功',
        type: 'success'
      })
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      // console.log(res)
      // 获取光标所在位置
      const length = quill.getSelection().index
      // 插入图片  res.url为服务器返回的图片地址
      quill.insertEmbed(length, 'image', this.ossUrl + this.ossData.key)
      // 调整光标到最后
      quill.setSelection(length + 1)
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/zp.scss";
</style>
<style scope>
.editor {
  line-height: normal !important;
  height: 300px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
