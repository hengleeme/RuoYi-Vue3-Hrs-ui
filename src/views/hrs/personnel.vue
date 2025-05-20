<template>
  <div>
    <el-button type="primary" @click="openAddDialog">新增人员</el-button>
    <el-table :data="personnelList" style="width: 100%">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="gender" label="性别"/>
      <el-table-column prop="position" label="职位"/>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="orgName" label="组织"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      @current-change="fetchList"
    />
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender">
            <el-option label="男" value="男"/>
            <el-option label="女" value="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"/>
        </el-form-item>
        <el-form-item label="组织" prop="orgId">
          <el-tree-select
            v-model="form.orgId"
            :data="orgOptions"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择组织"
            check-strictly
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { listPersonnel, addPersonnel, updatePersonnel, deletePersonnel } from '@/api/hrs/personnel'
import { orgDropdown } from '@/api/hrs/organization'

const personnelList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增人员')
const form = ref({ name: '', gender: '', position: '', phone: '', email: '', orgId: '' })
const orgOptions = ref([])
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  orgId: [{ required: true, message: '请选择组织', trigger: 'change' }]
}
const formRef = ref(null)
let editId = null

async function fetchList() {
  const res = await listPersonnel({ pageNum: pageNum.value, pageSize: pageSize.value })
  personnelList.value = res.data
  total.value = res.total
}
function openAddDialog() {
  dialogTitle.value='新增人员'; form.value={ name: '', gender: '', position: '', phone: '', email: '', orgId: '' }; editId = null; dialogVisible.value=true
}
function openEditDialog(row) {
  dialogTitle.value='编辑人员'; form.value={ ...row }; editId = row.id; dialogVisible.value=true
}
function submitForm() {
  formRef.value.validate(async valid => {
    if (valid) {
      if (editId) await updatePersonnel(editId, form.value)
      else await addPersonnel(form.value)
      dialogVisible.value = false
      fetchList()
    }
  })
}
async function remove(id) {
  await deletePersonnel(id)
  fetchList()
}
onMounted(async () => {
  orgOptions.value = await orgDropdown()
  fetchList()
})
</script> 