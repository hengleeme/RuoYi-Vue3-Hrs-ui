<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="请输入员工姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工资年份" prop="salaryYear">
        <el-date-picker
          v-model="queryParams.salaryYear"
          type="year"
          placeholder="选择工资年份"
          value-format="yyyy"
          clearable
        />
      </el-form-item>
      <el-form-item label="工资月份" prop="salaryMonth">
        <el-select v-model="queryParams.salaryMonth" placeholder="请选择工资月份" clearable>
          <el-option
            v-for="dict in dict.type.sys_month"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
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
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['hrs:salary:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="single"
          @click="handleSubmit"
          v-hasPermi="['hrs:salary:submit']"
        >提交</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-check"
          size="mini"
          :disabled="single"
          @click="handleApprove"
          v-hasPermi="['hrs:salary:approve']"
        >审批</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-money"
          size="mini"
          :disabled="single"
          @click="handlePay"
          v-hasPermi="['hrs:salary:pay']"
        >发放</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="salaryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="工资年份" align="center" prop="salaryYear" />
      <el-table-column label="工资月份" align="center" prop="salaryMonth">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_month" :value="scope.row.salaryMonth"/>
        </template>
      </el-table-column>
      <el-table-column label="基本工资" align="center" prop="basicSalary" />
      <el-table-column label="岗位工资" align="center" prop="positionSalary" />
      <el-table-column label="绩效工资" align="center" prop="performanceSalary" />
      <el-table-column label="加班工资" align="center" prop="overtimeSalary" />
      <el-table-column label="奖金" align="center" prop="bonus" />
      <el-table-column label="补贴" align="center" prop="subsidy" />
      <el-table-column label="社保" align="center" prop="socialSecurity" />
      <el-table-column label="公积金" align="center" prop="housingFund" />
      <el-table-column label="个税" align="center" prop="tax" />
      <el-table-column label="其他扣款" align="center" prop="otherDeduction" />
      <el-table-column label="实发工资" align="center" prop="actualSalary" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
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

    <!-- 添加或修改工资信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择员工">
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工资年份" prop="salaryYear">
          <el-date-picker
            v-model="form.salaryYear"
            type="year"
            placeholder="选择工资年份"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item label="工资月份" prop="salaryMonth">
          <el-select v-model="form.salaryMonth" placeholder="请选择工资月份">
            <el-option
              v-for="dict in dict.type.sys_month"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基本工资" prop="basicSalary">
          <el-input-number v-model="form.basicSalary" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="岗位工资" prop="positionSalary">
          <el-input-number v-model="form.positionSalary" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="绩效工资" prop="performanceSalary">
          <el-input-number v-model="form.performanceSalary" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="加班工资" prop="overtimeSalary">
          <el-input-number v-model="form.overtimeSalary" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <el-input-number v-model="form.bonus" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="补贴" prop="subsidy">
          <el-input-number v-model="form.subsidy" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="社保" prop="socialSecurity">
          <el-input-number v-model="form.socialSecurity" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="公积金" prop="housingFund">
          <el-input-number v-model="form.housingFund" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="个税" prop="tax">
          <el-input-number v-model="form.tax" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="其他扣款" prop="otherDeduction">
          <el-input-number v-model="form.otherDeduction" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审批工资信息对话框 -->
    <el-dialog title="审批工资信息" :visible.sync="approveOpen" width="500px" append-to-body>
      <el-form ref="approveForm" :model="approveForm" :rules="approveRules" label-width="80px">
        <el-form-item label="审批意见" prop="remark">
          <el-input v-model="approveForm.remark" type="textarea" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitApprove">确 定</el-button>
        <el-button @click="cancelApprove">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSalary, getSalary, delSalary, addSalary, updateSalary, submitSalary, approveSalary, paySalary } from "@/api/hrs/salary/info";

export default {
  name: "Salary",
  dicts: ['sys_normal_disable', 'sys_month'],
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
      // 工资信息表格数据
      salaryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示审批弹出层
      approveOpen: false,
      // 部门选项
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: null,
        deptName: null,
        salaryYear: null,
        salaryMonth: null,
        status: null
      },
      // 表单参数
      form: {},
      // 审批表单参数
      approveForm: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工不能为空", trigger: "blur" }
        ],
        salaryYear: [
          { required: true, message: "工资年份不能为空", trigger: "blur" }
        ],
        salaryMonth: [
          { required: true, message: "工资月份不能为空", trigger: "change" }
        ],
        basicSalary: [
          { required: true, message: "基本工资不能为空", trigger: "blur" }
        ]
      },
      // 审批表单校验
      approveRules: {
        remark: [
          { required: true, message: "审批意见不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工资信息列表 */
    getList() {
      this.loading = true;
      listSalary(this.queryParams).then(response => {
        this.salaryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消审批按钮
    cancelApprove() {
      this.approveOpen = false;
      this.resetApprove();
    },
    // 表单重置
    reset() {
      this.form = {
        salaryId: null,
        employeeId: null,
        salaryYear: null,
        salaryMonth: null,
        basicSalary: null,
        positionSalary: null,
        performanceSalary: null,
        overtimeSalary: null,
        bonus: null,
        subsidy: null,
        socialSecurity: null,
        housingFund: null,
        tax: null,
        otherDeduction: null,
        actualSalary: null,
        status: "0",
        remark: null
      };
      this.resetForm("form");
    },
    // 审批表单重置
    resetApprove() {
      this.approveForm = {
        salaryId: null,
        remark: null
      };
      this.resetForm("approveForm");
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
      this.title = "添加工资信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const salaryId = row.salaryId || this.ids
      getSalary(salaryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工资信息";
      });
    },
    /** 提交按钮操作 */
    handleSubmit(row) {
      const salaryId = row.salaryId || this.ids[0];
      this.$modal.confirm('是否确认提交工资信息编号为"' + salaryId + '"的数据项？').then(function() {
        return submitSalary(salaryId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("提交成功");
      }).catch(() => {});
    },
    /** 审批按钮操作 */
    handleApprove(row) {
      this.resetApprove();
      const salaryId = row.salaryId || this.ids[0];
      this.approveForm.salaryId = salaryId;
      this.approveOpen = true;
    },
    /** 发放按钮操作 */
    handlePay(row) {
      const salaryId = row.salaryId || this.ids[0];
      this.$modal.confirm('是否确认发放工资信息编号为"' + salaryId + '"的数据项？').then(function() {
        return paySalary(salaryId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("发放成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.salaryId != null) {
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
    /** 提交审批按钮 */
    submitApprove() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          approveSalary(this.approveForm).then(response => {
            this.$modal.msgSuccess("审批成功");
            this.approveOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const salaryIds = row.salaryId || this.ids;
      this.$modal.confirm('是否确认删除工资信息编号为"' + salaryIds + '"的数据项？').then(function() {
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
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "工资信息数据导入";
      this.upload.open = true;
    }
  }
};
</script> 