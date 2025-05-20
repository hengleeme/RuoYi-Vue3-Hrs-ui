<template>
  <div>
    <el-button type="primary" @click="openAddDialog">新增合同</el-button>
    <el-table :data="contractList" style="width: 100%">
      <el-table-column prop="contractNo" label="合同编号"/>
      <el-table-column prop="personnelName" label="员工"/>
      <el-table-column prop="contractType" label="合同类型"/>
      <el-table-column prop="startDate" label="开始日期"/>
      <el-table-column prop="endDate" label="结束日期"/>
      <el-table-column prop="status" label="状态"/>
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
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="form.contractNo"/>
        </el-form-item>
        <el-form-item label="员工ID" prop="personnelId">
          <el-input v-model="form.personnelId"/>
        </el-form-item>
        <el-form-item label="合同类型" prop="contractType">
          <el-input v-model="form.contractType"/>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"/>
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
import { listContract, addContract, updateContract, deleteContract } from '@/api/hrs/contract'
const contractList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增合同')
const form = ref({ contractNo: '', personnelId: '', contractType: '', startDate: '', endDate: '', status: '', remark: '' })
const rules = { contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }], personnelId: [{ required: true, message: '请输入员工ID', trigger: 'blur' }] }
const formRef = ref(null)
let editId = null

async function fetchList() {
  const res = await listContract({ pageNum: pageNum.value, pageSize: pageSize.value })
  contractList.value = res.data
  total.value = res.total
}
function openAddDialog() {
  dialogTitle.value='新增合同'; form.value={ contractNo: '', personnelId: '', contractType: '', startDate: '', endDate: '', status: '', remark: '' }; editId = null; dialogVisible.value=true
}
function openEditDialog(row) {
  dialogTitle.value='编辑合同'; form.value={ ...row }; editId = row.id; dialogVisible.value=true
}
function submitForm() {
  formRef.value.validate(async valid => {
    if (valid) {
      if (editId) await updateContract(editId, form.value)
      else await addContract(form.value)
      dialogVisible.value = false
      fetchList()
    }
  })
}
async function remove(id) {
  await deleteContract(id)
  fetchList()
}
onMounted(() => { fetchList() })
</script> 