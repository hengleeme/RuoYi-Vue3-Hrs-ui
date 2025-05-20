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
      <el-form-item label="证书类型" prop="certificateType">
        <el-select v-model="queryParams.certificateType" placeholder="请选择证书类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_certificate_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="证书名称" prop="certificateName">
        <el-input
          v-model="queryParams.certificateName"
          placeholder="请输入证书名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['hrs:employee:certificate:add']"
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
          v-hasPermi="['hrs:employee:certificate:edit']"
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
          v-hasPermi="['hrs:employee:certificate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:employee:certificate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="certificateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人员姓名" align="center" prop="employeeName" />
      <el-table-column label="证书类型" align="center" prop="certificateType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_certificate_type" :value="scope.row.certificateType"/>
        </template>
      </el-table-column>
      <el-table-column label="证书名称" align="center" prop="certificateName" />
      <el-table-column label="证书编号" align="center" prop="certificateNo" />
      <el-table-column label="发证日期" align="center" prop="issueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center" prop="validDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发证机构" align="center" prop="issueOrg" />
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
            v-hasPermi="['hrs:employee:certificate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:employee:certificate:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-if="scope.row.certificateFile"
            v-hasPermi="['hrs:employee:certificate:download']"
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

    <!-- 添加或修改资格证执业证对话框 -->
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
            <el-form-item label="证书类型" prop="certificateType">
              <el-select v-model="form.certificateType" placeholder="请选择证书类型">
                <el-option
                  v-for="dict in dict.type.hrs_certificate_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书名称" prop="certificateName">
              <el-input v-model="form.certificateName" placeholder="请输入证书名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="certificateNo">
              <el-input v-model="form.certificateNo" placeholder="请输入证书编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证日期" prop="issueDate">
              <el-date-picker clearable
                v-model="form.issueDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择发证日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" prop="validDate">
              <el-date-picker clearable
                v-model="form.validDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择有效期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构" prop="issueOrg">
              <el-input v-model="form.issueOrg" placeholder="请输入发证机构" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证书附件" prop="certificateFile">
              <file-upload v-model="form.certificateFile"/>
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
  </div>
</template>

<script>
import { listCertificate, getCertificate, delCertificate, addCertificate, updateCertificate, downloadCertificateFile } from "@/api/hrs/employee/certificate";
import { listEmployee } from "@/api/hrs/employee/employee";
import FileUpload from "@/components/FileUpload";

export default {
  name: "Certificate",
  dicts: ['hrs_certificate_type', 'sys_normal_disable'],
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
      // 资格证执业证表格数据
      certificateList: [],
      // 人员选项
      employeeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeId: null,
        certificateType: null,
        certificateName: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "人员不能为空", trigger: "change" }
        ],
        certificateType: [
          { required: true, message: "证书类型不能为空", trigger: "change" }
        ],
        certificateName: [
          { required: true, message: "证书名称不能为空", trigger: "blur" }
        ],
        certificateNo: [
          { required: true, message: "证书编号不能为空", trigger: "blur" }
        ],
        issueDate: [
          { required: true, message: "发证日期不能为空", trigger: "change" }
        ],
        validDate: [
          { required: true, message: "有效期不能为空", trigger: "change" }
        ],
        issueOrg: [
          { required: true, message: "发证机构不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
  },
  methods: {
    /** 查询资格证执业证列表 */
    getList() {
      this.loading = true;
      listCertificate(this.queryParams).then(response => {
        this.certificateList = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        certificateId: null,
        employeeId: null,
        certificateType: null,
        certificateName: null,
        certificateNo: null,
        issueDate: null,
        validDate: null,
        issueOrg: null,
        certificateFile: null,
        status: "0",
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
      this.ids = selection.map(item => item.certificateId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资格证执业证";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const certificateId = row.certificateId || this.ids
      getCertificate(certificateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资格证执业证";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.certificateId != null) {
            updateCertificate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCertificate(this.form).then(response => {
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
      const certificateIds = row.certificateId || this.ids;
      this.$modal.confirm('是否确认删除资格证执业证编号为"' + certificateIds + '"的数据项？').then(function() {
        return delCertificate(certificateIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/employee/certificate/export', {
        ...this.queryParams
      }, `certificate_${new Date().getTime()}.xlsx`)
    },
    /** 下载附件操作 */
    handleDownload(row) {
      downloadCertificateFile(row.certificateFile);
    }
  }
};
</script> 