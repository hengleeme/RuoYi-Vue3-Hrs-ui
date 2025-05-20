<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设置类型" prop="settingsType">
        <el-input
          v-model="queryParams.settingsType"
          placeholder="请输入设置类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设置键" prop="settingsKey">
        <el-input
          v-model="queryParams.settingsKey"
          placeholder="请输入设置键"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否系统" prop="isSystem">
        <el-select v-model="queryParams.isSystem" placeholder="请选择是否系统内置" clearable>
          <el-option
            v-for="dict in dict.type.sys_yes_no"
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
          v-hasPermi="['hrs:settings:add']"
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
          v-hasPermi="['hrs:settings:edit']"
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
          v-hasPermi="['hrs:settings:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:settings:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="settingsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设置ID" align="center" prop="settingsId" />
      <el-table-column label="设置类型" align="center" prop="settingsType" />
      <el-table-column label="设置键" align="center" prop="settingsKey" />
      <el-table-column label="设置值" align="center" prop="settingsValue" />
      <el-table-column label="设置描述" align="center" prop="settingsDesc" />
      <el-table-column label="是否系统内置" align="center" prop="isSystem">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isSystem"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:settings:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:settings:remove']"
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

    <!-- 添加或修改系统设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设置类型" prop="settingsType">
          <el-input v-model="form.settingsType" placeholder="请输入设置类型" />
        </el-form-item>
        <el-form-item label="设置键" prop="settingsKey">
          <el-input v-model="form.settingsKey" placeholder="请输入设置键" />
        </el-form-item>
        <el-form-item label="设置值" prop="settingsValue">
          <el-input v-model="form.settingsValue" type="textarea" placeholder="请输入设置值" />
        </el-form-item>
        <el-form-item label="设置描述" prop="settingsDesc">
          <el-input v-model="form.settingsDesc" type="textarea" placeholder="请输入设置描述" />
        </el-form-item>
        <el-form-item label="是否系统" prop="isSystem">
          <el-radio-group v-model="form.isSystem">
            <el-radio
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
import { listSettings, getSettings, delSettings, addSettings, updateSettings } from "@/api/hrs/settings";

export default {
  name: "Settings",
  dicts: ['sys_yes_no'],
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
      // 系统设置表格数据
      settingsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        settingsType: null,
        settingsKey: null,
        isSystem: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        settingsType: [
          { required: true, message: "设置类型不能为空", trigger: "blur" }
        ],
        settingsKey: [
          { required: true, message: "设置键不能为空", trigger: "blur" }
        ],
        settingsValue: [
          { required: true, message: "设置值不能为空", trigger: "blur" }
        ],
        isSystem: [
          { required: true, message: "是否系统内置不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统设置列表 */
    getList() {
      this.loading = true;
      listSettings(this.queryParams).then(response => {
        this.settingsList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        settingsId: null,
        settingsType: null,
        settingsKey: null,
        settingsValue: null,
        settingsDesc: null,
        isSystem: "0",
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
      this.ids = selection.map(item => item.settingsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加系统设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const settingsId = row.settingsId || this.ids
      getSettings(settingsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改系统设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.settingsId != null) {
            updateSettings(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSettings(this.form).then(response => {
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
      const settingsIds = row.settingsId || this.ids;
      this.$modal.confirm('是否确认删除系统设置编号为"' + settingsIds + '"的数据项？').then(function() {
        return delSettings(settingsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/settings/export', {
        ...this.queryParams
      }, `settings_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 