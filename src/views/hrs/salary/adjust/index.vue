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
      <el-form-item label="调整类型" prop="adjustType">
        <el-select v-model="queryParams.adjustType" placeholder="请选择调整类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_salary_adjust_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="调整日期" prop="adjustDate">
        <el-date-picker clearable
          v-model="queryParams.adjustDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择调整日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_salary_adjust_status"
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
          v-hasPermi="['hrs:salary:adjust:add']"
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
          v-hasPermi="['hrs:salary:adjust:edit']"
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
          v-hasPermi="['hrs:salary:adjust:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:salary:adjust:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['hrs:salary:adjust:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="single"
          @click="handleSubmit"
          v-hasPermi="['hrs:salary:adjust:submit']"
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
          v-hasPermi="['hrs:salary:adjust:approve']"
        >审批</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="adjustList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="调整编号" align="center" prop="adjustId" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="调整类型" align="center" prop="adjustType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_salary_adjust_type" :value="scope.row.adjustType"/>
        </template>
      </el-table-column>
      <el-table-column label="调整日期" align="center" prop="adjustDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.adjustDate, '{y}-{m}-{d}') }}</span>
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
      <el-table-column label="其他扣除" align="center" prop="otherDeduction" />
      <el-table-column label="实发工资" align="center" prop="actualSalary" />
      <el-table-column label="调整原因" align="center" prop="adjustReason" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_salary_adjust_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:salary:adjust:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:salary:adjust:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handleSubmit(scope.row)"
            v-hasPermi="['hrs:salary:adjust:submit']"
            v-if="scope.row.status === '0'"
          >提交</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleApprove(scope.row)"
            v-hasPermi="['hrs:salary:adjust:approve']"
            v-if="scope.row.status === '1'"
          >审批</el-button>
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

    <!-- 添加或修改定薪调薪对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择员工">
            <el-option
              v-for="item in employeeOptions"
              :key="item.employeeId"
              :label="item.employeeName"
              :value="item.employeeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整类型" prop="adjustType">
          <el-select v-model="form.adjustType" placeholder="请选择调整类型">
            <el-option
              v-for="dict in dict.type.hrs_salary_adjust_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整日期" prop="adjustDate">
          <el-date-picker clearable
            v-model="form.adjustDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择调整日期">
          </el-date-picker>
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
        <el-form-item label="其他扣除" prop="otherDeduction">
          <el-input-number v-model="form.otherDeduction" :precision="2" :step="0.01" :min="0" />
        </el-form-item>
        <el-form-item label="调整原因" prop="adjustReason">
          <el-input v-model="form.adjustReason" type="textarea" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="approveOpen" width="500px" append-to-body>
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
import { listAdjust, getAdjust, delAdjust, addAdjust, updateAdjust, submitAdjust, approveAdjust } from "@/api/hrs/salary/adjust";
import { listEmployee } from "@/api/hrs/employee/info";

export default {
  name: "Adjust",
  dicts: ['hrs_salary_adjust_type', 'hrs_salary_adjust_status'],
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
      // 定薪调薪表格数据
      adjustList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示审批弹出层
      approveOpen: false,
      // 员工选项
      employeeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: null,
        deptName: null,
        adjustType: null,
        adjustDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 审批表单参数
      approveForm: {
        adjustId: null,
        remark: null
      },
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工不能为空", trigger: "change" }
        ],
        adjustType: [
          { required: true, message: "调整类型不能为空", trigger: "change" }
        ],
        adjustDate: [
          { required: true, message: "调整日期不能为空", trigger: "change" }
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
    this.getEmployeeOptions();
  },
  methods: {
    /** 查询定薪调薪列表 */
    getList() {
      this.loading = true;
      listAdjust(this.queryParams).then(response => {
        this.adjustList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取员工选项 */
    getEmployeeOptions() {
      listEmployee().then(response => {
        this.employeeOptions = response.rows;
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
        adjustId: null,
        employeeId: null,
        adjustType: null,
        adjustDate: null,
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
        adjustReason: null,
        status: "0"
      };
      this.resetForm("form");
    },
    // 审批表单重置
    resetApprove() {
      this.approveForm = {
        adjustId: null,
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
      this.ids = selection.map(item => item.adjustId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加定薪调薪";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const adjustId = row.adjustId || this.ids
      getAdjust(adjustId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改定薪调薪";
      });
    },
    /** 提交按钮操作 */
    handleSubmit(row) {
      const adjustId = row.adjustId || this.ids;
      this.$modal.confirm('是否确认提交定薪调薪编号为"' + adjustId + '"的数据项？').then(function() {
        return submitAdjust(adjustId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("提交成功");
      }).catch(() => {});
    },
    /** 审批按钮操作 */
    handleApprove(row) {
      this.resetApprove();
      this.approveForm.adjustId = row.adjustId || this.ids;
      this.approveOpen = true;
    },
    /** 提交审批 */
    submitApprove() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          approveAdjust(this.approveForm).then(response => {
            this.$modal.msgSuccess("审批成功");
            this.approveOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const adjustIds = row.adjustId || this.ids;
      this.$modal.confirm('是否确认删除定薪调薪编号为"' + adjustIds + '"的数据项？').then(function() {
        return delAdjust(adjustIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/salary/adjust/export', {
        ...this.queryParams
      }, `定薪调薪_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "定薪调薪数据导入";
      this.upload.open = true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.adjustId != null) {
            updateAdjust(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAdjust(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
  }
};
</script> 