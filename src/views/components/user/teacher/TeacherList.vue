<template>
  <div>
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="搜索教师">
          <el-input v-model="page.params.teacherName" placeholder="教师名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <el-table
      :data="page.list"
      border
      stripe
      style="width: 100%"
      @sort-change="sortHandler"
      size="mini"
      v-loading="loading"
    >
      <el-table-column prop="teacherNumber" sortable="custom" label="工号"></el-table-column>
      <el-table-column prop="teacherName" sortable="custom" label="姓名"></el-table-column>
      <el-table-column sortable="custom" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.teacherSex==1?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teacherAge" sortable="custom" label="年龄"></el-table-column>
      <el-table-column prop="job.dictName" sortable="custom" label="职务"></el-table-column>
      <el-table-column prop="title.dictName" sortable="custom" label="职称"></el-table-column>
      <el-table-column prop="teacherEntryTime" sortable="custom" label="入职时间"></el-table-column>
      <el-table-column prop="college.dictName" sortable="custom" label="学院"></el-table-column>

      <el-table-column fixed="right" label="操作" width="248">
        <template class="teacher-do" slot-scope="scope">
          <el-button size="mini" type="success" @click="toUpdate(scope.row.teacherId)">编辑</el-button>
          <el-button size="mini" type="primary" @click="resumeVisible='true'">查看详情</el-button>
          <!-- toResume(scope.row.teacherId) -->
          <el-button size="mini" type="danger" @click="toDelete(scope.row.teacherId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-div">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10,15,20,30]"
        :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
      ></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading="loading">
      <el-form
        :rules="rules"
        ref="teacher"
        :inline="true"
        :model="teacher"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="工号" prop="teacherNumber">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="teacherPassword">
          <el-input v-model="teacher.teacherPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherName" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="teacherCard">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherCard" clearable></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="teacherAge">
          <el-input v-model="teacher.teacherAge" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="teacherMobile">
          <el-input v-model="teacher.teacherMobile" clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="teacherEmail">
          <el-input v-model="teacher.teacherEmail" clearable></el-input>
        </el-form-item>

        <el-form-item label="学院" prop="teacherCollege">
          <el-select v-model="teacher.teacherCollege" filterable placeholder="请选择" clearable>
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称" prop="teacherCollege">
          <el-select v-model="teacher.teacherTitle" filterable placeholder="请选择" clearable>
            <el-option
              v-for="title in titleList"
              :key="title.dictId"
              :label="title.dictName"
              :value="title.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职务">
          <el-select v-model="teacher.teacherJob" filterable placeholder="请选择" clearable>
            <el-option
              v-for="job in jobList"
              :key="job.dictId"
              :label="job.dictName"
              :value="job.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="teacherName">
          <el-date-picker
            placeholder="选择时间"
            v-model="teacher.teacherEntryTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="teacherSex">
          <el-radio-group v-model="teacher.teacherSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="照片:">
          <el-upload
            class="avatar-uploader"
            action="http://192.168.0.120:8080/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="file"
            v-loading="imgLoading"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item class="teacherlist-btn">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="详细信息" :visible.sync="resumeVisible" v-loading="loading">
      <el-form
        :rules="rules"
        ref="teacher"
        :inline="true"
        :model="teacher"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="照片:" class="img" v-loading="imgLoading">
          <el-card :body-style="{ padding: '1px' }">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
            
          </el-card>
        </el-form-item>
        <el-form-item label="工号" prop="teacherNumber">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="teacherPassword">
          <el-input v-model="teacher.teacherPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherName" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="teacherCard">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherCard" clearable></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="teacherAge">
          <el-input v-model="teacher.teacherAge" clearable></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="teacherMobile">
          <el-input v-model="teacher.teacherMobile" clearable></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="teacherEmail">
          <el-input v-model="teacher.teacherEmail" clearable></el-input>
        </el-form-item>

        <el-form-item label="学院" prop="teacherCollege">
          <el-select v-model="teacher.teacherCollege" filterable placeholder="请选择" clearable>
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称" prop="teacherCollege">
          <el-select v-model="teacher.teacherTitle" filterable placeholder="请选择" clearable>
            <el-option
              v-for="title in titleList"
              :key="title.dictId"
              :label="title.dictName"
              :value="title.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职务">
          <el-select v-model="teacher.teacherJob" filterable placeholder="请选择" clearable>
            <el-option
              v-for="job in jobList"
              :key="job.dictId"
              :label="job.dictName"
              :value="job.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间" prop="teacherName">
          <el-date-picker
            placeholder="选择时间"
            v-model="teacher.teacherEntryTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="teacherSex">
          <el-radio-group v-model="teacher.teacherSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
resume
<script>
import teacherApi from "@/api/teacher";
import dictApi from "@/api/dict";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      dialogFormVisible: false, // 弹出层表单隐藏
      resumeVisible: false, // 弹出简历页隐藏
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          teacherNumber: "",
          teacherCard: "",
          teacherName: "",
          teacherMobile: "",
          teacherEmail: "",
          teacherSex: "",
          jobId: "",
          titleId: "",
          collegeId: "",
          startTime: "",
          endTime: ""
        },
        list: []
      },
      teacher: {
        teacherId: "",
        teacherNumber: "",
        teacherPassword: "",
        teacherCard: "",
        teacherName: "",
        teacherSex: "",
        teacherAge: "",
        teacherJob: "",
        teacherTitle: "",
        teacherMobile: "",
        teacherEmail: "",
        teacherImg: "",
        teacherEntryTime: "",
        teacherCollege: ""
      },
      // rules: {
      //   teacherNumber: [
      //     { required: true, message: "请输入工号", trigger: "blur" },
      //     { type: number, message: "工号必须为数字" }
      //   ],
      //   teacherPassword: [
      //     { required: true, message: "请输入密码", trigger: "blur" }
      //   ],
      //   teacherName: [
      //     { required: true, message: "请输入姓名", trigger: "blur" }
      //   ],
      //   teacherSex: [
      //     { required: true, message: "请选择性别", trigger: "blur" }
      //   ],
      //   teacherAge: [
      //     { required: true, message: "", trigger: "blur" },
      //     { type: number, message: "年龄必须为数字值" }
      //   ],
      //   teacherMobile: [
      //     { required: true, message: "请输入手机号码", trigger: "blur" },
      //     { type: number, message: "手机号必须为数字" }
      //   ],
      //   teacherImg: [
      //     { required: true, message: "请输入题库名", trigger: "blur" }
      //   ],
      //   teacherEmail: [
      //     { required: true, message: "请输入邮箱地址", trigger: "blur" }
      //   ]
      // },
      collegeList: [],
      jobList: [],
      titleList: [],
      college: "",
      title: "",
      job: "",
      imageUrl: "",
      imgLoading: false,
      isdisabledFn: false,
      dialogTitle: "新增教师",
      currentPage4: 4,
      loading: true // 是否显示加载框
    };
  },
  methods: {
    handleSizeChange(val) {
      this.page.currentCount = val;
      this.list();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.list();
    },
    sortHandler(column) {
      // 排序查询
      this.page.sortName = column.prop;
      this.page.sortOrder = column.order;
      this.list();
    },

    save() {
      // 保存或修改;
      this.$refs.teacher.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.teacher.teacherId != "") {
            teacherApi.update(this.teacher).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message.success(res.msg);
                this.loading = false;
                this.list();
              }
            });
          } else {
            teacherApi.save(this.teacher).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message.success(res.msg);
                this.loading = false;

                this.list();
              } else {
                this.dialogFormVisible = false;
                this.$message.error("保存失败!");
                this.loading = false;
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    list() {
      // 分页查询
      this.loading = true;
      teacherApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data;
          this.loading = false;
        }
      });
    },
    toUpdate(id) {
      // 打开弹窗，进行修改
      // 根据id查询
      teacherApi.get(id).then(res => {
        if (res.code == 200) {
          this.teacher = res.data;
          this.dialogTitle = "修改教师";
          this.dialogFormVisible = true;
          this.isdisabledFn = true;
        }
      });
    },
    toAdd() {
      this.college = {
        collegeId: "",
        collegeName: ""
      };
      this.title = {
        titleId: "",
        titleName: ""
      };
      this.job = {
        jobId: "",
        jobName: ""
      };
      this.teacher = {
        teacherId: "",
        teacherName: ""
      };
      this.dialogTitle = "新增教师";
      this.dialogFormVisible = true;
      this.isdisabledFn = false;
    },
    toDelete(id) {
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        teacher: "error"
      }).then(() => {
        teacherApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              teacher: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              teacher: "error"
            });
          }
          this.list();
        });
      });
    },
    getCollege() {
      // 查询学院
      dictApi.all({ dictType: "college" }).then(res => {
        this.collegeList = res.data;
      });
    },
    getJob() {
      // 查询职务
      dictApi.all({ dictType: "job" }).then(res => {
        this.jobList = res.data;
      });
    },
    getTitle() {
      // 查询职称
      dictApi.all({ dictType: "title" }).then(res => {
        this.titleList = res.data;
      });
    },
    handleAvatarSuccess(res, file) {
      // this.teacher.teacherImg = URL.createObjectURL(file.raw);
      this.imageUrl = res.data.fileUrl;
      this.teacher.teacherImg = this.imageUrl;
      this.$message.success(res.msg);
      this.imgLoading = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传图片只支持 JPG、JPEG、PNG 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return;
      }
      this.imgLoading = true;
      return isJPG && isLt2M;
    },
    search() {
      this.list();
    }
  },
  created() {
    this.list();
    this.getCollege();
    this.getTitle();
    this.getJob();
  }
};
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
  border-color: #409eff;
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
.teacherlist-btn {
  padding: 13% 0 0 10%;
}
.img{
  width: 100px;
  height: 100px;
  background-color: aquamarine;
}
</style>