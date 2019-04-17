<template>
  <div>
    <!-- 添加选择题组件 -->
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="题干">
          <el-input v-model="page.params.choiceTitle" placeholder="题干" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-select clearable v-model="page.params.choiceDifficulty" filterable placeholder="请选择">
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
    <el-row v-for="question in page.list" :key="question.choiceId" v-loading="loading">
      <el-card class="card-box">
        <div slot="header" class="clearfix">
          <pre style="float: left; padding-top: 10px; line-height: 10px">{{ question.choiceTitle + '. (' + question.choiceScore + '分)' }}</pre>
          <el-dropdown style="float: right; margin-top: 8px">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="success" @click="toUpdate(question.choiceId)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="lookResolve(question)">查看解析</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="deleteById(question.choiceId)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-for="answer in question.choiceAnswer" :key="answer.answerId" class="item">
          {{ answer.answerNumber + '. ' + answer.answerContent }}
        </div>
        <div class="bottom clearfix">
          <div style="color: red">{{ '正确答案: ' + question.choiceTrue }}</div>
          <div style="margin-top: 8px;">
            <el-rate v-model="question.choiceDifficulty" disabled show-score allow-half text-color="#ff9900"
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
      <el-form :model="choice" label-width="80px" size="mini" v-loading="loading">
        <el-form-item label="题目">
          <el-input type="textarea" v-model="choice.choiceTitle"></el-input>
        </el-form-item>
        <el-form-item label="分值">
          <el-input v-model="choice.choiceScore" clearable></el-input>
        </el-form-item>
        <el-form-item label="难度系数">
          <el-rate v-model="choice.choiceDifficulty" show-score text-color="#ff9900" score-template="{value}">
          </el-rate>
        </el-form-item>
        <el-form-item v-for="answer in choice.choiceAnswer" :label="'选项' + answer.answerNumber"
          :key="answer.answerNumber">
          <el-input v-model="answer.answerContent" clearable></el-input>
          <el-button @click.prevent="removeAnswer(answer)">删除</el-button>
          <el-tooltip :content="answer.answerTrue==1?'正确':'错误'" placement="top">
            <el-switch v-model="answer.answerTrue" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="解析">
          <el-input type="textarea" v-model="choice.choiceResolve"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="addAnswer">添加选项</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加弹窗结束 -->
  </div>
</template>

<script>

  import choiceApi from '@/api/choice'

  export default {
    data() {
      return {
        dialogTitle: "添加题目", // 添加修改弹窗标题
        dialogFormVisible: false, // 控制弹窗显示隐藏
        loading: false, // 加载框
        choice: { // 选择题对象
          choiceTitle: '', // 题干
          choiceType: this.$route.query.typeId, // 题型
          choiceBank: this.$route.query.bankId, // 所属题库
          choiceKnow: this.$route.query.knowId, // 所属知识点
          choiceScore: 0, // 分值
          choiceDifficulty: 1, // 难度系数
          choiceResolve: "", // 解析
          choiceAnswer: [ // 选项
            {
              answerId: 0,
              answerContent: "", // 选项内容
              answerTrue: null, // 是否正确
              answerNumber: 'A'
            }
          ],
        },
        answerKey: 0,
        choiceNumber: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        page: {
          currentPage: 1,
          currentCount: 10,
          totalCount: null,
          totalPage: null,
          sortName: "",
          sortOrder: "asc",
          params: {
            typeId: this.$route.query.typeId,
            bankId: this.$route.query.bankId,
            knowId: this.$route.query.knowId,
          },
          list: []
        }
      }
    },
    methods: {
      toAdd() {
        // 打开添加弹窗
        // 清空题目
        this.choice.choiceId = ''
        this.dialogTitle = '添加题目'
        this.dialogFormVisible = true
      },
      save() {
        // 保存题目
        this.loading = true
        choiceApi.save(this.choice).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
          }
          this.loading = false
          this.dialogFormVisible = false
          this.list()
        })
      },
      removeAnswer(item) {
        // 删除选项
        var index = this.choice.choiceAnswer.indexOf(item)
        if (index !== -1) {
          this.answerKey = this.answerKey - 1
          this.choice.choiceAnswer.splice(index, 1)
        }
      },
      addAnswer() {
        // 添加选项
        this.answerKey = this.answerKey + 1
        let key = this.answerKey
        this.choice.choiceAnswer.push({
          "answerId": key,
          "answerContent": '',
          "answerTrue": 0,
          "answerNumber": this.choiceNumber[key]
        });
      },
      list() {
        // 分页查询
        this.loading = true
        choiceApi.list(this.page).then(res => {
          this.page = res.data
          this.loading = false
        })
      },
      lookResolve(question) {
        // 查看解析
        this.$alert(question.choiceResolve, '答案解析');
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
      deleteById(choiceId) {
        // 根据id删除
        this.$confirm('确定从题库中删除本题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          choiceApi.delete(choiceId).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list()
            }
          })
        })
      },
      toUpdate(choiceId) {
        choiceApi.get(choiceId).then(res => {
          this.choice = res.data
          this.dialogTitle = '修改题目'
          this.dialogFormVisible = true
          this.answerKey = res.data.choiceAnswer.length - 1
        })
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