<template>
  <div>
    <div class="table-header">
      <el-button type="primary" size="mini" @click="toAdd">添加</el-button>
    </div>
    <el-tree :data="roleTree" :props="defaultProps" show-checkbox node-key="roleId" default-expand-all
      :render-content="renderContent" v-loading="loading" :expand-on-click-node="false">
    </el-tree>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-loading="loading">
      <el-form :model="role" label-width="80px" size="mini">
        <el-form-item label="角色名">
          <el-input v-model="role.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="role.roleIndex" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级角色">
          <el-select v-model="role.roleFather" filterable placeholder="请选择" clearable>
            <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="role.roleComment" clearable></el-input>
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
  let id = 1000;
  import RoleApi from "@/api/role"

  export default {
    data() {
      return {
        roleTree: [], // 角色树形列表
        defaultProps: {
          children: 'list',
          label: 'roleName'
        },
        loading: true,
        dialogTitle: "添加角色",
        dialogFormVisible: false,
        role: {
          "roleName": "",
          "roleFather": "",
          "roleIndex": null,
          "roleComment": ""
        },
        roleList: [] // 用于下拉框的角色列表
      }
    },

    methods: {
      delete(id) {
        this.$confirm("确定删除这条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        }).then(() => {
          RoleApi.delete(id).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.treeList();
            } else {
              this.$message.error("删除失败");
            }
          });
        });
      },
      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 16px; padding-right: 8px;">
            <span>
              <el-tooltip class="item" effect="dark" content={data.roleComment} placement="top">
                <span style="font-size: 14px;">
                  {node.label}
                </span>
              </el-tooltip>
            </span>
            <span>
              <el-button style="font-size: 12px; color: green;" type="text" on-click={() => this.toUpdate(data.roleId)}>修改</el-button>
              <el-button style="font-size: 12px; color: red;" type="text" on-click={() => this.delete(data.roleId)}>删除</el-button>
            </span>
          </span>);
      },
      treeList() {
        RoleApi.treeList().then(res => {
          if (res.code == 200) {
            this.roleTree = res.data
            this.loading = false
          }
        })
      },
      all() {
        RoleApi.all().then(res => {
          if (res.code == 200) {
            this.roleList = res.data
          }
        })
      },
      toAdd() {
        this.dialogTitle = '添加角色'
        this.role = {}
        this.dialogFormVisible = true
      },
      save() {
        if (this.role.roleId != '') {
          // 修改
          RoleApi.update(this.role).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.treeList()
            }
          })
        } else {
          // 添加
          RoleApi.save(this.role).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.treeList()
            }
          })
        }
      },
      toUpdate(id) {
        RoleApi.get(id).then(res => {
          this.role = res.data
          this.dialogTitle = '修改角色'
          this.dialogFormVisible = true
        })
      }
    },
    created() {
      this.treeList()
      this.all()
    }
  }
</script>

<style scoped>
  .table-header {
    margin-bottom: 10px;
  }

  .box {
    width: 400px;
  }

  .top {
    text-align: center;
  }

  .item {
    margin: 4px;
  }
</style>