<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm"  class="form-container">
        <el-button  style="position: absolute;top:10px; right: 10px;" type="success" @click="submitForm">
          上传
        </el-button>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;border-bottom: 1px solid cornflowerblue;" prop="title">
             <p style="font-size: 20px">轮播图设置</p>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="轮播图类型:" class="postInfo-container-item">
                    <el-select v-model="res.carouselType" placeholder="轮播图类型">
                      <i slot="prefix" class="el-input__icon el-icon-rank"></i>
                      <el-option
                        v-for="item in carouselTypeList"
                        :key="item.type"
                        :label="item.label"
                        :value="item.type"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item style="padding: 0" label-width="120px" label="轮播图对应内容:" class="postInfo-container-item">
                    <el-select v-model="res.carouselType" placeholder="轮播图类型">
                      <i slot="prefix" class="el-input__icon el-icon-rank"></i>
                        <el-input></el-input>
                      <el-option
                        v-for="item in carouselTypeList"
                        :key="item.type"
                        :label="item.label"
                        :value="item.type"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="轮播图对应id:" class="postInfo-container-item">
                    <el-input :disabled="true" v-model="postForm.id"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <Upload v-model="postForm.image_uri" />
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>
<script>
  import MDinput from '@/components/MDinput'
  import Upload from '@/components/Upload/SingleImage'
  export default {
    name: 'fileUpload',
    components: { MDinput,Upload},
    data() {
      return {
        postForm:{
          image_uri:'',
          id:'',
        },
        res:{
          carouselType:''
        },
        carouselTypeList:[
          {label:'首页',type:0},
          {label:'景点',type:1},
          {label:'路书',type:2},
          {label:'活动',type:3},
          {label:'游记',type:4},
          ]
      }
    },
    methods: {
      submitForm() {

      },
      draftForm() {
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .el-select-dropdown__list{
    padding: 0 !important;
  }


  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
