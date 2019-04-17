<template>
  <div>
    <!-- 添加判断题组件 -->
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="题干">
          <el-input v-model="page.params.tfTitle" placeholder="题干" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-select clearable v-model="page.params.tfDifficulty" filterable placeholder="请选择">
            <el-option v-for="diff in 5" :key="diff" :label="diff" :value="diff"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="list">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 题目卡片列表 -->
    <el-row v-for="question in page.list" :key="question.tfId" v-loading="questionLoadiong">
      <el-card class="card-box">
        <div slot="header" class="clearfix">
          <pre style="float: left; padding-top: 10px; line-height: 10px">{{ question.tfTitle + '. (' + question.tfScore + '分)' }}</pre>
          <el-dropdown style="float: right; margin-top: 8px">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(question.tfId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="deleteById(question.tfId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="bottom clearfix">
          <div style="color: red">答案：{{ question.tfTrue == 1 ? '正确' : '错误' }}</div>
          <div style="margin-top: 8px;">
            <el-rate v-model="question.tfDifficulty" disabled show-score allow-half text-color="#ff9900"
              score-template="难度系数: {value}">
            </el-rate>
          </div>
        </div>
      </el-card>
    </el-row>
    <!-- 题目卡片列表结束 -->

    <!-- 分页插件 -->
    <div class="page-div banklist-page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.currentPage" :page-sizes="[5,10,15,20]" :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-- 分页插件结束 -->

    <!-- 添加弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="trueFalse" label-width="80px" size="mini" v-loading="loading">
        <el-form-item label="题目">
          <el-input type="textarea" v-model="trueFalse.tfTitle"></el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="trueFalse.tfScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否正确">
          <el-radio v-model="trueFalse.tfTrue" :label="1">正确</el-radio>
          <el-radio v-model="trueFalse.tfTrue" :label="0">错误</el-radio>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate v-model="trueFalse.tfDifficulty" show-score text-color="#ff9900" score-template="{value}">
          </el-rate>
        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" v-model="trueFalse.tfResolve"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹窗结束 -->
  </div>
</template>

<script>

  import trueFalseApi from '@/api/trueFalse'

  export default {
    data() {
      return {
        dialogTitle: "添加题目", // 添加修改弹窗标题
        dialogFormVisible: false, // 控制弹窗显示隐藏
        loading: false, // 加载框
       loading: false, // 题目加载
        page: {
          currentPage: 1,
          currentCount: 10,
          totalCount: null,
          totalPage: null,
          sortName: "",
          sortOrder: "asc",
          params: {
            bankId: this.$route.query.bankId,
            knowId: this.$route.query.knowId,
          },
          list: []
        },
        trueFalse: { // 判断题
        },
      }
    },
    methods: {
      toAdd() {
        // 打开添加弹窗
        this.trueFalse.tfId = ''
        this.dialogFormVisible = true
        this.dialogTitle = '添加题目'
      },
      save() {
        // 保存题目
        if (this.trueFalse.tfId == '') {
          // 是添加
          trueFalseApi.save(this.trueFalse).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.list()
            }
          })
        } else {
          // 是修改
          trueFalseApi.update(this.trueFalse).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.list()
            }
          })
        }

      },
      list() {
        // 分页查询
        this.questionLoadiong = true
        trueFalseApi.list(this.page).then(res => {
          if (res.code == 200) {
            this.page = res.data
            this.loading = false
          }
        })
      },
      toUpdate(tfId) {
        trueFalseApi.get(tfId).then(res => {
          this.trueFalse = res.data
          this.dialogTitle = '修改题目'
          this.dialogFormVisible = true
        })
      },
      deleteById(tfId) {
        // 根据id删除
        this.$confirm('确定从题库中删除本题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          trueFalseApi.delete(tfId).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list()
            }
          })
        })
      },
      lookResolve(question) {
        // 查看解析
        this.$alert(question.tfResolve, '答案解析');
      },
      handleSizeChange(val) {
        // 改变每页大小
        this.page.currentCount = val;
        this.list();
      },
      handleCurrentChange(val) {
        // 改变页数
        this.page.currentPage = val;
        this.list();
      },
    },
    created() {
      this.list()
    }
  }
</script>

<style scoped>
  .el-input {
    width: 80%
  }

  .item {
    margin-bottom: 18px;
  }

  .card-box {
    margin-top: 15px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .page-div {
    margin-top: 15px;
  }
</style>