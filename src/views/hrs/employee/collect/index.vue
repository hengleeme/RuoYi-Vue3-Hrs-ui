<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="人员" prop="employeeId">
        <el-select v-model="queryParams.employeeId" placeholder="请选择人员" clearable>
          <el-option
            v-for="dept in deptOptions"
            :key="dept.deptId"
            :label="dept.deptName"
            :value="dept.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采集类型" prop="collectType">
        <el-select v-model="queryParams.collectType" placeholder="请选择采集类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_collect_type"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['hrs:employee:collect:add']"
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
          v-hasPermi="['hrs:employee:collect:edit']"
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
          v-hasPermi="['hrs:employee:collect:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:employee:collect:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="collectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="采集ID" align="center" prop="collectId" />
      <el-table-column label="人员姓名" align="center" prop="employeeName" />
      <el-table-column label="采集类型" align="center" prop="collectType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_collect_type" :value="scope.row.collectType"/>
        </template>
      </el-table-column>
      <el-table-column label="采集内容" align="center" prop="collectContent" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="auditBy" />
      <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:employee:collect:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:employee:collect:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-check"
            @click="handleAudit(scope.row)"
            v-hasPermi="['hrs:employee:collect:audit']"
            v-if="scope.row.status === '0'"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['hrs:employee:collect:download']"
            v-if="scope.row.collectFile"
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

    <!-- 添加或修改人员信息采集对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="人员" prop="employeeId">
          <el-select v-model="form.employeeId" placeholder="请选择人员">
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集类型" prop="collectType">
          <el-select v-model="form.collectType" placeholder="请选择采集类型">
            <el-option
              v-for="dict in dict.type.hrs_collect_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集内容" prop="collectContent">
          <el-input v-model="form.collectContent" type="textarea" placeholder="请输入采集内容" />
        </el-form-item>
        <el-form-item label="采集附件">
          <file-upload v-model="form.collectFile"/>
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

    <!-- 审核对话框 -->
    <el-dialog title="审核" :visible.sync="auditOpen" width="500px" append-to-body>
      <el-form ref="auditForm" :model="auditForm" :rules="auditRules" label-width="80px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="auditForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemark">
          <el-input v-model="auditForm.auditRemark" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">确 定</el-button>
        <el-button @click="cancelAudit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCollect, getCollect, delCollect, addCollect, updateCollect, auditCollect, downloadCollectFile } from "@/api/hrs/employee/collect";
import { listDept } from "@/api/system/dept";
import FileUpload from "@/components/FileUpload";

export default {
  name: "Collect",
  dicts: ['hrs_collect_type', 'sys_normal_disable'],
  components: { FileUpload },
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
      // 人员信息采集表格数据
      collectList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示审核弹出层
      auditOpen: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeId: null,
        collectType: null,
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
        collectType: [
          { required: true, message: "采集类型不能为空", trigger: "change" }
        ],
        collectContent: [
          { required: true, message: "采集内容不能为空", trigger: "blur" }
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
    this.getDeptTree();
  },
  methods: {
    /** 查询人员信息采集列表 */
    getList() {
      this.loading = true;
      listCollect(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.collectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      listDept().then(response => {
        this.deptOptions = response.data;
      });
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
        collectId: null,
        employeeId: null,
        collectType: null,
        collectContent: null,
        collectFile: null,
        status: "0",
        remark: null
      };
      this.resetForm("form");
    },
    // 审核表单重置
    resetAudit() {
      this.auditForm = {
        collectId: null,
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.collectId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加人员信息采集";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const collectId = row.collectId || this.ids
      getCollect(collectId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改人员信息采集";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.collectId != null) {
            updateCollect(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCollect(this.form).then(response => {
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
      const collectIds = row.collectId || this.ids;
      this.$modal.confirm('是否确认删除人员信息采集编号为"' + collectIds + '"的数据项？').then(function() {
        return delCollect(collectIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/employee/collect/export', {
        ...this.queryParams
      }, `人员信息采集_${new Date().getTime()}.xlsx`)
    },
    /** 审核按钮操作 */
    handleAudit(row) {
      this.resetAudit();
      this.auditForm.collectId = row.collectId;
      this.auditOpen = true;
    },
    /** 提交审核 */
    submitAudit() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          auditCollect(this.auditForm).then(response => {
            this.$modal.msgSuccess("审核成功");
            this.auditOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 下载按钮操作 */
    handleDownload(row) {
      downloadCollectFile(row.collectFile);
    }
  }
};
</script> 