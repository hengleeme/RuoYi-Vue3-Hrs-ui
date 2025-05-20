<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="职位名称" prop="positionName">
        <el-input
          v-model="queryParams.positionName"
          placeholder="请输入职位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :normalizer="normalizer"
          placeholder="请选择部门"
        />
      </el-form-item>
      <el-form-item label="工作地点" prop="workLocation">
        <el-input
          v-model="queryParams.workLocation"
          placeholder="请输入工作地点"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学历要求" prop="education">
        <el-select v-model="queryParams.education" placeholder="请选择学历要求" clearable>
          <el-option
            v-for="dict in dict.type.hrs_education"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="招聘状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择招聘状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_recruitment_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hrs:recruitment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hrs:recruitment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hrs:recruitment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:recruitment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recruitmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="招聘ID" align="center" prop="recruitmentId" />
      <el-table-column label="职位名称" align="center" prop="positionName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="招聘人数" align="center" prop="recruitNumber" />
      <el-table-column label="工作地点" align="center" prop="workLocation" />
      <el-table-column label="薪资范围" align="center" prop="salaryRange" />
      <el-table-column label="学历要求" align="center" prop="education">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_education" :value="scope.row.education"/>
        </template>
      </el-table-column>
      <el-table-column label="工作经验" align="center" prop="experience" />
      <el-table-column label="招聘状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_recruitment_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:recruitment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:recruitment:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改招聘信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位名称" prop="positionName">
              <el-input v-model="form.positionName" placeholder="请输入职位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="请选择部门"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="招聘人数" prop="recruitNumber">
              <el-input-number v-model="form.recruitNumber" :min="1" placeholder="请输入招聘人数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地点" prop="workLocation">
              <el-input v-model="form.workLocation" placeholder="请输入工作地点" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="薪资范围" prop="salaryRange">
              <el-input v-model="form.salaryRange" placeholder="请输入薪资范围" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历要求" prop="education">
              <el-select v-model="form.education" placeholder="请选择学历要求">
                <el-option
                  v-for="dict in dict.type.hrs_education"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作经验" prop="experience">
              <el-input v-model="form.experience" placeholder="请输入工作经验" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="招聘状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择招聘状态">
                <el-option
                  v-for="dict in dict.type.hrs_recruitment_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker clearable
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker clearable
                v-model="form.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="职位描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入职位描述" />
        </el-form-item>
        <el-form-item label="任职要求" prop="requirement">
          <el-input v-model="form.requirement" type="textarea" placeholder="请输入任职要求" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecruitment, getRecruitment, delRecruitment, addRecruitment, updateRecruitment } from "@/api/hrs/recruitment";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Recruitment",
  dicts: ['hrs_education', 'hrs_recruitment_status'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 招聘信息表格数据
      recruitmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门树选项
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        positionName: null,
        deptId: null,
        workLocation: null,
        education: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        positionName: [
          { required: true, message: "职位名称不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "blur" }
        ],
        recruitNumber: [
          { required: true, message: "招聘人数不能为空", trigger: "blur" }
        ],
        workLocation: [
          { required: true, message: "工作地点不能为空", trigger: "blur" }
        ],
        salaryRange: [
          { required: true, message: "薪资范围不能为空", trigger: "blur" }
        ],
        education: [
          { required: true, message: "学历要求不能为空", trigger: "change" }
        ],
        experience: [
          { required: true, message: "工作经验不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "招聘状态不能为空", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDeptTreeselect();
  },
  methods: {
    /** 查询招聘信息列表 */
    getList() {
      this.loading = true;
      listRecruitment(this.queryParams).then(response => {
        this.recruitmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },
    /** 查询部门下拉树结构 */
    getDeptTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        recruitmentId: null,
        positionName: null,
        deptId: null,
        deptName: null,
        recruitNumber: null,
        workLocation: null,
        salaryRange: null,
        education: null,
        experience: null,
        description: null,
        requirement: null,
        status: "0",
        startTime: null,
        endTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recruitmentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加招聘信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recruitmentId = row.recruitmentId || this.ids
      getRecruitment(recruitmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改招聘信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recruitmentId != null) {
            updateRecruitment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecruitment(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recruitmentIds = row.recruitmentId || this.ids;
      this.$modal.confirm('是否确认删除招聘信息编号为"' + recruitmentIds + '"的数据项？').then(function() {
        return delRecruitment(recruitmentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/recruitment/export', {
        ...this.queryParams
      }, `recruitment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 