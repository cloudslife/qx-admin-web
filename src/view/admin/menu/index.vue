<template>
  <div class="content">
    <div>
      <el-button type="primary" v-if="sys_menu_add" @click="addDept">新增</el-button>
      <el-button type="primary" v-if="sys_menu_edit" @click="editDept">修改</el-button>
      <el-button type="primary" v-if="sys_menu_del" @click="delDept">删除</el-button>
    </div>
    <div class="tree">
      <div class="dept-tree">
        <el-input
          placeholder="输入关键字进行过滤"
          style="margin-bottom: 20px"
          v-model="filterText">
        </el-input>
        <el-tree
          highlight-current
          :expand-on-click-node="false"
          style="margin-bottom: 30px"
          :data="deptTree"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          @node-click="selectDept"
          ref="tree">
        </el-tree>
      </div>
      <div class="dept-form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="菜单ID" prop="id" v-if="type!=='add'">
            <el-input
              :disabled="true"
              v-model="ruleForm.id"
              placeholder="请输入菜单ID"></el-input>
          </el-form-item>
          <el-form-item label="菜单名" prop="name">
            <el-input
              :disabled="disabled"
              v-model="ruleForm.name"
              placeholder="请输入菜单名"></el-input>
          </el-form-item>
          <el-form-item label="上级菜单ID" prop="parentId">
            <el-input
              :disabled="true"
              v-model="ruleForm.parentId"
              placeholder="请输入上级菜单ID"></el-input>
          </el-form-item>

          <el-form-item label="前端路由" prop="path">
            <el-input
              :disabled="disabled"
              v-model="ruleForm.path"
              placeholder="请输入前端路由"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission">
            <el-input
              :disabled="disabled"
              v-model="ruleForm.permission"
              placeholder="请输入菜单权限标识"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createdAt" v-if="type!=='add'">
            <el-input
              :disabled="true"
              v-model="ruleForm.createdAt"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input
              :disabled="disabled"
              placeholder="请输入阿里云图标"
              v-model="ruleForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              :disabled="disabled"
              v-model="ruleForm.type" placeholder="请选择菜单类型">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="排序" prop="sort">
            <el-input
              :disabled="disabled"
              v-model="ruleForm.sort"
              placeholder="请输入排序号"></el-input>
          </el-form-item>
          <el-form-item
            style="text-align: right"
          >
            <el-button v-if="!disabled" :loading="loading" @click="submit" type="primary">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { MenuApi } from '@/api/menu'
  import { mapGetters } from 'vuex'
  import { Msg } from '@/tools/message'
  export default {
    name: 'menumanage',
    created () {
      this.$store.dispatch('GetUserInfo')
      this.sys_menu_add = this.permissions.includes('sys_menu_add')
      this.sys_menu_edit = this.permissions.includes('sys_menu_edit')
      this.sys_menu_del = this.permissions.includes('sys_menu_del')
      this.showDeptTree()
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    data () {
      return {
        type: '',
        loading: false,
        filterText: '',
        deptTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        types: [{
          value: 0,
          label: '菜单'
        },{
          value: 1,
          label: '按钮'
        }],
        ruleForm: {
          id: '',
          name: '',
          parentId: '',
          sort: '',
          path: '',
          permission: '',
          createdAt: '',
          icon: '',
          type: '',
          version: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入菜单名', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '请选择菜单类型', trigger: 'blur'},
          ]
        },
        disabled: true
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      },
    },
    methods: {
      showDeptTree () {
        MenuApi.menuTree().then(res => {
          this.deptTree = res.data.data
        }).catch(err => {
          console.log(err)
        })
      },
      selectDept (dept) {
        this.$refs.ruleForm.resetFields()
        this.type = ''
        this.disabled = true
        this.ruleForm.name = dept.name
        this.ruleForm.id = dept.id
        this.ruleForm.sort = dept.sort
        this.ruleForm.parentId = dept.parentId
        this.ruleForm.path = dept.path
        this.ruleForm.permission = dept.permission
        this.ruleForm.createdAt = dept.createdAt
        this.ruleForm.icon = dept.icon
        this.ruleForm.type = dept.type || 0

        this.ruleForm.version = dept.version
      },
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      addDept () {
        if(this.ruleForm.id === ''){
          this.ruleForm.id = -1
          // Msg.error("请选择上级菜单")
          // return
        }
        this.ruleForm.name = ''
        this.ruleForm.sort = ''
        this.ruleForm.parentId = this.ruleForm.id
        this.ruleForm.id = ''

        this.ruleForm.path = ''
        this.ruleForm.permission = ''
        this.ruleForm.createdAt = ''
        this.ruleForm.icon = ''
        this.ruleForm.type = ''

        // this.$refs.ruleForm.resetFields()
        this.disabled = false
        this.type = 'add'
      },
      editDept () {
        if(this.ruleForm.id === ''){
          Msg.error("请选择菜单")
          return
        }
        this.disabled = false
      },
      delDept () {
        if(this.ruleForm.id === ''){
          Msg.error("请选择菜单")
          return
        }
        this.$confirm('此操作将删除菜单, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: this.ruleForm.id
          }
          MenuApi.delMenu(params).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.showDeptTree()
          })
        })
      },
      submit () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            let params = {
              name: this.ruleForm.name,
              parentId: this.ruleForm.parentId,
              sort: this.ruleForm.sort,
              path: this.ruleForm.path,
              permission: this.ruleForm.permission,
              icon: this.ruleForm.icon,
              type: this.ruleForm.type
            }
            if (this.type === 'add'){
              MenuApi.addMenu(params).then(res=>{
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.showDeptTree()
              }).catch(err=>{
                console.log(err)
                this.loading = false
                if (err.response.status === 504) {
                  Msg.error('请求超时！')
                }
                if (err.response.status === 400) {
                  let { message } = err.response.data.message[0]
                  Msg.error(message)
                }
                if (err.response.status === 500) {
                  Msg.error(err.response.data.message)
                }
              })
            }else {
              params.id = this.ruleForm.id
              params.version = this.ruleForm.version
              console.log(params)
              MenuApi.editMenu(params).then(res=>{
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.showDeptTree()
              }).catch(err=>{
                console.log(err)
                this.loading = false
                if (err.response.status === 504) {
                  Msg.error('请求超时！')
                }
                if (err.response.status === 400) {
                  let { message } = err.response.data.message[0]
                  Msg.error(message)
                }
                if (err.response.status === 500) {
                  Msg.error(err.response.data.message)
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    padding: 30px;
  }
  .tree {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .dept-form {
      padding-top: 60px;
      padding-right: 100px;
    }
  }
  .dept-tree,.dept-form{
    width: 46%;
  }
</style>
