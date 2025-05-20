<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="变更类型" prop="changeType">
        <el-select v-model="queryParams.changeType" placeholder="请选择变更类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_salary_change_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变更对象" prop="changeName">
        <el-input
          v-model="queryParams.changeName"
          placeholder="请输入变更对象名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更字段" prop="changeField">
        <el-input
          v-model="queryParams.changeField"
          placeholder="请输入变更字段"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="变更原因" prop="changeReason">
        <el-input
          v-model="queryParams.changeReason"
          placeholder="请输入变更原因"
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:salary:log:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="logList"
      row-key="logId"
      border
    >
      <el-table-column label="日志ID" align="center" prop="logId" />
      <el-table-column label="变更类型" align="center" prop="changeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_salary_change_type" :value="scope.row.changeType"/>
        </template>
      </el-table-column>
      <el-table-column label="变更对象" align="center" prop="changeName" />
      <el-table-column label="变更字段" align="center" prop="changeField" />
      <el-table-column label="原值" align="center" prop="oldValue" />
      <el-table-column label="新值" align="center" prop="newValue" />
      <el-table-column label="变更原因" align="center" prop="changeReason" :show-overflow-tooltip="true"/>
      <el-table-column label="操作人" align="center" prop="createBy" />
      <el-table-column label="操作时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['hrs:salary:log:query']"
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

    <!-- 查看日志详情对话框 -->
    <el-dialog title="日志详情" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更类型">
              <dict-tag :options="dict.type.hrs_salary_change_type" :value="form.changeType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更对象">
              <span>{{ form.changeName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更字段">
              <span>{{ form.changeField }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原值">
              <span>{{ form.oldValue }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新值">
              <span>{{ form.newValue }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="变更原因">
              <span>{{ form.changeReason }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人">
              <span>{{ form.createBy }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间">
              <span>{{ parseTime(form.createTime) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog } from "@/api/hrs/salary/log";

export default {
  name: "Log",
  dicts: ['hrs_salary_change_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日志表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        changeType: null,
        changeName: null,
        changeField: null,
        changeReason: null
      },
      // 表单参数
      form: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询日志列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    /** 查看按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/salary/log/export', {
        ...this.queryParams
      }, `薪酬变更日志_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 