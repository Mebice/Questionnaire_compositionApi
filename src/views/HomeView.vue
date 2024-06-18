<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const title = ref('') // 绑定输入的標題
const startDate = ref('') // 绑定開始時間
const endDate = ref('') // 绑定結束時間
const list = ref([]) // 存放的地方
const total = ref(0); // 總數據量
const currentPage = ref(1); // 當前頁碼
const pageSize = ref(10); // 每頁顯示數量

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
        <i class="fa-solid fa-trash"></i>
        <span class="titleText">標題</span>
        <input class="titleInput" type="text" v-model="title" placeholder="請輸入關鍵字">
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
    <el-table class="main" :data="paginatedList" v-if="paginatedList.length > 0" stripe style="width: 990px;">
      <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
      <el-table-column label="標題" prop="questionnaire.title" width="160"></el-table-column>
      <el-table-column label="描述" prop="questionnaire.description" width="180"></el-table-column>
      <el-table-column label="狀態" prop="questionnaire.published" width="90"></el-table-column>
      <el-table-column label="開始" prop="questionnaire.startDate"></el-table-column>
      <el-table-column label="結束" prop="questionnaire.endDate"></el-table-column>
      <el-table-column label="編輯" width="70" #default="{ row }">
            <i class="fa-solid fa-pencil" @click="goEdit(row)"></i>
      </el-table-column>
      <el-table-column label="統計" width="70">
        <i class="fa-solid fa-square-poll-vertical"></i>
      </el-table-column>
      <el-table-column label="回饋" width="70">
        <i class="fa-solid fa-file-lines"></i>
      </el-table-column>
    </el-table>
    <div v-else class="noTable">
      <h3>無搜尋結果</h3>
    </div>
    <el-pagination v-if="paginatedList.length > 0" background style="padding: 30px 0;"
      v-model:current-page="currentPage" v-model:page-size="pageSize" layout="prev, pager, next, total, jumper"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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

      .titleInput {
        width: 320px;
        padding-left: 10px;
        height: 28px;
        border: none;
        outline: none;
        border-radius: 5px;
        background-color: #e2e8ee;

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
