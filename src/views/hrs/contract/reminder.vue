<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提醒类型" prop="reminderType">
        <el-select v-model="queryParams.reminderType" placeholder="请选择提醒类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_contract_reminder_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提醒状态" prop="reminderStatus">
        <el-select v-model="queryParams.reminderStatus" placeholder="请选择提醒状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_contract_reminder_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提醒日期" prop="reminderDate">
        <el-date-picker clearable
          v-model="queryParams.reminderDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择提醒日期">
        </el-date-picker>
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
          v-hasPermi="['hrs:contract:reminder:add']"
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
          v-hasPermi="['hrs:contract:reminder:edit']"
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
          v-hasPermi="['hrs:contract:reminder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:contract:reminder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reminderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="提醒类型" align="center" prop="reminderType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_contract_reminder_type" :value="scope.row.reminderType"/>
        </template>
      </el-table-column>
      <el-table-column label="提醒日期" align="center" prop="reminderDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.reminderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提醒状态" align="center" prop="reminderStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_contract_reminder_status" :value="scope.row.reminderStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="handleResult" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:contract:reminder:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:contract:reminder:remove']"
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

    <!-- 添加或修改合同到期提醒对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合同编号" prop="contractId">
          <el-select v-model="form.contractId" placeholder="请选择合同" @change="handleContractChange">
            <el-option
              v-for="contract in contractOptions"
              :key="contract.contractId"
              :label="contract.contractNo"
              :value="contract.contractId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提醒类型" prop="reminderType">
          <el-select v-model="form.reminderType" placeholder="请选择提醒类型">
            <el-option
              v-for="dict in dict.type.hrs_contract_reminder_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提醒日期" prop="reminderDate">
          <el-date-picker clearable
            v-model="form.reminderDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择提醒日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提醒状态" prop="reminderStatus">
          <el-select v-model="form.reminderStatus" placeholder="请选择提醒状态">
            <el-option
              v-for="dict in dict.type.hrs_contract_reminder_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果" prop="handleResult">
          <el-input v-model="form.handleResult" type="textarea" placeholder="请输入处理结果" />
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
import { listReminder, getReminder, delReminder, addReminder, updateReminder, getContractReminders, getUnhandledReminders } from "@/api/hrs/contract/reminder";
import { listContract } from "@/api/hrs/contract/contract";

export default {
  name: "ContractReminder",
  dicts: ['hrs_contract_reminder_type', 'hrs_contract_reminder_status'],
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
      // 合同到期提醒表格数据
      reminderList: [],
      // 合同选项
      contractOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: null,
        contractNo: null,
        reminderType: null,
        reminderStatus: null,
        reminderDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractId: [
          { required: true, message: "合同不能为空", trigger: "change" }
        ],
        reminderType: [
          { required: true, message: "提醒类型不能为空", trigger: "change" }
        ],
        reminderDate: [
          { required: true, message: "提醒日期不能为空", trigger: "blur" }
        ],
        reminderStatus: [
          { required: true, message: "提醒状态不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getContractOptions();
  },
  methods: {
    /** 查询合同到期提醒列表 */
    getList() {
      this.loading = true;
      const contractId = this.$route.query.contractId;
      if (contractId) {
        this.queryParams.contractId = contractId;
        getContractReminders(contractId).then(response => {
          this.reminderList = response.data;
          this.total = response.data.length;
          this.loading = false;
        });
      } else {
        listReminder(this.queryParams).then(response => {
          this.reminderList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }
    },
    /** 查询合同下拉选项 */
    getContractOptions() {
      listContract().then(response => {
        this.contractOptions = response.rows;
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
        reminderId: null,
        contractId: null,
        reminderType: null,
        reminderDate: null,
        reminderStatus: "0",
        handleResult: null,
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
      this.ids = selection.map(item => item.reminderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加合同到期提醒";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reminderId = row.reminderId || this.ids
      getReminder(reminderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同到期提醒";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reminderId != null) {
            updateReminder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReminder(this.form).then(response => {
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
      const reminderIds = row.reminderId || this.ids;
      this.$modal.confirm('是否确认删除合同到期提醒编号为"' + reminderIds + '"的数据项？').then(function() {
        return delReminder(reminderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/contract/reminder/export', {
        ...this.queryParams
      }, `contract_reminder_${new Date().getTime()}.xlsx`)
    },
    /** 合同选择框变化事件 */
    handleContractChange(contractId) {
      const contract = this.contractOptions.find(contract => contract.contractId === contractId);
      if (contract) {
        this.queryParams.contractNo = contract.contractNo;
      }
    }
  }
};
</script> 