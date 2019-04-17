<template>
  <div>
    <!-- 添加判断题组件 -->
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="题干">
          <el-input v-model="page.params.compContent" placeholder="题干" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-select clearable v-model="page.params.compDifficulty" filterable placeholder="请选择">
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
    <el-row v-for="question in page.list" :key="question.tfId" v-loading="loading">
      <el-card class="card-box">
        <div slot="header" class="clearfix">
          <pre
            style="float: left; padding-top: 10px; line-height: 10px">{{ question.compContent + '. (' + question.compScore + '分)' }}</pre>
          <el-dropdown style="float: right; margin-top: 8px">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(question.compId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="deleteById(question.compId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="bottom clearfix">
          <div style="color: red; line-height: 15px;" v-for="(answer, index) in question.answerList" :key="answer.answerId">
            第({{ index + 1 }})空：{{ answer.answerContent }}</div>
          <div style="margin-top: 8px;">
            <el-rate v-model="question.compDifficulty" disabled show-score allow-half text-color="#ff9900"
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
      <el-form :model="completion" label-width="80px" size="mini" v-loading="loading">
        <el-form-item label="题目">
          <el-input type="textarea" v-model="completion.compContent" @input="checkComp"></el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="completion.compScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate v-model="completion.compDifficulty" show-score text-color="#ff9900" score-template="{value}">
          </el-rate>
        </el-form-item>
        <el-form-item v-for="answer in completion.answerList" :label="'填空' + answer.answerNumber"
          :key="answer.answerNumber">
          <el-input v-model="answer.answerContent" clearable></el-input>
        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" v-model="completion.compResolve"></el-input>
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

  import completionApi from '@/api/completion'

  export default {
    data() {
      return {
        dialogTitle: "添加题目", // 添加修改弹窗标题
        dialogFormVisible: false, // 控制弹窗显示隐藏
        loading: false, // 加载框
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
        completion: { // 填空题
          compId: '', // id
          compContent: '', // 题目内容
          compScore: 0, // 分值
          compDifficulty: 1, // 难度系数
          compBank: this.$route.query.bankId, // 所属tikuid
          compKnow: this.$route.query.knowId, // 所属知识点id
          compResolve: '', // 解析
          answerList: [ // 填空列表
          ],
        },
        answerKey: 0,
        answerCount: 0, // 填空题空的数量
      }
    },
    methods: {
      toAdd() {
        // 打开添加弹窗
        this.completion.compId = ''
        this.dialogFormVisible = true
        this.dialogTitle = '添加题目'
        // 弹窗提示一下
        this.$alert('填空题三个以上下划线为一个空，输入下划线的方法是在英文状态下按住shift+_，下划线键在键盘上方0右边')
      },
      save() {
        if (this.completion.compId == '') {
          // 保存题目
          this.loading = true
          completionApi.save(this.completion).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list()
              this.dialogFormVisible = false
              this.loading = false
            }
          })
        } else {
          // 修改题目
          this.loading = true
          completionApi.update(this.completion).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list()
              this.dialogFormVisible = false
              this.loading = false
            }
          })
        }
      },
      list() {
        // 分页查询
        this.loading = true
        completionApi.list(this.page).then(res => {
          if (res.code == 200) {
            this.page = res.data
            this.loading = false
          }
        })
      },
      toUpdate(compId) {
        this.dialogTitle = '修改题目'
        this.dialogFormVisible = true
        completionApi.get(compId).then(res => {
          if (res.code == 200) {
            this.completion = res.data
            this.answerCount = res.data.answerList.length
            this.answerKey = res.data.answerList.length
            console.log(res.data.answerList.length);
          }
        })
        // 弹窗提示一下
        this.$alert('填空题三个以上下划线为一个空，输入下划线的方法是在英文状态下按住shift+_，下划线键在键盘上方0右边')
      },
      deleteById(compId) {
        // 根据id删除
        // 根据id删除
        this.$confirm('确定从题库中删除本题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          completionApi.delete(compId).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list()
            }
          })
        })

      },
      lookResolve(question) {
        // 查看解析
        this.$alert(question.compResolve, '答案解析');
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
      removeAnswer() {
        // 删除填空
        this.answerKey = this.answerKey - 1
        this.completion.answerList.splice(this.completion.answerList.length - 1, 1)
      },
      addAnswer() {
        // 添加填空
        this.answerKey += 1
        let key = this.answerKey
        this.completion.answerList.push({
          "answerId": key,
          "answerContent": '',
          "answerNumber": key
        })
      },
      checkComp() {
        // 检查下划线
        let count = 0
        let str = this.completion.compContent
        // 替换第一个空
        let index = str.indexOf('___')
        if (index > -1) {
          count++
          str = str.replace('___', '')
          str = str.substring(index, str.length)
        }
        // 循环这个字符串，替换每一个空
        while (index > -1) {
          index = str.indexOf('___')
          // 第一个空不替换，因为这样的是紧接着上一个的
          if (index > 0) {
            count++
          }
          str = str.replace('___', '')
          str = str.substring(index, str.length)
        }

        // 计算当前空与已存在的空的差，如果大于0，就添加这些数量的输入框，如果小于0，就减少这些数量的输入框
        let nodeCount = count - this.answerCount
        if (nodeCount > 0) {
          // 大于0，增加这些
          for (let i = 0; i < nodeCount; i++) {
            this.addAnswer()
          }
        } else {
          for (let i = 0; i > nodeCount; i--) {
            this.removeAnswer()
          }
        }
        // 最后，重新复制空的数量
        this.answerCount = count
      }
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