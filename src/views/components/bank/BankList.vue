<template>
  <div>
    <div class="table-header">

      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="学院名">
          <el-input v-model="page.params.bankName" placeholder="学院名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>

    </div>
    <!-- <el-table :data="page.list" border stripe style="width: 100%" @sort-change="sortHandler" size="mini"
      v-loading="loading">
      <el-table-column prop="bankName" sortable="custom" label="题库名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="toUpdate(scope.row.dictId)">编辑</el-button>
          <el-button size="mini" type="primary" @click="getMajor(scope.row.dictId)">查看专业</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.dictId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <div class="page-div">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.currentPage" :page-sizes="[10,15,20,30]" :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount">
      </el-pagination>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="bank" label-width="80px" size="small">
        <el-form-item label="题库名称">
          <el-input v-model="bank.bankName" clearable></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="bank.bankCollege" filterable placeholder="请选择" clearable>
            <el-option v-for="college in collegeList" :key="college.dictId" :label="college.dictName"
              :value="college.dictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="bank.bankSubject" filterable placeholder="请选择" clearable>
            <el-option v-for="subject in subjectList" :key="subject.dictId" :label="subject.dictName"
              :value="subject.dictId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload class="avatar-uploader" action="http://192.168.0.115:8080/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file"v-loading="imgLoading">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>

  import dictApi from '@/api/dict'
  import { Loading } from 'element-ui'

  export default {
    data() {
      return {
        imageUrl: '',
        dialogFormVisible: false, // 弹出层隐藏
        page: {
          currentPage: 1,
          currentCount: 10,
          totalCount: null,
          totalPage: null,
          sortName: '',
          sortOrder: 'asc',
          params: {
            dictType: 'college'
          },
          list: []
        },
        bank: {},
        collegeList: [],
        subjectList: [],
        dialogTitle: '新增题库',
        imgLoading: false,
        loading: true // 是否显示加载框
      }
    },
    methods: {
      handleSizeChange(val) {
        this.page.currentCount = val
        this.list()
      },
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.list()
      },
      sortHandler(column) { // 排序查询
        this.page.sortName = column.prop
        this.page.sortOrder = column.order
        this.list()
      },
      save() { // 保存或修改

      },
      list() { // 分页查询

      },
      toUpdate(id) { // 打开弹窗，进行修改

      },
      toAdd() {
        // 加载学院
        dictApi.all({ dictType: 'college' }).then(res => {
          this.collegeList = res.data
        })
        // 加载科目
        dictApi.all({ dictType: 'subject' }).then(res => {
          this.subjectList = res.data
        })
        this.dialogFormVisible = true
      },
      toDelete(id) {

      },
      search() {
        this.list()
      },
      getMajor(id) {

      },
      handleAvatarSuccess(res, file) {
        // this.bank.bankImg = URL.createObjectURL(file.raw);
        this.imageUrl = res.data.fileUrl
        this.bank.bankImg = this.imageUrl
        this.$message.success(res.msg);
        this.imgLoading = false
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传图片只支持 JPG、JPEG、PNG 格式!');
          return
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          return
        }
        this.imgLoading = true
        return isJPG && isLt2M;
      }
    },
    created() {
      this.list()
    }
  }
</script>

<style scoped>
  .table-header {
    margin-bottom: 10px;
  }

  .page-div {
    margin-top: 10px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>