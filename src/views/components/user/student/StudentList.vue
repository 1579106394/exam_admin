<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="姓名">
          <el-input v-model="page.params.stuName" placeholder="学生名" clearable></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="page.params.stuNumber" placeholder="学号" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable v-model="page.params.stuSex" filterable placeholder="请选择">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="2" label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select clearable v-model="page.params.majorId" filterable placeholder="请选择">
            <el-option
              v-for="major in majorList"
              :key="major.dictId"
              :label="major.dictName"
              :value="major.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院">
          <el-select clearable v-model="page.params.collegeId" filterable placeholder="请选择">
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学时间区间">
          <div class="block">
            <el-date-picker
              v-model="admissionTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 搜索部分结束 -->

      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="page.list"
      border
      stripe
      style="width: 100%"
      @sort-change="sortHandler"
      size="mini"
      v-loading="loading"
    >
      <el-table-column prop="stuNumber" sortable="custom" label="学号"></el-table-column>
      <el-table-column prop="stuName" sortable="custom" label="姓名"></el-table-column>
      <el-table-column sortable="custom" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.stuSex==1?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stuAge" sortable="custom" label="年龄"></el-table-column>
      <el-table-column prop="major.dictName" sortable="custom" label="专业"></el-table-column>
      <el-table-column prop="stuEntranceTime" sortable="custom" label="入学时间"></el-table-column>
      <el-table-column prop="college.dictName" sortable="custom" label="学院"></el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(scope.row.stuId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="getDetails(scope.row.stuId)">查看详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="toDelete(scope.row.stuId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->

    <!-- 分页组件开始 -->
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
    <!-- 分页组件结束 -->

    <!-- 新增 编辑弹窗开始 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading="loading">
      <el-form
        :rules="rules"
        ref="student"
        :inline="true"
        :model="student"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="学号" prop="stuNumber">
          <el-input :disabled="isdisabledFn" v-model="student.stuNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-radio-group v-model="student.stuSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="stuPassword">
          <el-input v-model="student.stuPassword" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input :disabled="isdisabledFn" v-model="student.stuName" clearable></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="stuAge">
          <el-input v-model="student.stuAge" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="stuCard">
          <el-input :disabled="isdisabledFn" v-model="student.stuCard" clearable></el-input>
        </el-form-item>

        <el-form-item label="学院" prop="stuCollege">
          <el-select
            v-model="student.stuCollege"
            filterable
            placeholder="请选择"
            clearable
            @change="getSon"
          >
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学时间" prop="stuName">
          <el-date-picker
            placeholder="选择时间"
            v-model="student.stuEntranceTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="student.stuMajor" filterable placeholder="必须先选择学院" clearable>
            <el-option
              v-for="major in majorList0"
              :key="major.dictId"
              :label="major.dictName"
              :value="major.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="照片">
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

        <el-form-item class="stu-submit-part">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增 编辑弹窗结束 -->

    <!-- 详情弹窗开始 -->
    <el-dialog title="详细信息" :visible.sync="dialogResumeVisible" v-loading="loading">
      <el-form
        :rules="rules"
        ref="student"
        :inline="true"
        :model="student"
        label-width="80px"
        size="mini"
        label-position="right"
        :disabled=false
      >
        <img :src="student.stuImg" class="avatar" style="margin:-6% 39% 2%;">
        <el-form-item label="学号" prop="stuNumber">
          <el-input :disabled="isdisabledFn" v-model="student.stuNumber"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="stuName">
          <el-input :disabled="isdisabledFn" v-model="student.stuName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="stuPassword">
          <el-input v-model="student.stuPassword"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="stuSex">
          <el-radio-group v-model="student.stuSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="stuCard">
          <el-input :disabled="isdisabledFn" v-model="student.stuCard"></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="stuAge">
          <el-input v-model="student.stuAge"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="stuMobile">
          <el-input v-model="student.stuMobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="stuEmail">
          <el-input v-model="student.stuEmail"></el-input>
        </el-form-item>

        <el-form-item label="学院" prop="stuCollege">
          <el-select v-model="student.stuCollege" filterable placeholder="请选择">
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入学时间" prop="stuName">
          <el-date-picker
            placeholder="选择时间"
            v-model="student.stuEntranceTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="student.stuMajor" filterable placeholder="请选择">
            <el-option
              v-for="major in majorList"
              :key="major.dictId"
              :label="major.dictName"
              :value="major.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 详情弹窗结束 -->
  </div>
</template>
<script>
import stuApi from "@/api/student";
import dictApi from "@/api/dict";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      admissionTime: null, // 入学时间区间(数组)
      dialogFormVisible: false, // 弹出层表单隐藏
      dialogRoleTree: false, // 弹出层树形隐藏
      dialogResumeVisible: false, // 弹出简历页隐藏
      page: {
        currentPage: 1,
        currentCount: 10,
        totalCount: null,
        totalPage: null,
        sortName: "",
        sortOrder: "asc",
        params: {
          majorId: "",
          collegeId: "",
          stuSex: "",
          startTime: "",
          endTime: "",
          stuNumber: "",
          stuName: "",
          stuCard: ""
        },
        list: []
      },
      student: {
        stuId: "",
        stuNumber: "",
        stuPassword: "",
        stuCard: "",
        stuName: "",
        stuSex: "",
        stuAge: "",
        stuMajor: "",
        stuImg: "",
        stuEntranceTime: "",
        stuCollege: ""
      },
      rules: {
        stuNumber: [{ required: true, message: "请输入学号", trigger: "blur" }],
        stuPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        stuName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        stuSex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        stuAge: [{ required: true, message: "年龄不能为空", trigger: "blur" }],
        stuImg: [{ required: true, message: "请输入题库名", trigger: "blur" }],
        stuCard: [
          { required: true, message: "身份证号码不能为空", trigger: "blur" }
        ]
      },
      collegeList: [],
      majorList: [],
      majorList0: [],
      college: {
        dictId: "",
        dictName: ""
      },
      major: {
        dictId: "",
        dictName: ""
      },
      imageUrl: "",
      imgLoading: false,
      isdisabledFn: false,
      dialogTitle: "新增学生",
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

      if (this.student.stuId != "") {
        this.$refs.student.validate(valid => {
          if (valid) {
            this.loading = true;
            stuApi.update(this.student).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible = false;
                this.$message.success(res.msg);
                this.loading = false;
                this.list();
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
      this.$refs.student.validate(valid => {
        if (valid) {
          this.loading = true;
          stuApi.save(this.student).then(res => {
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      }
    },
    list() {
      // 分页查询
      this.loading = true;
      if (this.timeInterval != null) {
        this.page.params.startTime = this.timeInterval[0];
        this.page.params.endTime = this.timeInterval[1];
      } else {
        this.page.params.startTime = "";
        this.page.params.endTime = "";
      }
      stuApi.list(this.page).then(res => {
        if (res.code == 200) {
          this.page = res.data;
          this.loading = false;
        }
      });
    },
    toUpdate(id) {
      // 打开弹窗，进行修改
      // 根据id查询
      stuApi.get(id).then(res => {
        if (res.code == 200) {
          this.student = res.data;
          this.dialogTitle = "修改学生";
          this.dialogFormVisible = true;
          this.isdisabledFn = true;
        }
      });
    },

    getDetails(id) {
      // 加载查看详情表单
      stuApi.get(id).then(res => {
        if (res.code == 200) {
          this.student = res.data;
          this.dialogResumeVisible = true;
        }
      });
    },
    toAdd() {
      this.college = {
        collegeId: "",
        collegeName: ""
      };

      this.major = {
        majorId: "",
        majorName: ""
      };
      this.dialogTitle = "新增学生";
      this.dialogFormVisible = true;
      this.isdisabledFn = false;
      // this.imageUrl = "";
    },
    toDelete(id) {
      this.$confirm("确定删除这条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        student: "error"
      }).then(() => {
        stuApi.delete(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              student: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              student: "error"
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
    getMajor() {
      // 查询学院
      dictApi.all({ dictType: "major" }).then(res => {
        this.majorList = res.data;
      });
    },
    getSon(id) {
      // 根据学院查询专业
      dictApi.getByFather(id).then(res => {
        this.majorList0 = res.data;
      });
    },

    handleAvatarSuccess(res, file) {
      // this.student.stuImg = URL.createObjectURL(file.raw);
      this.imageUrl = res.data.fileUrl;
      this.student.stuImg = this.imageUrl;
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
    this.getMajor()
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
.img {
  width: 150px;
  height: 150px;
  background-color: aquamarine;
  margin: 15px;
}
.stu-submit-part {
  margin: 0 37% 2%;
}
</style>
