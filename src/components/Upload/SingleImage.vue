<template>
  <div class="upload-container">
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-upload
      :data="dataObj"
      :on-success="handleImageSuccess"
      list-type="picture-card"
      action="https://httpbin.org/post"
    ><i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
// 预览效果见付费文章
import { getToken } from '@/api/qiniu'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess() {
      this.emitInput(this.tempUrl)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .upload-container {
        width: 100%;
        position: relative;
        }


</style>
