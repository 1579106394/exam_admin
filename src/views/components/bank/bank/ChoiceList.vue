<template>
  <div>
    <!-- 添加选择题组件 -->
    <!-- 搜索框界面 -->
    <div class="table-header">
      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item>
          <el-button type="primary" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <!-- 搜索框结束 -->

    <!-- 添加弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading="loading">
      <el-form :model="choice" label-width="80px" size="mini">
        <el-form-item label="内容">
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


  export default {
    data() {
      return {
        "bankId": this.$route.params.bankId, // 父组件带进来的题库id
        "typeId": this.$route.params.typeId, // 父组件带进来的题型id
        "page": { // 分页对象

        },
        "dialogTitle": "添加题目", // 添加修改弹窗标题
        "dialogFormVisible": false, // 控制弹窗显示隐藏
        "loading": false, // 加载框
        "choice": {}, // 选择题对象
      }
    },
    methods: {
      toAdd() {
        // 打开添加弹窗
        this.dialogFormVisible = true
      },
      save() {
        // 添加函数
        console.log(this.$refs.editor.editorContent);
      }
    },
    created() {
    }
  }
</script>

<style scoped>
</style>