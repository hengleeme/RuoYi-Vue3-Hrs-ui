<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="姓名" prop="employeeName">
        <el-input v-model="queryParams.employeeName" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="部门" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门" clearable />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input v-model="queryParams.position" placeholder="请输入职位" clearable />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
          <el-option label="男" value="0" />
          <el-option label="女" value="1" />
          <el-option label="未知" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div class="mb8">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" v-hasPermi="['hrs:personnel:add']">新增</el-button>
      <el-button type="success" icon="el-icon-edit" :disabled="single" @click="handleUpdate" v-hasPermi="['hrs:personnel:edit']">修改</el-button>
      <el-button type="danger" icon="el-icon-delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['hrs:personnel:remove']">删除</el-button>
      <el-button type="warning" icon="el-icon-download" @click="handleExport" v-hasPermi="['hrs:personnel:export']">导出</el-button>
    </div>

    <!-- 人事信息表格 -->
    <el-table v-loading="loading" :data="personnelList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="personnelId" width="80" />
      <el-table-column label="姓名" align="center" prop="employeeName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="职位" align="center" prop="position" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="genderOptions" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hrs:personnel:edit']">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['hrs:personnel:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="employeeName">
          <el-input v-model="form.employeeName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
            <el-option label="未知" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="人事详情" :visible.sync="detailOpen" width="600px" append-to-body>
      <el-form :model="detail" label-width="100px">
        <el-form-item label="姓名">{{ detail.employeeName }}</el-form-item>
        <el-form-item label="部门">{{ detail.deptName }}</el-form-item>
        <el-form-item label="职位">{{ detail.position }}</el-form-item>
        <el-form-item label="性别">
          <dict-tag :options="genderOptions" :value="detail.gender" />
        </el-form-item>
        <el-form-item label="手机">{{ detail.phone }}</el-form-item>
        <el-form-item label="邮箱">{{ detail.email }}</el-form-item>
        <el-form-item label="状态">
          <dict-tag :options="statusOptions" :value="detail.status" />
        </el-form-item>
        <el-form-item label="备注">{{ detail.remark }}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPersonnel, getPersonnel, delPersonnel, addPersonnel, updatePersonnel, exportPersonnel } from '@/api/hrs/personnel'

export default {
  name: 'Personnel',
  data() {
    return {
      // 加载状态
      loading: false,
      // 总条数
      total: 0,
      // 人事数据列表
      personnelList: [],
      // 选中数组
      ids: [],
      single: true,
      multiple: true,
      // 弹窗开关
      open: false,
      // 详情弹窗
      detailOpen: false,
      // 弹窗标题
      title: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: undefined,
        deptName: undefined,
        position: undefined,
        gender: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 详情数据
      detail: {},
      // 表单校验
      rules: {
        employeeName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        deptName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        position: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 字典数据
      genderOptions: [
        { label: '男', value: '0' },
        { label: '女', value: '1' },
        { label: '未知', value: '2' }
      ],
      statusOptions: [
        { label: '正常', value: '0' },
        { label: '停用', value: '1' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询人事列表 */
    getList() {
      this.loading = true
      listPersonnel(this.queryParams).then(res => {
        this.personnelList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.handleQuery()
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.personnelId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = '新增人事'
      this.form = { status: '0', gender: '0' }
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const id = row ? row.personnelId : this.ids[0]
      getPersonnel(id).then(res => {
        this.form = Object.assign({}, res.data)
        this.open = true
        this.title = '编辑人事'
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      getPersonnel(row.personnelId).then(res => {
        this.detail = res.data
        this.detailOpen = true
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const personnelIds = row ? [row.personnelId] : this.ids
      this.$confirm('是否确认删除选中人事数据？', '提示', {
        type: 'warning'
      }).then(() => {
        delPersonnel(personnelIds).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      exportPersonnel(this.queryParams)
    },
    /** 取消弹窗 */
    cancel() {
      this.open = false
      this.$refs.form && this.$refs.form.resetFields()
    },
    /** 提交表单 */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (this.form.personnelId) {
          updatePersonnel(this.form).then(() => {
            this.$message.success('修改成功')
            this.open = false
            this.getList()
          })
        } else {
          addPersonnel(this.form).then(() => {
            this.$message.success('新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.mb8 { margin-bottom: 8px; }
</style> 