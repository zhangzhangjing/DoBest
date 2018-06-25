<template>
  <div class="list">
    <main-header message="个人中心" returnbtn="true"></main-header>
    <div class="main-content">
      <div class="left_per">
        <div class="user_pic">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <img  v-else class="upload" src="../../images/mac/vatar.jpg" alt="用户头像">
          </el-upload>
        </div>
        <p class="title_per" @click="">修改头像</p>
      </div>
      <div class="right_per">
        <div class="name">{{name}}</div>
        <div class="right_title">
          <span>基本资料</span>
          <span class="editicon" @click=editPersonDetail>修改</span>
        </div>
        <div class="content_tab">
          <el-form ref="form" :model="personDetail1" label-width="80px">
          <table width="80%">
            <tr>
              <td width="20%">性别：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.sex}}</span>
                <input type="text" v-model="personDetail1.sex" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">年龄：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.age}}</span>
                <input type="text" v-model="personDetail1.age" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">生日：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.birthday}}</span>
                <input type="text" v-model="personDetail1.birthday" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">星座：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.starName}}</span>
                <input type="text" v-model="personDetail1.starName" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">现居地：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.address}}</span>
                <input type="text" v-model="personDetail1.address" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">婚姻状况：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.merry}}</span>
                <input type="text" v-model="personDetail1.merry" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">血型：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.blood}}</span>
                <input type="text" v-model="personDetail1.blood" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">故乡：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.homeAddress}}</span>
                <input type="text" v-model="personDetail1.homeAddress" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">职业：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.jobName}}</span>
                <input type="text" v-model="personDetail1.jobName" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">公司名称：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.companyName}}</span>
                <input type="text" v-model="personDetail1.companyName" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">公司所在地：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.companyAddress}}</span>
                <input type="text" v-model="personDetail1.companyAddress" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td width="20%">详细地址：</td>
              <td>
                <span  v-if="!editing">{{personDetail1.companyDetailAddress}}</span>
                <input type="text" v-model="personDetail1.companyDetailAddress" v-if="editing" class="input_width">
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center">
                <el-button v-if="editing" size="mini" type="warning" @click="onSubmit">保存</el-button>
                <el-button v-if="editing" size="mini" @click="editing=!editing">取消</el-button>
              </td>
            </tr>
          </table>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/header.vue'
export default {
  name: "index",
  components: {
    MainHeader,
  },
  data(){
    return{
      personDetail:{
        '姓名':'薄荷凉',
        '性别':'女',
        '年龄':'18',
        '生日':'1998-12-10',
        '星座':'双子座',
        '现居地':'中国-重庆',
        '婚姻状况':'未婚',
        '血型':'O型',
        '故乡':'陕西-安康',
        '职业':'互联网-前端工程师',
        '公司名称':'重庆艾科有限公司',
        '公司所在地':'重庆渝北区',
        '详细地址':'重庆渝北区至尚路5号星光天地大厦3-2',
      },
      personDetail1:{
        name:'薄荷凉',
        sex:'女',
        age:'18',
        birthday:'1998-12-10',
        starName:'双子座',
        address:'中国-重庆',
        merry:'未婚',
        blood:'O型',
        homeAddress:'陕西-安康',
        jobName:'互联网-前端工程师',
        companyName:'重庆艾科有限公司',
        companyAddress:'重庆渝北区',
        companyDetailAddress:'重庆渝北区至尚路5号星光天地大厦3-2',
      },
      personList:{},
      name:'',
      userPic:'',
      imageUrl:'',
      editing:false
    }
  },
  created(){
    this.name = this.personDetail.姓名
  },
  mounted(){
    this.getUserDetail()
  },
  methods:{
    getUserDetail:function () {
      var list = this.personDetail
      delete(list.姓名)
      this.personList = list
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    editPersonDetail:function () {
      this.editing = true
    },
    onSubmit:function () {
      console.log("保存成功")
      this.editing = false
    }
  }
}
</script>

<style scoped lang="stylus">
.left_per
  position relative
  display inline-block
  width 120px
  min-height 400px
  vertical-align top
.title_per
  width 100px
  font-size 12px
  color #915833
  cursor pointer
.right_per
  display inline-block
  width calc(100% - 146px)
  min-height 400px
  border-left 1px solid #F8DBA3
  padding-left 20px
.right_per .name
  text-align left
  font-size 14px
  font-weight bold
  color #444
  height 30px
  line-height 30px
  margin-bottom 10px
.user_pic
  position: relative;
  width 100px
  height 100px
  border 1px solid #F8DBA3
.user_pic img
  position absolute
  width 100px
  height 100px
  left 0
  top 0
  cursor pointer
.upload
  position absolute
  width 100px
  height 100px
  left 0
  top 0
  cursor pointer
.right_title
  width 100%
  height 40px
  line-height 40px
  text-align left
  color #444
  font-size 14px
  font-weight bold
  border-bottom 2px solid #F8DBA3
.editicon
  float right
  font-size 12px
  text-decoration none
  color #915833
  cursor pointer
.content_tab
  margin-top 20px
.content_tab td
  text-align left
  font-size 12px
  color #444
  height 30px
.input_width
  width 60%
</style>
