<template>
  <div>
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="知识点">
          <el-input v-model="page.params.knowName" placeholder="知识点" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="list" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <el-row :gutter="20">
      <!-- 左边，卡片视图显示题库 -->
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card :body-style="{ padding: '0px' }" style="padding: 0px" shadow="hover" class="bank-card">
            <img :src="bank.bankImg" class="image">
            <div style="padding: 8px;">
              <p>题库名称: {{ bank.bankName }}</p>
              <p>学院: {{ bank.college.dictName }}</p>
              <p>科目: {{ bank.subject.dictName }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 左边结束 -->

      <!-- 右边，表格显示知识点 -->
      <el-col :span="18">
        <div class="grid-content bg-purple">
          <el-table :data="page.list" style="width: 100%">
            <el-table-column type="index" label="编号"></el-table-column>
            <el-table-column prop="knowName" align="center" label="知识点"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="primary" size="mini">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-button size="mini" type="success" @click="toUpdate(scope.row.knowId)">编辑</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button type="primary" size="mini" @click="toType(scope.row.knowId)">查看题型</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button size="mini" type="danger" @click="deleteKnow(scope.row.knowId)">删除</el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页组件开始 -->
        <div class="page-div banklist-page">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page.currentPage" :page-sizes="[10,15,20,30]" :page-size="page.currentCount"
            layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
        <!-- 分页组件结束 -->

      </el-col>
      <!-- 右边结束 -->
    </el-row>

    <!-- 新增修改弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="bankKnowledge" label-width="100px" size="mini">
        <el-form-item label="知识点名称">
          <el-input v-model="bankKnowledge.knowName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增修改弹窗结束 -->


    <!-- 查看题型弹窗 -->
    <el-dialog title="查看题型" :visible.sync="dialogType">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini" label-width="80px" v-loading="loading">
        <el-form-item label="题型">
          <el-select v-model="bankType.bankType" filterable placeholder="请选择" clearable>
            <el-option v-for="type in typeList" :key="type.typeId" :label="type.typeName" :value="type.typeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addBankType" size="mini">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="bankTypeList" style="width: 100%">
        <el-table-column type="index" show-header="false"></el-table-column>
        <el-table-column prop="type.typeName" show-header="false" align="center"></el-table-column>
        <el-table-column show-header="false" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="toQuestion(scope.row.bankId, scope.row.bankType)">
              查看题目
            </el-button>
            <el-button size="mini" type="danger" @click="deleteBankType(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看题型弹窗结束 -->

  </div>
</template>

<script>

  import bankApi from "@/api/bank"
  import knowledgeApi from '@/api/knowledge'
  import typeApi from "@/api/type"
  import bankTypeApi from "@/api/bankType"

  export default {
    data() {
      return {
        page: { // 分页对象
          params: {
            bankId: this.$route.params.bankId, // 题库id
          }
        },
        bank: { // 题库信息
          college: {},
          subject: {},
        },
        dialogFormVisible: false, // 控制新增修改弹窗
        bankKnowledge: { // 知识点
          knowId: '', // id
          knowBank: this.$route.params.bankId, // 题库id
        },
        dialogTitle: '新增知识点', // 弹窗标题
        loading: true, // 加载
        dialogType: false, // 题型弹窗
        typeList: [], // 题型列表
        bankType: {}, // 用于分配题型
        bankTypeList: [], // 显示题库的题型列表
      }
    },
    methods: {
      toAdd() {
        // 打开添加弹窗
        this.dialogFormVisible = true
        this.dialogTitle = '新增知识点'
        this.bankKnowledge = { knowId: '', knowBank: this.page.params.bankId }
      },
      toUpdate(knowId) {
        // 打开编辑弹窗，进行修改
        knowledgeApi.get(knowId).then(res => {
          if (res.code == 200) {
            this.bankKnowledge = res.data
            this.dialogTitle = '修改知识点'
            this.dialogFormVisible = true
          }
        })
      },
      getBank() {
        // 页面加载查询题库
        bankApi.get(this.page.params.bankId).then(res => {
          if (res.code == 200) {
            this.bank = res.data
          }
        })
      },
      save() {
        if (this.bankKnowledge.knowId != '') {
          // 修改
          knowledgeApi.update(this.bankKnowledge).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
            }
            this.dialogFormVisible = false
            this.list()
          })
        } else {
          // 保存
          knowledgeApi.save(this.bankKnowledge).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
            }
            this.dialogFormVisible = false
            this.list()
          })
        }
      },
      list() {
        // 分页查询
        this.loading = true
        knowledgeApi.list(this.page).then(res => {
          if (res.code == 200) {
            this.page = res.data
            this.loading = false
          }
        })
      },
      deleteKnow(knowId) {
        this.$confirm("确定删除这条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        }).then(() => {
          knowledgeApi.delete(knowId).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.list();
            }
          });
        });
      },
      handleSizeChange(val) {
        this.page.currentCount = val;
        this.list();
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.list();
      },

      toType(knowId) {
        // 展开分配题型弹出层
        this.bankType.bankKnow = knowId
        this.bankType.bankId = this.page.params.bankId
        this.dialogType = true
        this.btList()
      },
      getTypeList() {
        // 加载题型列表
        this.loading = true
        typeApi.all().then(res => {
          this.typeList = res.data
          this.loading = false
        })
      },
      addBankType() {
        // 分配题型
        bankTypeApi.save(this.bankType).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg)
            this.btList()
          }
        })
      },
      deleteBankType(id) {
        // 删除这个题库的某个题型
        this.$confirm('确定从题库中移出此题型吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          bankTypeApi.delete(id).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.btList()
            }
          })
        })
      },
      btList() {
        // 抽取出来的函数，加载某个题库的题型列表
        bankTypeApi.list(this.bankType.bankKnow).then(res => {
          this.bankTypeList = res.data
        })
      },
      toQuestion(bankId, typeId) {
        // 跳转到添加题目页面
        if (typeId == 1 || typeId == 2) {
          // type为1或者2，是单选或者多选
          this.$router.push({
            name: 'choice',
            query: {
              bankId: bankId,
              typeId: typeId,
              knowId: this.bankType.bankKnow
            }
          })
        }
        if (typeId == 3) {
          // type为3，是判断题
          this.$router.push({
            name: 'truefalse',
            query: {
              bankId: bankId,
              knowId: this.bankType.bankKnow
            }
          })
        }
        if (typeId == 4) {
          // type为3，是判断题
          this.$router.push({
            name: 'completion',
            query: {
              bankId: bankId,
              knowId: this.bankType.bankKnow
            }
          })
        }
      },
    },
    created() {
      this.getBank()
      this.list()
      this.getTypeList()
    }
  };
</script>

<style scoped>
  .table-header {
    margin-bottom: 15px;
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

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .page-div {
    margin-top: 15px;
  }
</style>