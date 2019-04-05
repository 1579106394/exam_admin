<template>
  <div>
    <div class="table-header">

      <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
        <el-form-item label="职称名">
          <el-input v-model="page.params.dictName" placeholder="职称名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
      <hr>
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>

    </div>
    <el-table :data="page.list" border stripe style="width: 100%" @sort-change="sortHandler" size="mini"
      v-loading="loading">
      <el-table-column prop="dictName" sortable="custom" label="职称名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="toUpdate(scope.row.dictId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="toDelete(scope.row.dictId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-div">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page.currentPage" :page-sizes="[10,15,20,30]" :page-size="page.currentCount"
        layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount">
      </el-pagination>
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="title" label-width="80px" size="mini">
        <el-form-item label="职称名称">
          <el-input v-model="title.dictName" clearable></el-input>
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

  export default {
    data() {
      return {
        dialogFormVisible: false, // 弹出层隐藏
        page: {
          currentPage: 1,
          currentCount: 10,
          totalCount: null,
          totalPage: null,
          sortName: '',
          sortOrder: 'asc',
          params: {
            dictType: 'title'
          },
          list: []
        },
        title: {
          dictId: '',
          dictName: '',
          dictType: 'title'
        },
        dialogTitle: '新增职称',
        currentPage4: 4,
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
        dictApi.save(this.title).then(res => {
          if (res.code === 200) {
            // 操作
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.list()
          }
        })
      },
      list() { // 分页查询
        this.loading = true
        dictApi.list(this.page).then(res => {
          if (res.code == 200) {
            this.page = res.data
            this.loading = false
          }
        })
      },
      toUpdate(id) { // 打开弹窗，进行修改
        // 根据id查询
        dictApi.get(id).then(res => {
          if (res.code == 200) {
            this.title = res.data
            this.dialogTitle = '修改职称'
            this.dialogFormVisible = true
          }
        })
      },
      toAdd() {
        this.title = {
          dictId: '',
          dictName: '',
          dictType: 'title'
        }
        this.dialogTitle = '新增职称'
        this.dialogFormVisible = true
      },
      toDelete(id) {
        this.$confirm('确定删除这条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          dictApi.delete(id).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message.error('删除失败')
            }
            this.list()
          })
        });
      },
      search() {
        this.list()
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
</style>