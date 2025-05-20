<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="人员姓名" prop="employeeName">
        <el-input
          v-model="queryParams.employeeName"
          placeholder="请输入人员姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="queryParams.gender" placeholder="请选择性别" clearable>
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择部门" clearable>
          <el-option
            v-for="dept in deptOptions"
            :key="dept.deptId"
            :label="dept.deptName"
            :value="dept.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="postId">
        <el-select v-model="queryParams.postId" placeholder="请选择岗位" clearable>
          <el-option
            v-for="post in postOptions"
            :key="post.postId"
            :label="post.postName"
            :value="post.postId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员类别" prop="employeeType">
        <el-select v-model="queryParams.employeeType" placeholder="请选择人员类别" clearable>
          <el-option
            v-for="dict in dict.type.hrs_employee_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学历" prop="education">
        <el-select v-model="queryParams.education" placeholder="请选择学历" clearable>
          <el-option
            v-for="dict in dict.type.hrs_education"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-select v-model="queryParams.title" placeholder="请选择职称" clearable>
          <el-option
            v-for="dict in dict.type.hrs_title"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
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
      <el-form-item label="证书状态" prop="certificateStatus">
        <el-select v-model="queryParams.certificateStatus" placeholder="请选择证书状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_certificate_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="培训类型" prop="trainingType">
        <el-select v-model="queryParams.trainingType" placeholder="请选择培训类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_training_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="培训状态" prop="trainingStatus">
        <el-select v-model="queryParams.trainingStatus" placeholder="请选择培训状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_training_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考核类型" prop="assessmentType">
        <el-select v-model="queryParams.assessmentType" placeholder="请选择考核类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_assessment_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考核结果" prop="assessmentResult">
        <el-select v-model="queryParams.assessmentResult" placeholder="请选择考核结果" clearable>
          <el-option
            v-for="dict in dict.type.hrs_assessment_result"
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:employee:search:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="employeeList">
      <el-table-column label="人员姓名" align="center" prop="employeeName" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.gender"/>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="岗位" align="center" prop="postName" />
      <el-table-column label="人员类别" align="center" prop="employeeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_employee_type" :value="scope.row.employeeType"/>
        </template>
      </el-table-column>
      <el-table-column label="学历" align="center" prop="education">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_education" :value="scope.row.education"/>
        </template>
      </el-table-column>
      <el-table-column label="职称" align="center" prop="title">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_title" :value="scope.row.title"/>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" align="center" prop="entryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.entryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['hrs:employee:search:view']"
          >查看</el-button>
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

    <!-- 查看详情对话框 -->
    <el-dialog title="人员详细信息" :visible.sync="open" width="800px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="人员姓名">{{ form.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          <dict-tag :options="dict.type.sys_user_sex" :value="form.gender"/>
        </el-descriptions-item>
        <el-descriptions-item label="部门">{{ form.deptName }}</el-descriptions-item>
        <el-descriptions-item label="岗位">{{ form.postName }}</el-descriptions-item>
        <el-descriptions-item label="人员类别">
          <dict-tag :options="dict.type.hrs_employee_type" :value="form.employeeType"/>
        </el-descriptions-item>
        <el-descriptions-item label="学历">
          <dict-tag :options="dict.type.hrs_education" :value="form.education"/>
        </el-descriptions-item>
        <el-descriptions-item label="职称">
          <dict-tag :options="dict.type.hrs_title" :value="form.title"/>
        </el-descriptions-item>
        <el-descriptions-item label="入职时间">{{ parseTime(form.entryDate, '{y}-{m}-{d}') }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ parseTime(form.birthDate, '{y}-{m}-{d}') }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { listSearch, exportSearch } from "@/api/hrs/employee/search";
import { listDept } from "@/api/system/dept";
import { listPost } from "@/api/system/post";

export default {
  name: "Search",
  dicts: ['sys_user_sex', 'hrs_employee_type', 'hrs_education', 'hrs_title', 
          'hrs_certificate_type', 'hrs_certificate_status', 'hrs_training_type', 
          'hrs_training_status', 'hrs_assessment_type', 'hrs_assessment_result'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 人员列表
      employeeList: [],
      // 部门树选项
      deptOptions: [],
      // 岗位选项
      postOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeName: null,
        gender: null,
        deptId: null,
        postId: null,
        employeeType: null,
        education: null,
        title: null,
        certificateType: null,
        certificateName: null,
        certificateStatus: null,
        trainingType: null,
        trainingStatus: null,
        assessmentType: null,
        assessmentResult: null
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getPostList();
  },
  methods: {
    /** 查询人员列表 */
    getList() {
      this.loading = true;
      listSearch(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.employeeList = response.rows;
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
    /** 查询岗位列表 */
    getPostList() {
      listPost().then(response => {
        this.postOptions = response.rows;
      });
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/employee/search/export', {
        ...this.queryParams
      }, `人员综合信息_${new Date().getTime()}.xlsx`)
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.form = row;
      this.open = true;
    }
  }
};
</script> 