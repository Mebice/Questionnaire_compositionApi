<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  // 提示框
import 'element-plus/theme-chalk/el-message.css' // 提示框樣式

const router = useRouter()
const title = ref('') // 绑定输入的標題
const startDate = ref('') // 绑定開始時間
const endDate = ref('') // 绑定結束時間
const list = ref([]) // 存放的地方
const total = ref(0); // 總數據量
const currentPage = ref(1); // 當前頁碼
const pageSize = ref(10); // 每頁顯示數量
const showSelection = ref(false); // 控制选择列的显示
const selectedRows = ref([]); // 選擇的某行
const dialogSelection = ref(false); // 控制对话框的显示

// 查詢
const search = async () => {
  const response = await axios.get(`http://localhost:8080/api/quiz/search`, {
    params: {
      title: title.value,
      start_date: startDate.value,
      end_date: endDate.value
    }
  })
  list.value = response.data.quizVo;
  total.value = list.value.length; // 總數據量设为返回的数据长度
}

// 計算分頁
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return list.value.slice(start, end);
});
const handleSizeChange = (val) => {
  pageSize.value = val;
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 切換選擇列的顯示狀態
const onSelectionDelete = () => {
  if (!showSelection.value) {  // 当点击垃圾桶图标时，如果没有打开选择列，先打开选择列
    showSelection.value = true;
  } else {
    if (selectedRows.value.length > 0) {  // 如果已经打开选择列并且有选中的行，则打开一个对话框显示选中的行
      dialogSelection.value = true;
    } else {
      showSelection.value = false;  // 如果已经打开选择列但没有选中的行，则关闭选择列
    }
  }
};

// 選擇的某行
const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
  // console.log('Selected Rows:', selectedRows.value);
};

// 刪除
const goDelete = async () => {
  const qnIdList = selectedRows.value.map(item => item.questionnaire.id);
  // console.log(qnIdList)
  await axios.post('http://localhost:8080/api/quiz/deleteQuestionnaire', {
    qnIdList: qnIdList
  })
  ElMessage({ message: '刪除成功', type: 'success', })
  dialogSelection.value = false;
  search(); // 刷新数据
}

// 取消或離開刪除對話框
const cancelDelete = () => {
  // 將選中的問卷回到未勾選狀態
  selectedRows.value.forEach(item => {
    item.selection = false;
  });
  dialogSelection.value = false; // 关闭对话框
}

// 將數據傳至編輯頁
const goEdit = (row) => {
  router.push({ path: '/edit', query: { data: JSON.stringify(row) } });
}

onMounted(() => search())
</script>

<template>
  <div class="bgArea">
    <div class="searchArea">
      <div class="searchTitle">
        <div class="icon"></div>
        <i class="fa-solid fa-trash" @click="onSelectionDelete"></i>
        <span class="titleText">標題</span>
        <el-input v-model="title" placeholder="請輸入關鍵字" clearable />
      </div>
      <div class="searchDate">
        <span>開始時間</span>
        <el-date-picker style="width:27%" v-model="startDate" type="date" placeholder="請選擇日期"
          value-format="YYYY-MM-DD" />
        <span>結束時間</span>
        <el-date-picker style="width:27%" v-model="endDate" type="date" placeholder="請選擇日期" value-format="YYYY-MM-DD" />

        <i class="fa-solid fa-magnifying-glass" @click="search"></i>
        <i class="fa-solid fa-square-plus" @click="$router.push('/add')"></i>
      </div>
    </div>
    <el-table class="main" :data="paginatedList" @selection-change="handleSelectionChange"
      v-if="paginatedList.length > 0" stripe style="width: 990px;">
      <el-table-column v-if="showSelection" type="selection" width="50" />
      <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
      <el-table-column label="標題" prop="questionnaire.title" width="160"></el-table-column>
      <el-table-column label="描述" prop="questionnaire.description" width="180"></el-table-column>
      <el-table-column label="狀態" prop="questionnaire.published" width="90"></el-table-column>
      <el-table-column label="開始" prop="questionnaire.startDate"></el-table-column>
      <el-table-column label="結束" prop="questionnaire.endDate"></el-table-column>
      <el-table-column label="編輯" width="60" #default="{ row }">
        <i class="fa-solid fa-pencil" @click="goEdit(row)"></i>
      </el-table-column>
      <el-table-column label="統計" width="60">
        <i class="fa-solid fa-square-poll-vertical"></i>
      </el-table-column>
      <el-table-column label="回饋" width="60">
        <i class="fa-solid fa-file-lines"></i>
      </el-table-column>
    </el-table>
    <div v-else class="noTable">
      <h3>無搜尋結果</h3>
    </div>

    <el-pagination v-if="paginatedList.length > 0" background style="padding: 30px 0;"
      v-model:current-page="currentPage" v-model:page-size="pageSize" layout="prev, pager, next, total, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog v-model="dialogSelection" @close="cancelDelete" width="800" center align-center>
      <el-table :data="selectedRows" stripe style="margin-bottom: 20px;">
        <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
        <el-table-column label="標題" prop="questionnaire.title" width="160"></el-table-column>
        <el-table-column label="描述" prop="questionnaire.description" width="180"></el-table-column>
        <el-table-column label="狀態" prop="questionnaire.published" width="90"></el-table-column>
        <el-table-column label="開始" prop="questionnaire.startDate"></el-table-column>
        <el-table-column label="結束" prop="questionnaire.endDate"></el-table-column>
      </el-table>
      <template #footer>
        <span style="color: #6e4e23;font-weight: 700;font-size: 16pt;">刪除嗎?</span>
        <div class="dialog-footer" style="margin-top: 30px;">
          <el-button @click="cancelDelete">取消</el-button>
          <el-button type="primary" @click="goDelete">確認</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.bgArea {
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  position: relative;

  .fa-trash,
  .fa-square-plus {
    font-size: 18pt;
    color: $maincolor;

    &:hover {
      color: #DBD3A4;
      cursor: pointer;
    }
  }

  .searchArea {
    width: 980px;
    height: 70px;
    background-color: #fff;
    border: thick double #dddddd;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;


    .searchTitle {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: $textcolor;
      font-weight: 700;

      .titleText {
        width: 40px;
        padding-left: 10px;
      }

      :deep(.el-input__wrapper) {
        width: 300px;
        height: 28px;
        margin-left: 10px;
        padding-left: 10px;
        border-radius: 5px;
        background-color: #e2e8ee;
      }

      :deep(.el-input__inner) {
        color: $textcolor;

        &::placeholder {
          color: $textcolor;
        }

      }
    }

    .searchDate {
      display: flex;
      align-items: center;
      color: $textcolor;
      font-weight: 700;

      span {
        padding: 0 10px;
      }

      :deep(.el-input__wrapper) {
        background-color: #e2e8ee;
      }

      :deep(.el-input__inner) {
        color: $textcolor;

        &::placeholder {
          color: $textcolor;
        }
      }

      :deep(.el-input__prefix) {
        color: $textcolor;
      }


      .fa-magnifying-glass {
        padding-left: 20px;
        padding-right: 10px;
        font-size: 20pt;
        color: $maincolor;

        &:hover {
          cursor: pointer;
          color: #DBD3A4;
        }
      }
    }

  }

  /* table整個 */
  :deep(.el-table) {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.28);
  }

  /* table標題 */
  :deep(.el-table th.el-table__cell) {
    text-align: center;
    padding: 7px 0;
    background-color: $maincolor;
    color: #ffffff;
    border-left: 1px solid #dddddd;
  }

  /* table表格內容 */
  :deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    text-align: center;
    padding: 5px 0;
    border: 1px solid #dddddd;
    color: $textcolor;
  }

  /* table 高亮行 */
  :deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background-color: #f3eee7;
  }



  .fa-pencil {
    font-size: 10pt;
    color: $maincolor;

    &:hover {
      cursor: pointer;
      color: #e3c416;
    }

  }

  .fa-square-poll-vertical {
    font-size: 15pt;
    color: $maincolor;

    &:hover {
      cursor: pointer;
      color: #e3c416;
    }
  }

  .fa-file-lines {
    font-size: 15pt;
    color: $maincolor;

    &:hover {
      cursor: pointer;
      color: #e3c416;
    }
  }

  .noTable {
    height: 500px;
    display: flex;
    align-items: center;
    color: $textcolor;
  }

  :deep(.el-pagination) {
    position: absolute;
    bottom: 10px;
  }

  // 分頁:上一頁按鈕、下一頁按鈕、其他所有按鈕
  :deep(.el-pagination.is-background .btn-next),
  :deep(.el-pagination.is-background .btn-prev),
  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled)) {
    background-color: #fff;
    border: 2px solid $maincolor;
    border-radius: 5px;
    color: $textcolor;

    &:hover {
      background-color: #e9dcc8;
    }
  }

  // 分頁: 活動按鈕
  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: $maincolor;
    color: #fff;
  }
}
</style>
