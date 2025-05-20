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
      <el-form-item label="变更类型" prop="changeType">
        <el-select v-model="queryParams.changeType" placeholder="请选择变更类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_contract_change_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变更日期" prop="changeDate">
        <el-date-picker clearable
          v-model="queryParams.changeDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择变更日期">
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
          v-hasPermi="['hrs:contract:change:add']"
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
          v-hasPermi="['hrs:contract:change:edit']"
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
          v-hasPermi="['hrs:contract:change:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:contract:change:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="changeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="变更类型" align="center" prop="changeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_contract_change_type" :value="scope.row.changeType"/>
        </template>
      </el-table-column>
      <el-table-column label="变更原因" align="center" prop="changeReason" :show-overflow-tooltip="true"/>
      <el-table-column label="变更日期" align="center" prop="changeDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.changeDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更文件" align="center" prop="changeFile" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:contract:change:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:contract:change:remove']"
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

    <!-- 添加或修改合同变更记录对话框 -->
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
        <el-form-item label="变更类型" prop="changeType">
          <el-select v-model="form.changeType" placeholder="请选择变更类型">
            <el-option
              v-for="dict in dict.type.hrs_contract_change_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更原因" prop="changeReason">
          <el-input v-model="form.changeReason" type="textarea" placeholder="请输入变更原因" />
        </el-form-item>
        <el-form-item label="变更日期" prop="changeDate">
          <el-date-picker clearable
            v-model="form.changeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择变更日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变更文件" prop="changeFile">
          <file-upload v-model="form.changeFile"/>
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
import { listChange, getChange, delChange, addChange, updateChange, getContractChanges } from "@/api/hrs/contract/change";
import { listContract } from "@/api/hrs/contract/contract";

export default {
  name: "ContractChange",
  dicts: ['hrs_contract_change_type'],
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
      // 合同变更记录表格数据
      changeList: [],
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
        changeType: null,
        changeDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractId: [
          { required: true, message: "合同不能为空", trigger: "change" }
        ],
        changeType: [
          { required: true, message: "变更类型不能为空", trigger: "change" }
        ],
        changeReason: [
          { required: true, message: "变更原因不能为空", trigger: "blur" }
        ],
        changeDate: [
          { required: true, message: "变更日期不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getContractOptions();
  },
  methods: {
    /** 查询合同变更记录列表 */
    getList() {
      this.loading = true;
      const contractId = this.$route.query.contractId;
      if (contractId) {
        this.queryParams.contractId = contractId;
        getContractChanges(contractId).then(response => {
          this.changeList = response.data;
          this.total = response.data.length;
          this.loading = false;
        });
      } else {
        listChange(this.queryParams).then(response => {
          this.changeList = response.rows;
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
        changeId: null,
        contractId: null,
        changeType: null,
        changeReason: null,
        changeDate: null,
        changeFile: null,
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
      this.ids = selection.map(item => item.changeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加合同变更记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const changeId = row.changeId || this.ids
      getChange(changeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同变更记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.changeId != null) {
            updateChange(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChange(this.form).then(response => {
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
      const changeIds = row.changeId || this.ids;
      this.$modal.confirm('是否确认删除合同变更记录编号为"' + changeIds + '"的数据项？').then(function() {
        return delChange(changeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/contract/change/export', {
        ...this.queryParams
      }, `contract_change_${new Date().getTime()}.xlsx`)
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