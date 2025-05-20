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
      <el-form-item label="教育类型" prop="educationType">
        <el-select v-model="queryParams.educationType" placeholder="请选择教育类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_education_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学校名称" prop="schoolName">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校/培训机构名称"
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
          v-hasPermi="['hrs:employee:education:add']"
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
          v-hasPermi="['hrs:employee:education:edit']"
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
          v-hasPermi="['hrs:employee:education:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:employee:education:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="educationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="人员姓名" align="center" prop="employeeName" />
      <el-table-column label="教育类型" align="center" prop="educationType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_education_type" :value="scope.row.educationType"/>
        </template>
      </el-table-column>
      <el-table-column label="学校/培训机构" align="center" prop="schoolName" />
      <el-table-column label="专业" align="center" prop="major" />
      <el-table-column label="学位" align="center" prop="degree" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否毕业" align="center" prop="isGraduated">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isGraduated"/>
        </template>
      </el-table-column>
      <el-table-column label="证书编号" align="center" prop="certificateNo" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:employee:education:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:employee:education:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-if="scope.row.certificateFile"
            v-hasPermi="['hrs:employee:education:download']"
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

    <!-- 添加或修改教育背景对话框 -->
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
            <el-form-item label="教育类型" prop="educationType">
              <el-select v-model="form.educationType" placeholder="请选择教育类型">
                <el-option
                  v-for="dict in dict.type.hrs_education_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校名称" prop="schoolName">
              <el-input v-model="form.schoolName" placeholder="请输入学校/培训机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input v-model="form.major" placeholder="请输入专业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学位" prop="degree">
              <el-select v-model="form.degree" placeholder="请选择学位">
                <el-option
                  v-for="dict in dict.type.hrs_degree"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker clearable
                v-model="form.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker clearable
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否毕业" prop="isGraduated">
              <el-radio-group v-model="form.isGraduated">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="certificateNo">
              <el-input v-model="form.certificateNo" placeholder="请输入证书编号" />
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
import { listEducation, getEducation, delEducation, addEducation, updateEducation, downloadEducationFile } from "@/api/hrs/employee/education";
import { listEmployee } from "@/api/hrs/employee/employee";
import FileUpload from "@/components/FileUpload";

export default {
  name: "Education",
  dicts: ['hrs_education_type', 'hrs_degree', 'sys_yes_no'],
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
      // 教育背景表格数据
      educationList: [],
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
        educationType: null,
        schoolName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        employeeId: [
          { required: true, message: "人员不能为空", trigger: "change" }
        ],
        educationType: [
          { required: true, message: "教育类型不能为空", trigger: "change" }
        ],
        schoolName: [
          { required: true, message: "学校/培训机构名称不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "开始日期不能为空", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "结束日期不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getEmployeeOptions();
  },
  methods: {
    /** 查询教育背景列表 */
    getList() {
      this.loading = true;
      listEducation(this.queryParams).then(response => {
        this.educationList = response.rows;
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
        educationId: null,
        employeeId: null,
        educationType: null,
        schoolName: null,
        major: null,
        degree: null,
        startDate: null,
        endDate: null,
        isGraduated: "0",
        certificateNo: null,
        certificateFile: null,
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
      this.ids = selection.map(item => item.educationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教育背景";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const educationId = row.educationId || this.ids
      getEducation(educationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教育背景";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.educationId != null) {
            updateEducation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEducation(this.form).then(response => {
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
      const educationIds = row.educationId || this.ids;
      this.$modal.confirm('是否确认删除教育背景编号为"' + educationIds + '"的数据项？').then(function() {
        return delEducation(educationIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/employee/education/export', {
        ...this.queryParams
      }, `education_${new Date().getTime()}.xlsx`)
    },
    /** 下载附件操作 */
    handleDownload(row) {
      downloadEducationFile(row.certificateFile);
    }
  }
};
</script> 