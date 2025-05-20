<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="人员" prop="employeeId">
        <el-select v-model="queryParams.employeeId" placeholder="请选择人员" clearable>
          <el-option
            v-for="item in employeeOptions"
            :key="item.employeeId"
            :label="item.employeeName"
            :value="item.employeeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异动类型" prop="transferType">
        <el-select v-model="queryParams.transferType" placeholder="请选择异动类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_transfer_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异动日期" prop="transferDate">
        <el-date-picker
          v-model="queryParams.transferDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_audit_status"
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
          v-hasPermi="['hrs:employee:transfer:add']"
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
          v-hasPermi="['hrs:employee:transfer:edit']"
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
          v-hasPermi="['hrs:employee:transfer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:employee:transfer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="transferList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人员姓名" align="center" prop="employeeName" />
      <el-table-column label="异动类型" align="center" prop="transferType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_transfer_type" :value="scope.row.transferType"/>
        </template>
      </el-table-column>
      <el-table-column label="异动日期" align="center" prop="transferDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.transferDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异动前科室" align="center" prop="beforeDeptName" />
      <el-table-column label="异动后科室" align="center" prop="afterDeptName" />
      <el-table-column label="异动前类别" align="center" prop="beforeCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_employee_category" :value="scope.row.beforeCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="异动后类别" align="center" prop="afterCategory">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_employee_category" :value="scope.row.afterCategory"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_audit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:employee:transfer:edit']"
            v-if="scope.row.status === '0'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:employee:transfer:remove']"
            v-if="scope.row.status === '0'"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['hrs:employee:transfer:audit']"
            v-if="scope.row.status === '0'"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-if="scope.row.transferFile"
            v-hasPermi="['hrs:employee:transfer:download']"
          >下载</el-button>
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

    <!-- 添加或修改人员异动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员" prop="employeeId">
              <el-select v-model="form.employeeId" placeholder="请选择人员">
                <el-option
                  v-for="item in employeeOptions"
                  :key="item.employeeId"
                  :label="item.employeeName"
                  :value="item.employeeId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异动类型" prop="transferType">
              <el-select v-model="form.transferType" placeholder="请选择异动类型" @change="handleTransferTypeChange">
                <el-option
                  v-for="dict in dict.type.hrs_transfer_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异动日期" prop="transferDate">
              <el-date-picker clearable
                v-model="form.transferDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择异动日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.transferType === '1'">
            <el-form-item label="异动前科室" prop="beforeDeptId">
              <treeselect
                v-model="form.beforeDeptId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="请选择异动前科室"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.transferType === '1'">
            <el-form-item label="异动后科室" prop="afterDeptId">
              <treeselect
                v-model="form.afterDeptId"
                :options="deptOptions"
                :normalizer="normalizer"
                placeholder="请选择异动后科室"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.transferType === '2'">
            <el-form-item label="异动前类别" prop="beforeCategory">
              <el-select v-model="form.beforeCategory" placeholder="请选择异动前类别">
                <el-option
                  v-for="dict in dict.type.hrs_employee_category"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.transferType === '2'">
            <el-form-item label="异动后类别" prop="afterCategory">
              <el-select v-model="form.afterCategory" placeholder="请选择异动后类别">
                <el-option
                  v-for="dict in dict.type.hrs_employee_category"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动原因" prop="transferReason">
              <el-input v-model="form.transferReason" type="textarea" placeholder="请输入异动原因" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异动附件" prop="transferFile">
              <file-upload v-model="form.transferFile"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核人员异动对话框 -->
    <el-dialog :title="title" :visible.sync="auditOpen" width="500px" append-to-body>
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="80px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="auditForm.status">
            <el-radio
              v-for="dict in dict.type.sys_audit_status"
              :key="dict.value"
              :label="dict.value"
              v-if="dict.value !== '0'"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input v-model="auditForm.auditRemark" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAuditForm">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTransfer, getTransfer, delTransfer, addTransfer, updateTransfer, auditTransfer, downloadTransferFile } from "@/api/hrs/employee/transfer";
import { listEmployee } from "@/api/hrs/employee/employee";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import FileUpload from "@/components/FileUpload";

export default {
  name: "Transfer",
  dicts: ['hrs_transfer_type', 'hrs_employee_category', 'sys_audit_status'],
  components: { Treeselect, FileUpload },
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
      // 人员异动表格数据
      transferList: [],
      // 人员选项
      employeeOptions: [],
      // 科室选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示审核弹出层
      auditOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeId: null,
        transferType: null,
        transferDate: [],
        status: null
      },
      // 表单参数
      form: {},
      // 审核表单参数
      auditForm: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "人员不能为空", trigger: "change" }
        ],
        transferType: [
          { required: true, message: "异动类型不能为空", trigger: "change" }
        ],
        transferDate: [
          { required: true, message: "异动日期不能为空", trigger: "change" }
        ],
        beforeDeptId: [
          { required: true, message: "异动前科室不能为空", trigger: "change" }
        ],
        afterDeptId: [
          { required: true, message: "异动后科室不能为空", trigger: "change" }
        ],
        beforeCategory: [
          { required: true, message: "异动前类别不能为空", trigger: "change" }
        ],
        afterCategory: [
          { required: true, message: "异动后类别不能为空", trigger: "change" }
        ],
        transferReason: [
          { required: true, message: "异动原因不能为空", trigger: "blur" }
        ]
      },
      // 审核表单校验
      auditRules: {
        status: [
          { required: true, message: "审核结果不能为空", trigger: "change" }
        ],
        auditRemark: [
          { required: true, message: "审核备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
    this.getDeptTree();
  },
  methods: {
    /** 查询人员异动列表 */
    getList() {
      this.loading = true;
      listTransfer(this.queryParams).then(response => {
        this.transferList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询人员选项 */
    getEmployeeOptions() {
      listEmployee().then(response => {
        this.employeeOptions = response.rows;
      });
    },
    /** 查询科室下拉树结构 */
    getDeptTree() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    /** 转换科室数据结构 */
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
    /** 异动类型变更 */
    handleTransferTypeChange(value) {
      this.form.beforeDeptId = null;
      this.form.afterDeptId = null;
      this.form.beforeCategory = null;
      this.form.afterCategory = null;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消审核按钮
    cancelAudit() {
      this.auditOpen = false;
      this.resetAudit();
    },
    // 表单重置
    reset() {
      this.form = {
        transferId: null,
        employeeId: null,
        transferType: null,
        transferDate: null,
        beforeDeptId: null,
        afterDeptId: null,
        beforeCategory: null,
        afterCategory: null,
        transferReason: null,
        transferFile: null,
        status: "0",
        remark: null
      };
      this.resetForm("form");
    },
    // 审核表单重置
    resetAudit() {
      this.auditForm = {
        transferId: null,
        status: null,
        auditRemark: null
      };
      this.resetForm("auditForm");
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
      this.ids = selection.map(item => item.transferId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员异动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const transferId = row.transferId || this.ids
      getTransfer(transferId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员异动";
      });
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.resetAudit();
      const transferId = row.transferId || this.ids
      getTransfer(transferId).then(response => {
        this.auditForm.transferId = response.data.transferId;
        this.auditOpen = true;
        this.title = "审核人员异动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.transferId != null) {
            updateTransfer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTransfer(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交审核按钮 */
    submitAuditForm() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          auditTransfer(this.auditForm).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.auditOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const transferIds = row.transferId || this.ids;
      this.$modal.confirm('是否确认删除人员异动编号为"' + transferIds + '"的数据项？').then(function() {
        return delTransfer(transferIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/employee/transfer/export', {
        ...this.queryParams
      }, `transfer_${new Date().getTime()}.xlsx`)
    },
    /** 下载附件操作 */
    handleDownload(row) {
      downloadTransferFile(row.transferFile);
    }
  }
};
</script> 