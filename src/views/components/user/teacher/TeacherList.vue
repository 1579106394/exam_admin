<template>
  <div>
    <div class="table-header">
      <!-- 搜索部分开始 -->
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="姓名">
          <el-input v-model="page.params.teacherName" placeholder="教师名" clearable></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="page.params.teacherNumber" placeholder="工号" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select clearable v-model="page.params.teacherSex" filterable placeholder="请选择">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="2" label="女" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职务">
          <el-select clearable v-model="page.params.jobId" filterable placeholder="请选择">
            <el-option
              v-for="job in jobList"
              :key="job.dictId"
              :label="job.dictName"
              :value="job.dictId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select clearable v-model="page.params.titleId" filterable placeholder="请选择">
            <el-option
              v-for="title in titleList"
              :key="title.dictId"
              :label="title.dictName"
              :value="title.dictId"
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
        <el-form-item label="入职时间区间" prop>
          <div class="block">
            <el-date-picker
              v-model="timeInterval"
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

      <el-table-column fixed="right" label="操作">
        <template class="teacher-do" slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(scope.row.teacherId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="getDetails(scope.row.teacherId)">查看详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="checkRole(scope.row.teacherId)">修改角色</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="toDelete(scope.row.teacherId)">删除</el-button>
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

        <el-form-item class="teacher-submit-part">
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
        ref="teacher"
        :inline="true"
        :model="teacher"
        label-width="80px"
        size="mini"
        label-position="right"
        :disabled="false"
      >
        <img :src="teacher.teacherImg" class="avatar" style="margin:-6% 39% 2%;">
        <el-form-item label="工号" prop="teacherNumber">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="teacherPassword">
          <el-input v-model="teacher.teacherPassword"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="teacherName">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherName"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="teacherSex">
          <el-radio-group v-model="teacher.teacherSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="teacherCard">
          <el-input :disabled="isdisabledFn" v-model="teacher.teacherCard"></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="teacherAge">
          <el-input v-model="teacher.teacherAge"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="teacherMobile">
          <el-input v-model="teacher.teacherMobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="teacherEmail">
          <el-input v-model="teacher.teacherEmail"></el-input>
        </el-form-item>

        <el-form-item label="学院" prop="teacherCollege">
          <el-select v-model="teacher.teacherCollege" filterable placeholder="请选择">
            <el-option
              v-for="college in collegeList"
              :key="college.dictId"
              :label="college.dictName"
              :value="college.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职称" prop="teacherCollege">
          <el-select v-model="teacher.teacherTitle" filterable placeholder="请选择">
            <el-option
              v-for="title in titleList"
              :key="title.dictId"
              :label="title.dictName"
              :value="title.dictId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职务">
          <el-select v-model="teacher.teacherJob" filterable placeholder="请选择">
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
      </el-form>
    </el-dialog>
    <!-- 详情弹窗结束 -->

    <!-- 下面是角色操作组件 -->
    <el-dialog title="修改角色" :visible.sync="dialogRoleTree">
      <el-tree
        :data="roleTree"
        :props="defaultProps"
        show-checkbox
        node-key="roleId"
        default-expand-all
        v-loading="loading"
        :expand-on-click-node="false"
        :default-checked-keys="checkIds"
        @check-change="handleCheckChange"
      ></el-tree>
      <el-button size="mini" type="primary" @click="updateRole">提交</el-button>
      <el-button size="mini" @click="dialogRoleTree=false">取消</el-button>
    </el-dialog>
    <!-- 权限操作组件结束 -->
  </div>
</template>
<script>
import teacherApi from "@/api/teacher";
import dictApi from "@/api/dict";
import { Loading } from "element-ui";
import RoleApi from "@/api/role";
import TeacherRoleApi from "@/api/teacherRole";

export default {
  data() {
    return {
      timeInterval: null, // 入职时间区间(数组)
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
      rules: {
        teacherNumber: [
          { required: true, message: "请输入工号", trigger: "blur" },
        ],
        teacherPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        teacherName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        teacherSex: [
          { required: true, message: "请选择性别", trigger: "blur" }
        ],
        teacherAge: [
          { required: true, message: "年龄不能为空", trigger: "blur" },
        ],
        teacherImg: [
          { required: true, message: "请输入题库名", trigger: "blur" }
        ]
      },
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
      loading: true, // 是否显示加载框
      roleTree: [], // 角色树形列表
      defaultProps: {
        children: "list",
        label: "roleName"
      },
      checkIds: [], // 角色树默认选中
      checkTeacher: "", // 当前点击的教师id
      teacherRoles: [] // 教师-角色数组，用于添加
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

      if (this.teacher.teacherId != "") {
        this.$refs.teacher.validate(valid => {
          if (valid) {
            this.loading = true;
            teacherApi.update(this.teacher).then(res => {
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
        this.$refs.teacher.validate(valid => {
          if (valid) {
            this.loading = true;
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

    getDetails(id) {
      // 加载查看详情表单
      teacherApi.get(id).then(res => {
        if (res.code == 200) {
          this.teacher = res.data;
          this.dialogResumeVisible = true;
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
      // this.imageUrl = "";
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
    },
    treeList() {
      // 树形加载
      RoleApi.treeList().then(res => {
        if (res.code == 200) {
          this.roleTree = res.data;
          this.loading = false;
        }
      });
    },
    checkRole(id) {
      this.checkTeacher = id;
      TeacherRoleApi.roleList(id).then(res => {
        if (res.code == 200) {
          this.checkIds = res.data;
          this.dialogRoleTree = true;
          // 遍历数组进行拷贝
          this.checkIds.forEach((value, key) => {
            console.log(value);
            this.teacherRoles.push({
              trTeacher: this.checkTeacher,
              trRole: value
            });
          });
        }
      });
    },
    updateRole() {
      TeacherRoleApi.update(this.teacherRoles).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
        }
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      // 先找数组中是否已经有了被勾选的元素
      let index = this.teacherRoles.findIndex(e => e.trRole == data.roleId);
      // 如果这个元素被勾选了，数组中也没有，那就添加
      if (checked && index === -1) {
        this.teacherRoles.push({
          trTeacher: this.checkTeacher,
          trRole: data.roleId
        });
      }
      // 如果这个元素没被勾选，但是数组中有，就删除
      if (!checked && index !== -1) {
        this.teacherRoles.splice(index, 1);
      }
    }
  },
  created() {
    this.list();
    this.getCollege();
    this.getTitle();
    this.getJob();
    this.treeList();
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

.teacher-submit-part {
  padding: 13% 0 0 10%;
}

.img {
  width: 150px;
  height: 150px;
  background-color: aquamarine;
  margin: 15px;
}
</style>