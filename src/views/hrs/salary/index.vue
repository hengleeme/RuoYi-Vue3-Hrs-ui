<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工姓名" prop="empName">
        <el-input
          v-model="queryParams.empName"
          placeholder="请输入员工姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="empNo">
        <el-input
          v-model="queryParams.empNo"
          placeholder="请输入工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :normalizer="normalizer"
          placeholder="请选择所属部门"
        />
      </el-form-item>
      <el-form-item label="薪资月份" prop="salaryMonth">
        <el-date-picker
          v-model="queryParams.salaryMonth"
          type="month"
          placeholder="选择薪资月份"
          value-format="yyyy-MM"
        />
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
          v-hasPermi="['hrs:salary:add']"
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
          v-hasPermi="['hrs:salary:edit']"
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
          v-hasPermi="['hrs:salary:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:salary:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="salaryList"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工姓名" align="center" prop="empName" />
      <el-table-column label="工号" align="center" prop="empNo" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="薪资月份" align="center" prop="salaryMonth" width="100" />
      <el-table-column label="基本工资" align="center" prop="baseSalary" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.baseSalary.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绩效工资" align="center" prop="performanceSalary" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.performanceSalary.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="加班工资" align="center" prop="overtimeSalary" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.overtimeSalary.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补贴" align="center" prop="allowance" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.allowance.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣款" align="center" prop="deduction" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.deduction.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实发工资" align="center" prop="actualSalary" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.actualSalary.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_salary_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:salary:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:salary:remove']"
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

    <!-- 添加或修改薪资对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工" prop="empId">
              <el-select v-model="form.empId" placeholder="请选择员工" @change="handleEmployeeChange">
                <el-option
                  v-for="emp in employeeOptions"
                  :key="emp.empId"
                  :label="emp.empName"
                  :value="emp.empId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资月份" prop="salaryMonth">
              <el-date-picker
                v-model="form.salaryMonth"
                type="month"
                placeholder="选择薪资月份"
                value-format="yyyy-MM"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基本工资" prop="baseSalary">
              <el-input-number v-model="form.baseSalary" :precision="2" :step="100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绩效工资" prop="performanceSalary">
              <el-input-number v-model="form.performanceSalary" :precision="2" :step="100" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="加班工资" prop="overtimeSalary">
              <el-input-number v-model="form.overtimeSalary" :precision="2" :step="100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补贴" prop="allowance">
              <el-input-number v-model="form.allowance" :precision="2" :step="100" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="扣款" prop="deduction">
              <el-input-number v-model="form.deduction" :precision="2" :step="100" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实发工资" prop="actualSalary">
              <el-input-number v-model="form.actualSalary" :precision="2" :step="100" :min="0" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option
                  v-for="dict in dict.type.hrs_salary_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listSalary, getSalary, delSalary, addSalary, updateSalary } from "@/api/hrs/salary";
import { listEmployee } from "@/api/hrs/employee";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Salary",
  dicts: ['hrs_salary_status'],
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
      // 薪资表格数据
      salaryList: [],
      // 员工选项
      employeeOptions: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empName: undefined,
        empNo: undefined,
        deptId: undefined,
        salaryMonth: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        empId: [
          { required: true, message: "员工不能为空", trigger: "change" }
        ],
        salaryMonth: [
          { required: true, message: "薪资月份不能为空", trigger: "blur" }
        ],
        baseSalary: [
          { required: true, message: "基本工资不能为空", trigger: "blur" }
        ],
        performanceSalary: [
          { required: true, message: "绩效工资不能为空", trigger: "blur" }
        ],
        overtimeSalary: [
          { required: true, message: "加班工资不能为空", trigger: "blur" }
        ],
        allowance: [
          { required: true, message: "补贴不能为空", trigger: "blur" }
        ],
        deduction: [
          { required: true, message: "扣款不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
    this.getDeptTreeselect();
  },
  methods: {
    /** 查询薪资列表 */
    getList() {
      this.loading = true;
      listSalary(this.queryParams).then(response => {
        this.salaryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询员工选项 */
    getEmployeeOptions() {
      listEmployee().then(response => {
        this.employeeOptions = response.rows;
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
    /** 员工选择框变化事件 */
    handleEmployeeChange(empId) {
      const employee = this.employeeOptions.find(emp => emp.empId === empId);
      if (employee) {
        this.form.empName = employee.empName;
        this.form.empNo = employee.empNo;
        this.form.deptId = employee.deptId;
        this.form.deptName = employee.deptName;
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        salaryId: undefined,
        empId: undefined,
        empName: undefined,
        empNo: undefined,
        deptId: undefined,
        deptName: undefined,
        salaryMonth: undefined,
        baseSalary: 0,
        performanceSalary: 0,
        overtimeSalary: 0,
        allowance: 0,
        deduction: 0,
        actualSalary: 0,
        status: "0",
        remark: undefined
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
      this.ids = selection.map(item => item.salaryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加薪资记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const salaryId = row.salaryId || this.ids[0]
      getSalary(salaryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改薪资记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 计算实发工资
          this.form.actualSalary = this.form.baseSalary + 
            this.form.performanceSalary + 
            this.form.overtimeSalary + 
            this.form.allowance - 
            this.form.deduction;

          if (this.form.salaryId != undefined) {
            updateSalary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSalary(this.form).then(response => {
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
      const salaryIds = row.salaryId || this.ids;
      this.$modal.confirm('是否确认删除薪资记录编号为"' + salaryIds + '"的数据项？').then(function() {
        return delSalary(salaryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/salary/export', {
        ...this.queryParams
      }, `salary_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 