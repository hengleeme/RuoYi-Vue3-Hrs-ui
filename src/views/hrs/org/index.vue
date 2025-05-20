<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="规划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入规划名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规划类型" prop="planType">
        <el-select v-model="queryParams.planType" placeholder="请选择规划类型" clearable>
          <el-option
            v-for="dict in dict.type.hrs_plan_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select
          v-model="queryParams.deptId"
          :data="deptOptions"
          :props="{ label: 'label', value: 'id' }"
          value-key="id"
          placeholder="请选择部门"
          clearable
        />
      </el-form-item>
      <el-form-item label="规划年份" prop="planYear">
        <el-date-picker
          v-model="queryParams.planYear"
          type="year"
          placeholder="请选择规划年份"
          clearable
          value-format="yyyy"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.hrs_plan_status"
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
          v-hasPermi="['hrs:org:add']"
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
          v-hasPermi="['hrs:org:edit']"
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
          v-hasPermi="['hrs:org:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hrs:org:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="规划ID" align="center" prop="planId" />
      <el-table-column label="规划名称" align="center" prop="planName" :show-overflow-tooltip="true" />
      <el-table-column label="规划类型" align="center" prop="planType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_plan_type" :value="scope.row.planType"/>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="规划年份" align="center" prop="planYear" width="100" />
      <el-table-column label="规划季度" align="center" prop="planQuarter" width="100" />
      <el-table-column label="规划月份" align="center" prop="planMonth" width="100" />
      <el-table-column label="预算金额" align="center" prop="budgetAmount" width="120" />
      <el-table-column label="实际金额" align="center" prop="actualAmount" width="120" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.hrs_plan_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hrs:org:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hrs:org:remove']"
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

    <!-- 添加或修改组织规划对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="规划名称" prop="planName">
              <el-input v-model="form.planName" placeholder="请输入规划名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划类型" prop="planType">
              <el-select v-model="form.planType" placeholder="请选择规划类型">
                <el-option
                  v-for="dict in dict.type.hrs_plan_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ label: 'label', value: 'id' }"
                value-key="id"
                placeholder="请选择部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划年份" prop="planYear">
              <el-date-picker
                v-model="form.planYear"
                type="year"
                placeholder="请选择规划年份"
                value-format="yyyy"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规划季度" prop="planQuarter">
              <el-select v-model="form.planQuarter" placeholder="请选择规划季度">
                <el-option label="第一季度" value="1" />
                <el-option label="第二季度" value="2" />
                <el-option label="第三季度" value="3" />
                <el-option label="第四季度" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划月份" prop="planMonth">
              <el-select v-model="form.planMonth" placeholder="请选择规划月份">
                <el-option
                  v-for="dict in dict.type.hrs_month"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="date"
                placeholder="请选择开始时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="date"
                placeholder="请选择结束时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预算金额" prop="budgetAmount">
              <el-input-number v-model="form.budgetAmount" :precision="2" :step="0.01" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际金额" prop="actualAmount">
              <el-input-number v-model="form.actualAmount" :precision="2" :step="0.01" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="规划内容" prop="planContent">
          <el-input v-model="form.planContent" type="textarea" placeholder="请输入规划内容" />
        </el-form-item>
        <el-form-item label="规划目标" prop="planTarget">
          <el-input v-model="form.planTarget" type="textarea" placeholder="请输入规划目标" />
        </el-form-item>
        <el-form-item label="实施计划" prop="implementationPlan">
          <el-input v-model="form.implementationPlan" type="textarea" placeholder="请输入实施计划" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.hrs_plan_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script>
import { listOrgPlan, getOrgPlan, delOrgPlan, addOrgPlan, updateOrgPlan } from "@/api/hrs/org";
import { treeselect } from "@/api/system/dept";

export default {
  name: "OrgPlan",
  dicts: ['hrs_plan_type', 'hrs_plan_status', 'hrs_month'],
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
      // 组织规划表格数据
      planList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        planName: null,
        planType: null,
        deptId: null,
        planYear: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planName: [
          { required: true, message: "规划名称不能为空", trigger: "blur" }
        ],
        planType: [
          { required: true, message: "规划类型不能为空", trigger: "change" }
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        planYear: [
          { required: true, message: "规划年份不能为空", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "change" }
        ],
        planContent: [
          { required: true, message: "规划内容不能为空", trigger: "blur" }
        ],
        planTarget: [
          { required: true, message: "规划目标不能为空", trigger: "blur" }
        ],
        implementationPlan: [
          { required: true, message: "实施计划不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询组织规划列表 */
    getList() {
      this.loading = true;
      listOrgPlan(this.queryParams).then(response => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      treeselect().then(response => {
        this.deptOptions = response.data;
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
        planId: null,
        planName: null,
        planType: null,
        deptId: null,
        deptName: null,
        planYear: null,
        planQuarter: null,
        planMonth: null,
        planContent: null,
        planTarget: null,
        implementationPlan: null,
        budgetAmount: 0,
        actualAmount: 0,
        startTime: null,
        endTime: null,
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
      this.ids = selection.map(item => item.planId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加组织规划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const planId = row.planId || this.ids
      getOrgPlan(planId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改组织规划";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.planId != null) {
            updateOrgPlan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrgPlan(this.form).then(response => {
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
      const planIds = row.planId || this.ids;
      this.$modal.confirm('是否确认删除组织规划编号为"' + planIds + '"的数据项？').then(function() {
        return delOrgPlan(planIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('hrs/org/export', {
        ...this.queryParams
      }, `组织规划_${new Date().getTime()}.xlsx`)
    }
  }
};
</script> 