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
      <el-form-item label="汇总年份" prop="summaryYear">
        <el-date-picker
          v-model="queryParams.summaryYear"
          type="year"
          placeholder="选择年份"
          value-format="yyyy"
          clearable
        />
      </el-form-item>
      <el-form-item label="汇总月份" prop="summaryMonth">
        <el-select v-model="queryParams.summaryMonth" placeholder="请选择月份" clearable>
          <el-option
            v-for="dict in dict.type.hrs_month"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_summary_status"
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
          v-hasPermi="['hrs:attendance:summary:add']"
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
          v-hasPermi="['hrs:attendance:summary:edit']"
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
          v-hasPermi="['hrs:attendance:summary:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:attendance:summary:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          :disabled="single"
          @click="handleSubmit"
          v-hasPermi="['hrs:attendance:summary:submit']"
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
          v-hasPermi="['hrs:attendance:summary:approve']"
        >审批</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="summaryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="汇总年份" align="center" prop="summaryYear" />
      <el-table-column label="汇总月份" align="center" prop="summaryMonth">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_month" :value="scope.row.summaryMonth"/>
        </template>
      </el-table-column>
      <el-table-column label="应出勤天数" align="center" prop="shouldWorkDays" />
      <el-table-column label="实际出勤天数" align="center" prop="actualWorkDays" />
      <el-table-column label="病假天数" align="center" prop="sickLeaveDays" />
      <el-table-column label="事假天数" align="center" prop="personalLeaveDays" />
      <el-table-column label="婚假天数" align="center" prop="marriageLeaveDays" />
      <el-table-column label="产假天数" align="center" prop="maternityLeaveDays" />
      <el-table-column label="丧假天数" align="center" prop="bereavementLeaveDays" />
      <el-table-column label="年假天数" align="center" prop="annualLeaveDays" />
      <el-table-column label="调休天数" align="center" prop="compensatoryLeaveDays" />
      <el-table-column label="出差天数" align="center" prop="businessTripDays" />
      <el-table-column label="迟到次数" align="center" prop="lateTimes" />
      <el-table-column label="早退次数" align="center" prop="earlyLeaveTimes" />
      <el-table-column label="旷工次数" align="center" prop="absentTimes" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_summary_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center" prop="submitter" />
      <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.submitTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="审批时间" align="center" prop="approveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:attendance:summary:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:attendance:summary:remove']"
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

    <!-- 添加或修改考勤汇总对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择员工" @change="handleEmployeeChange">
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇总年份" prop="summaryYear">
          <el-date-picker
            v-model="form.summaryYear"
            type="year"
            placeholder="选择年份"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item label="汇总月份" prop="summaryMonth">
          <el-select v-model="form.summaryMonth" placeholder="请选择月份">
            <el-option
              v-for="dict in dict.type.hrs_month"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应出勤天数" prop="shouldWorkDays">
          <el-input-number v-model="form.shouldWorkDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="实际出勤天数" prop="actualWorkDays">
          <el-input-number v-model="form.actualWorkDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="病假天数" prop="sickLeaveDays">
          <el-input-number v-model="form.sickLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="事假天数" prop="personalLeaveDays">
          <el-input-number v-model="form.personalLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="婚假天数" prop="marriageLeaveDays">
          <el-input-number v-model="form.marriageLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="产假天数" prop="maternityLeaveDays">
          <el-input-number v-model="form.maternityLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="丧假天数" prop="bereavementLeaveDays">
          <el-input-number v-model="form.bereavementLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="年假天数" prop="annualLeaveDays">
          <el-input-number v-model="form.annualLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="调休天数" prop="compensatoryLeaveDays">
          <el-input-number v-model="form.compensatoryLeaveDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="出差天数" prop="businessTripDays">
          <el-input-number v-model="form.businessTripDays" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="迟到次数" prop="lateTimes">
          <el-input-number v-model="form.lateTimes" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="早退次数" prop="earlyLeaveTimes">
          <el-input-number v-model="form.earlyLeaveTimes" :min="0" :max="31" />
        </el-form-item>
        <el-form-item label="旷工次数" prop="absentTimes">
          <el-input-number v-model="form.absentTimes" :min="0" :max="31" />
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

    <!-- 审批对话框 -->
    <el-dialog title="审批" :visible.sync="approveOpen" width="500px" append-to-body>
      <el-form ref="approveForm" :model="approveForm" :rules="approveRules" label-width="80px">
        <el-form-item label="审批结果" prop="status">
          <el-radio-group v-model="approveForm.status">
            <el-radio
              v-for="dict in dict.type.hrs_summary_status"
              :key="dict.value"
              :label="dict.value"
              v-if="dict.value === '2' || dict.value === '3'"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见" prop="approveRemark">
          <el-input v-model="approveForm.approveRemark" type="textarea" placeholder="请输入审批意见" />
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
import { listSummary, getSummary, delSummary, addSummary, updateSummary, exportSummary, submitSummary, approveSummary } from "@/api/hrs/attendance/summary";
import { listDept } from "@/api/system/dept";

export default {
  name: "Summary",
  dicts: ['hrs_month', 'hrs_summary_status'],
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
      // 考勤汇总表格数据
      summaryList: [],
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
        summaryYear: null,
        summaryMonth: null,
        status: null
      },
      // 表单参数
      form: {},
      // 审批表单参数
      approveForm: {
        summaryId: null,
        status: "2",
        approveRemark: null
      },
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工不能为空", trigger: "change" }
        ],
        summaryYear: [
          { required: true, message: "汇总年份不能为空", trigger: "change" }
        ],
        summaryMonth: [
          { required: true, message: "汇总月份不能为空", trigger: "change" }
        ]
      },
      // 审批表单校验
      approveRules: {
        status: [
          { required: true, message: "审批结果不能为空", trigger: "change" }
        ],
        approveRemark: [
          { required: true, message: "审批意见不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDeptList();
  },
  methods: {
    /** 查询考勤汇总列表 */
    getList() {
      this.loading = true;
      listSummary(this.queryParams).then(response => {
        this.summaryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门列表 */
    getDeptList() {
      listDept().then(response => {
        this.deptOptions = response.data;
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
        summaryId: null,
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        summaryYear: null,
        summaryMonth: null,
        shouldWorkDays: 0,
        actualWorkDays: 0,
        sickLeaveDays: 0,
        personalLeaveDays: 0,
        marriageLeaveDays: 0,
        maternityLeaveDays: 0,
        bereavementLeaveDays: 0,
        annualLeaveDays: 0,
        compensatoryLeaveDays: 0,
        businessTripDays: 0,
        lateTimes: 0,
        earlyLeaveTimes: 0,
        absentTimes: 0,
        status: "0",
        remark: null
      };
      this.resetForm("form");
    },
    // 审批表单重置
    resetApprove() {
      this.approveForm = {
        summaryId: null,
        status: "2",
        approveRemark: null
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
      this.ids = selection.map(item => item.summaryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考勤汇总";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const summaryId = row.summaryId || this.ids
      getSummary(summaryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤汇总";
      });
    },
    /** 提交按钮操作 */
    handleSubmit(row) {
      const summaryId = row.summaryId || this.ids[0];
      this.$modal.confirm('是否确认提交考勤汇总编号为"' + summaryId + '"的数据项？').then(function() {
        return submitSummary(summaryId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("提交成功");
      }).catch(() => {});
    },
    /** 审批按钮操作 */
    handleApprove(row) {
      this.resetApprove();
      const summaryId = row.summaryId || this.ids[0];
      this.approveForm.summaryId = summaryId;
      this.approveOpen = true;
    },
    /** 提交审批 */
    submitApprove() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          approveSummary(this.approveForm).then(response => {
            this.$modal.msgSuccess("审批成功");
            this.approveOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const summaryIds = row.summaryId || this.ids;
      this.$modal.confirm('是否确认删除考勤汇总编号为"' + summaryIds + '"的数据项？').then(function() {
        return delSummary(summaryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/attendance/summary/export', {
        ...this.queryParams
      }, `考勤汇总_${new Date().getTime()}.xlsx`)
    },
    /** 员工选择框变更事件 */
    handleEmployeeChange(value) {
      const dept = this.deptOptions.find(item => item.deptId === value);
      if (dept) {
        this.form.deptId = dept.deptId;
        this.form.deptName = dept.deptName;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.summaryId != null) {
            updateSummary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSummary(this.form).then(response => {
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