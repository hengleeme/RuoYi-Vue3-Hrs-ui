<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-tree
          :data="orgTree"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          @node-click="handleNodeClick"
          default-expand-all
        />
      </el-col>
      <el-col :span="18">
        <el-button type="primary" @click="openAddDialog">新增组织</el-button>
        <el-table :data="orgList" style="width: 100%">
          <el-table-column prop="name" label="组织名称"/>
          <el-table-column prop="leader" label="负责人"/>
          <el-table-column prop="remark" label="备注"/>
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
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader"/>
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
import { getOrgTree, listOrganization, addOrganization, updateOrganization, deleteOrganization } from '@/api/hrs/organization'
const orgTree = ref([])
const orgList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增组织')
const form = ref({ name: '', leader: '', remark: '' })
const rules = { name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }] }
const formRef = ref(null)
let editId = null

async function fetchTree() {
  orgTree.value = await getOrgTree()
}
async function fetchList() {
  const res = await listOrganization({ pageNum: pageNum.value, pageSize: pageSize.value })
  orgList.value = res.data
  total.value = res.total
}
function openAddDialog() {
  dialogTitle.value='新增组织'; form.value={ name: '', leader: '', remark: '' }; editId = null; dialogVisible.value=true
}
function openEditDialog(row) {
  dialogTitle.value='编辑组织'; form.value={ ...row }; editId = row.id; dialogVisible.value=true
}
function submitForm() {
  formRef.value.validate(async valid => {
    if (valid) {
      if (editId) await updateOrganization(editId, form.value)
      else await addOrganization(form.value)
      dialogVisible.value = false
      fetchList()
      fetchTree()
    }
  })
}
async function remove(id) {
  await deleteOrganization(id)
  fetchList()
  fetchTree()
}
function handleNodeClick(node) {
  // 可扩展：点击树节点筛选列表
}
onMounted(() => { fetchTree(); fetchList() })
</script> 