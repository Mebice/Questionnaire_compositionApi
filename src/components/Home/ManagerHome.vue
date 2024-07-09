<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
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
  if (title.value || startDate.value || endDate.value) { // 當標題或開始時間或結束時間有值時
    sessionStorage.setItem('currentPage', JSON.stringify(currentPage.value = 1)) // 讓當前頁回到第一頁存在sessionStorage
  }
  const response = await axios.get(`http://localhost:8080/api/quiz/search`, {
    params: {
      title: title.value,
      start_date: startDate.value,
      end_date: endDate.value
    }
  })

  list.value = response.data.quizVo;
  list.value.sort((a, b) => new Date(b.questionnaire.startDate) - new Date(a.questionnaire.startDate)); // 按開始時間从新到旧排序
  total.value = list.value.length; // 總數據量设为返回的数据长度

  if (title.value || startDate.value || endDate.value) { // 當搜尋欄有值時
    sessionStorage.setItem('searchTitle', JSON.stringify(title.value)); // 存儲標題
    sessionStorage.setItem('searchStartDate', JSON.stringify(startDate.value)); // 存儲開始時間
    sessionStorage.setItem('searchEndDate', JSON.stringify(endDate.value)); // 存儲結束時間
  } else {  // 否則沒值就清空
    sessionStorage.removeItem('searchTitle')
    sessionStorage.removeItem('searchStartDate')
    sessionStorage.removeItem('searchEndDate')
  }
}
const loadSearch = () => {   // 讀取sessionStorage中的搜尋紀錄
  title.value = JSON.parse(sessionStorage.getItem('searchTitle'));
  startDate.value = JSON.parse(sessionStorage.getItem('searchStartDate'));
  endDate.value = JSON.parse(sessionStorage.getItem('searchEndDate'));
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
  sessionStorage.setItem('currentPage', JSON.stringify(currentPage.value)) // 將當前頁存在sessionStorage
};
const loadCurrentPage = () => {   // 讀取存在sessionStorage中的當前頁
  if (sessionStorage.getItem('currentPage')) // 如果sessionStorage中存在當前頁
    currentPage.value = JSON.parse(sessionStorage.getItem('currentPage'))
}

// 問卷的狀態
const publishedStatus = (questionnaire) => {
  if (!questionnaire.published) {
    return '未發布';
  } else if (new Date(questionnaire.startDate) > new Date()) {
    return '未開始';
  } else if (new Date(questionnaire.endDate) < new Date()) {
    return '已結束';
  } else {
    return '進行中';
  }
}

// 切換選擇列的顯示狀態
const onSelectionDelete = () => {
  if (!showSelection.value) {  // 当点击垃圾桶图标时，如果没有打开选择列，先打开选择列
    showSelection.value = true;
  } else { // 否則就是在已經打開選擇列的情況下
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

// 取消或離開確認刪除對話框
const cancelDelete = () => {
  // 將選中的問卷回到未勾選狀態
  selectedRows.value = []
  dialogSelection.value = false; // 关闭对话框
  search(); // 刷新数据
}

// 將數據傳至預覽頁
const goPreview = (row) => {
  router.push({ path: '/preview', query: { data: JSON.stringify(row) } });
}

// 將數據傳至編輯頁
const goEdit = (row) => {
  router.push({ path: '/edit', query: { data: JSON.stringify(row) } });
}

// 將數據傳至統計或回饋頁
const goUserList = async (row, path) => {
  const questionnaireId = row.questionnaire.id
  const response = await axios.get(`http://localhost:8080/api/user/searchByQuestionnaireId?questionnaireId=${questionnaireId}`)
  const userData = response.data.userList;
  if (userData.length > 0) {
    // 將查詢結果與原數據一起傳遞到統計或回饋頁面
    router.push({ path, query: { data: JSON.stringify(row), userData: JSON.stringify(userData) } })
  } else {
    ElMessage.warning('暫無數據')
  }
}

// 監聽 input 中新增或刪除的值
watch([title, startDate, endDate], () => {
  search()
})

onMounted(() => search(), loadCurrentPage(), loadSearch())
</script>

<template>
  <div class="bgArea">
    <div class="searchArea">
      <i class="fa-solid fa-pen-to-square" style="font-size: 20pt;margin-left:40px;margin-right: 10px;color: #fff;"></i>
      <span
        style="font-size: 18pt;margin-right: 30px;;color: #fff;font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Questionnaire</span>
      <div style="width: 2px;height: 50%;margin-right: 10px;background-color: #fff;"></div>
      <div class="searchTitle">
        <span class="titleText">標題</span>
        <el-input v-model="title" placeholder="請輸入關鍵字" clearable />
      </div>
      <div class="searchDate">
        <span>開始時間</span>
        <el-date-picker style="width:27%" v-model="startDate" type="date" placeholder="請選擇日期"
          value-format="YYYY-MM-DD" />
        <span>結束時間</span>
        <el-date-picker style="width:27%" v-model="endDate" type="date" placeholder="請選擇日期" value-format="YYYY-MM-DD" />

        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
    <el-table class="main" :data="paginatedList" @selection-change="handleSelectionChange"
      v-if="paginatedList.length > 0" stripe style="width: 99.9%;">
      <el-table-column v-if="showSelection" type="selection" width="50" />
      <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
      <el-table-column label="標題" prop="questionnaire.title" show-overflow-tooltip></el-table-column>
      <el-table-column label="描述" prop="questionnaire.description" max-width="300"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="狀態" prop="questionnaire.published" width="90" #default="{ row }">
        {{ publishedStatus(row.questionnaire) }}
      </el-table-column>
      <el-table-column label="開始" prop="questionnaire.startDate" width="120"></el-table-column>
      <el-table-column label="結束" prop="questionnaire.endDate" width="120"></el-table-column>
      <el-table-column label="預覽" width="60" #default="{ row }">
        <i class="fa-solid fa-eye" @click="goPreview(row)"></i>
      </el-table-column>
      <el-table-column label="編輯" width="60" #default="{ row }">
        <i class="fa-solid fa-pencil"
          v-if="publishedStatus(row.questionnaire) === '未發布' || publishedStatus(row.questionnaire) === '未開始'"
          @click="goEdit(row)"></i>
      </el-table-column>
      <el-table-column label="統計" width="60"  #default="{ row }">
        <i class="fa-solid fa-square-poll-vertical"
        v-if="publishedStatus(row.questionnaire) === '進行中' || publishedStatus(row.questionnaire) === '已結束'"
          @click="goUserList(row, '/statistics')"></i>
      </el-table-column>
      <el-table-column label="回饋" width="60" #default="{ row }">
        <i class="fa-solid fa-file-lines"
          v-if="publishedStatus(row.questionnaire) === '進行中' || publishedStatus(row.questionnaire) === '已結束'"
          @click="goUserList(row, '/feedBack')"></i>
      </el-table-column>
    </el-table>
    <div v-else class="noTable">
      <h3>無搜尋結果</h3>
    </div>

    <!-- 分頁 -->
    <el-pagination v-if="paginatedList.length > 0" background style="padding: 30px 0;"
      v-model:current-page="currentPage" v-model:page-size="pageSize" layout="prev, pager, next, total, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 點擊時展開內容 -->
    <details>
      <summary><i class="fa-solid fa-gear"></i></summary>
      <div class="expanded-content">
        <i class="fa-solid fa-square-plus" @click="$router.push('/add')"></i>
        <i class="fa-solid fa-trash" @click="onSelectionDelete"></i>
      </div>
    </details>

    <!-- 刪除彈窗 -->
    <el-dialog v-model="dialogSelection" @close="cancelDelete" width="800" center align-center>
      <el-table :data="selectedRows" stripe style="margin-bottom: 20px;">
        <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
        <el-table-column label="標題" prop="questionnaire.title" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="questionnaire.description" show-overflow-tooltip></el-table-column>
        <el-table-column label="狀態" prop="questionnaire.published" width="90" #default="{ row }">
          {{ publishedStatus(row.questionnaire) }}
        </el-table-column>
        <el-table-column label="開始" prop="questionnaire.startDate" width="120"></el-table-column>
        <el-table-column label="結束" prop="questionnaire.endDate" width="120"></el-table-column>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  position: relative;
  // margin-left: -10px;

  .fa-trash,
  .fa-square-plus {
    font-size: 18pt;
    color: $maincolor;

    &:hover {
      color: #DBD3A4;
      cursor: pointer;
    }
  }

  summary {
    list-style: none;
    font-size: 18pt;
    z-index: 999;
    position: fixed;
    bottom: 50px;
    right: 15px;
    padding: 8px 8px 6px;
    border-radius: 50%;
    border: none;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.38);
    background-color: $maincolor;
    color: #fff;

    &:hover {
      background-color: #DBD3A4;
      cursor: pointer;
    }
  }

  .expanded-content {
    z-index: 99;
    width: 60px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 50px;
    right: 15px;
    padding-right: 55px;
    padding-left: 20px;
    border-radius: 30px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.38);
    background-color: #fff;
    color: $maincolor;
  }

  .searchArea {
    height: 70px;
    background-color: $maincolor;
    display: flex;
    align-items: center;
    justify-content: center;

    .searchTitle {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #fff;
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
      color: #fff;
      font-weight: 700;

      span {
        padding: 0 10px;
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
        color: #fff;
      }
    }
  }

  /* table整個 */
  :deep(.el-table) {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.28);
  }

  /* table標題 */
  :deep(.el-table th.el-table__cell) {
    text-align: center;
    padding: 7px 0;
    background-color: $maincolor;
    opacity: 0.6;
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
    font-size: 12pt;
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

  .fa-file-lines,
  .fa-eye {
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
