<template>
  <div>
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="题库名">
          <el-input v-model="page.params.bankName" placeholder="题库名" clearable></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select clearable v-model="page.params.bankCollege" filterable placeholder="请选择">
            <el-option v-for="college in collegeList" :key="college.dictId" :label="college.dictName"
              :value="college.dictId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="page.params.bankSubject" filterable placeholder="请选择" clearable>
            <el-option v-for="subject in subjectList" :key="subject.dictId" :label="subject.dictName"
              :value="subject.dictId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 题库列表开始 -->
    <el-row>
      <el-col :span="6" v-for="bank in page.list" :key="bank.bankId" :offset="1">
        <el-card :body-style="{ padding: '0px' }" style="padding: 0px" shadow="hover" class="bank-card">
          <img :src="bank.bankImg" class="image">
          <div style="padding: 8px;">
            <p>题库名称: {{ bank.bankName }}</p>
            <p>学院: {{ bank.college.dictName }}</p>
            <p>科目: {{ bank.subject.dictName }}</p>
          </div>
          <el-dropdown style="float: right;">
            <span class="el-dropdown-link">
              <el-button icon="el-icon-menu" plain size="mini"></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="success" size="mini" @click="toUpdate(bank.bankId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" @click="toKnowledge(bank.bankId)">知识点</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="danger" size="mini" @click="toDelete(bank.bankId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-card>
      </el-col>
    </el-row>
    <!-- 题库列表结束 -->

    <!-- 分页组件开始 -->
    <div class="page-div banklist-page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.currentPage" :page-sizes="[10,15,20,30]" :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-- 分页组件结束 -->

    <!-- 新增修改弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading="loading">
      <el-form :rules="rules" ref="bank" :model="bank" label-width="80px" size="mini">
        <el-form-item label="题库名称" prop="bankName">
          <el-input v-model="bank.bankName" clearable></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="bank.bankCollege" filterable placeholder="请选择" clearable>
            <el-option v-for="college in collegeList" :key="college.dictId" :label="college.dictName"
              :value="college.dictId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="bank.bankSubject" filterable placeholder="请选择" clearable>
            <el-option v-for="subject in subjectList" :key="subject.dictId" :label="subject.dictName"
              :value="subject.dictId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传封面:">
          <el-upload class="avatar-uploader" action="http://192.168.0.120:8080/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="file" v-loading="imgLoading">
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
    <!-- 新增修改弹窗结束 -->
  </div>
</template>

<script>
  import dictApi from "@/api/dict";
  import bankApi from "@/api/bank";
  import typeApi from "@/api/type";
  import bankTypeApi from "@/api/bankType";
  import { Loading } from "element-ui";

  export default {
    data() {
      return {
        imageUrl: "",
        dialogFormVisible: false, // 弹出层隐藏
        page: {
          currentPage: 1,
          currentCount: 10,
          totalCount: null,
          totalPage: null,
          sortName: "",
          sortOrder: "asc",
          params: {
            dictType: "college"
          },
          list: []
        },
        bank: {
          bankId: "",
          bankName: "",
          bankImg: "",
          bankCollege: "",
          bankSubject: ""
        },
        rules: {
          bankName: [{ required: true, message: "请输入题库名", trigger: "blur" }]
        },
        collegeList: [],
        subjectList: [],
        dialogTitle: "新增题库",
        imgLoading: false,
        loading: false, // 是否显示加载框
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
        // 保存或修改
        this.$refs.bank.validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.bank.bankId != "") {
              bankApi.update(this.bank).then(res => {
                if (res.code == 200) {
                  this.dialogFormVisible = false;
                  this.$message.success(res.msg);
                  this.loading = false;
                  this.list();
                }
              });
            } else {
              bankApi.save(this.bank).then(res => {
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
        bankApi.list(this.page).then(res => {
          this.page = res.data;
        });
      },
      toUpdate(id) {
        // 打开弹窗，进行修改
        this.dialogTitle = "修改题库";
        // 根据id查询题库
        bankApi.get(id).then(res => {
          this.bank = res.data;
          this.imageUrl = this.bank.bankImg;
        });
        // 赋值给bank
        // 弹窗回显
        this.dialogFormVisible = true;
      },
      toAdd() {
        this.dialogTitle = "新增题库";
        this.bank = { bankId: "" };
        this.dialogFormVisible = true;
        this.imageUrl = "";
      },
      toDelete(id) {
        this.$confirm("确定删除这条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        }).then(() => {
          bankApi.delete(id).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.list();
            } else {
              this.$message.error("删除失败");
            }
          });
        });
      },
      getCollege() {
        // 加载学院
        dictApi.all({ dictType: "college" }).then(res => {
          this.collegeList = res.data;
        });
      },
      getSubject() {
        // 加载科目
        dictApi.all({ dictType: "subject" }).then(res => {
          this.subjectList = res.data;
        });
      },
      search() {
        this.list();
      },
      getMajor(id) { },
      handleAvatarSuccess(res, file) {
        // this.bank.bankImg = URL.createObjectURL(file.raw);
        this.imageUrl = res.data.fileUrl;
        this.bank.bankImg = this.imageUrl;
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
      toKnowledge(bankId) {
        // 查看知识点
        this.$router.push({
          name: 'knowledge',
          params: {
            bankId: bankId
          }
        })
      }
    },
    created() {
      this.list()
      this.getCollege()
      this.getSubject()
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

  .time {
    font-size: 13px;
    color: #999;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 260px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .el-col {
    width: 20%;
    height: 450px;
    margin-bottom: 50px;
  }

  .bank-card {
    padding: 3px;
  }

  .bank-card p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
  }
</style>