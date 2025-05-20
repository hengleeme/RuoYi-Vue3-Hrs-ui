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
      <el-form-item label="考勤日期" prop="attendanceDate">
        <el-date-picker
          v-model="queryParams.attendanceDate"
          type="date"
          placeholder="选择考勤日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="考勤状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择考勤状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_attendance_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上报人" prop="reporter">
        <el-input
          v-model="queryParams.reporter"
          placeholder="请输入上报人"
          clearable
          @keyup.enter.native="handleQuery"
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
          v-hasPermi="['hrs:attendance:report:add']"
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
          v-hasPermi="['hrs:attendance:report:edit']"
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
          v-hasPermi="['hrs:attendance:report:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:attendance:report:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="上报ID" align="center" prop="reportId" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="考勤日期" align="center" prop="attendanceDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.attendanceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签到时间" align="center" prop="checkInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkInTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="签退时间" align="center" prop="checkOutTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkOutTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考勤状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_attendance_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="工作时长" align="center" prop="workHours" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="上报人" align="center" prop="reporter" />
      <el-table-column label="上报时间" align="center" prop="reportTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reportTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:attendance:report:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:attendance:report:remove']"
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

    <!-- 添加或修改考勤结果上报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择员工" @change="handleEmployeeChange">
            <el-option
              v-for="employee in employeeOptions"
              :key="employee.employeeId"
              :label="employee.employeeName"
              :value="employee.employeeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考勤日期" prop="attendanceDate">
          <el-date-picker
            v-model="form.attendanceDate"
            type="date"
            placeholder="选择考勤日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkInTime">
          <el-date-picker
            v-model="form.checkInTime"
            type="datetime"
            placeholder="选择签到时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="签退时间" prop="checkOutTime">
          <el-date-picker
            v-model="form.checkOutTime"
            type="datetime"
            placeholder="选择签退时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="考勤状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择考勤状态">
            <el-option
              v-for="dict in dict.type.hrs_attendance_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工作时长" prop="workHours">
          <el-input-number v-model="form.workHours" :precision="2" :step="0.5" :min="0" :max="24" />
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
  </div>
</template>

<script>
import { listReport, getReport, delReport, addReport, updateReport } from "@/api/hrs/attendance/report";
import { listEmployee } from "@/api/hrs/employee/employee";

export default {
  name: "Report",
  dicts: ['hrs_attendance_status'],
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
      // 考勤结果上报表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 员工选项
      employeeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: null,
        deptName: null,
        attendanceDate: null,
        status: null,
        reporter: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工不能为空", trigger: "change" }
        ],
        attendanceDate: [
          { required: true, message: "考勤日期不能为空", trigger: "change" }
        ],
        checkInTime: [
          { required: true, message: "签到时间不能为空", trigger: "change" }
        ],
        checkOutTime: [
          { required: true, message: "签退时间不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "考勤状态不能为空", trigger: "change" }
        ],
        workHours: [
          { required: true, message: "工作时长不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
  },
  methods: {
    /** 查询考勤结果上报列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.rows;
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
    // 表单重置
    reset() {
      this.form = {
        reportId: null,
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        attendanceDate: null,
        checkInTime: null,
        checkOutTime: null,
        status: null,
        workHours: null,
        remark: null,
        reporter: null,
        reportTime: null
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
      this.ids = selection.map(item => item.reportId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加考勤结果上报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reportId = row.reportId || this.ids
      getReport(reportId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤结果上报";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reportId != null) {
            updateReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReport(this.form).then(response => {
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
      const reportIds = row.reportId || this.ids;
      this.$modal.confirm('是否确认删除考勤结果上报编号为"' + reportIds + '"的数据项？').then(function() {
        return delReport(reportIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/attendance/report/export', {
        ...this.queryParams
      }, `考勤结果上报_${new Date().getTime()}.xlsx`)
    },
    /** 员工选择框变化事件 */
    handleEmployeeChange(employeeId) {
      const employee = this.employeeOptions.find(item => item.employeeId === employeeId);
      if (employee) {
        this.form.employeeName = employee.employeeName;
        this.form.deptId = employee.deptId;
        this.form.deptName = employee.deptName;
      }
    }
  }
};
</script> 