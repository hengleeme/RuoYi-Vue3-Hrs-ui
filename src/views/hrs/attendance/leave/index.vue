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
      <el-form-item label="请假类型" prop="leaveType">
        <el-select v-model="queryParams.leaveType" placeholder="请选择请假类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_leave_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审批状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_leave_status"
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
          v-hasPermi="['hrs:attendance:leave:add']"
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
          v-hasPermi="['hrs:attendance:leave:edit']"
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
          v-hasPermi="['hrs:attendance:leave:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:attendance:leave:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="请假ID" align="center" prop="leaveId" />
      <el-table-column label="员工姓名" align="center" prop="employeeName" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="请假类型" align="center" prop="leaveType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_leave_type" :value="scope.row.leaveType"/>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假时长" align="center" prop="leaveHours" />
      <el-table-column label="请假原因" align="center" prop="leaveReason" :show-overflow-tooltip="true" />
      <el-table-column label="审批状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_leave_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="approver" />
      <el-table-column label="审批时间" align="center" prop="approveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:attendance:leave:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:attendance:leave:remove']"
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

    <!-- 添加或修改请假对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="员工" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择员工" @change="handleEmployeeChange">
            <el-option
              v-for="emp in employeeOptions"
              :key="emp.employeeId"
              :label="emp.employeeName"
              :value="emp.employeeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请假类型" prop="leaveType">
          <el-select v-model="form.leaveType" placeholder="请选择请假类型">
            <el-option
              v-for="dict in dict.type.hrs_leave_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="calculateLeaveHours"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="calculateLeaveHours"
          />
        </el-form-item>
        <el-form-item label="请假时长" prop="leaveHours">
          <el-input-number v-model="form.leaveHours" :precision="1" :step="0.5" :min="0" disabled />
        </el-form-item>
        <el-form-item label="请假原因" prop="leaveReason">
          <el-input v-model="form.leaveReason" type="textarea" placeholder="请输入请假原因" />
        </el-form-item>
        <el-form-item label="审批状态" prop="status" v-if="form.leaveId">
          <el-select v-model="form.status" placeholder="请选择审批状态">
            <el-option
              v-for="dict in dict.type.hrs_leave_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见" prop="approveComment" v-if="form.leaveId">
          <el-input v-model="form.approveComment" type="textarea" placeholder="请输入审批意见" />
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
import { listLeave, getLeave, delLeave, addLeave, updateLeave } from "@/api/hrs/attendance/leave";
import { listEmployee } from "@/api/hrs/employee/employee";

export default {
  name: "Leave",
  dicts: ['hrs_leave_type', 'hrs_leave_status'],
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
      // 请假表格数据
      leaveList: [],
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
        leaveType: null,
        startTime: null,
        endTime: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "员工不能为空", trigger: "change" }
        ],
        leaveType: [
          { required: true, message: "请假类型不能为空", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "change" }
        ],
        leaveReason: [
          { required: true, message: "请假原因不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
  },
  methods: {
    /** 查询请假列表 */
    getList() {
      this.loading = true;
      listLeave(this.queryParams).then(response => {
        this.leaveList = response.rows;
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
        leaveId: null,
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        leaveType: null,
        startTime: null,
        endTime: null,
        leaveHours: 0,
        leaveReason: null,
        status: "0",
        approver: null,
        approveTime: null,
        approveComment: null
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
      this.ids = selection.map(item => item.leaveId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加请假";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const leaveId = row.leaveId || this.ids
      getLeave(leaveId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改请假";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.leaveId != null) {
            updateLeave(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeave(this.form).then(response => {
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
      const leaveIds = row.leaveId || this.ids;
      this.$modal.confirm('是否确认删除请假编号为"' + leaveIds + '"的数据项？').then(function() {
        return delLeave(leaveIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/attendance/leave/export', {
        ...this.queryParams
      }, `leave_${new Date().getTime()}.xlsx`)
    },
    /** 员工选择框变化事件 */
    handleEmployeeChange(employeeId) {
      const employee = this.employeeOptions.find(emp => emp.employeeId === employeeId);
      if (employee) {
        this.form.employeeName = employee.employeeName;
        this.form.deptId = employee.deptId;
        this.form.deptName = employee.deptName;
      }
    },
    /** 计算请假时长 */
    calculateLeaveHours() {
      if (this.form.startTime && this.form.endTime) {
        const start = new Date(this.form.startTime);
        const end = new Date(this.form.endTime);
        const diffHours = (end - start) / (1000 * 60 * 60);
        this.form.leaveHours = parseFloat(diffHours.toFixed(1));
      }
    }
  }
};
</script> 