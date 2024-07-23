<script setup>
import axios from 'axios';
import { ref, onMounted, computed, watch } from 'vue';
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
      // 如果搜索條件有變化(當輸入的value值不等於儲存於sessionStorage的值時)，重置當前頁為1
  if (title.value !== JSON.parse(sessionStorage.getItem('searchTitle')) ||
      startDate.value !== JSON.parse(sessionStorage.getItem('searchStartDate')) ||
      endDate.value !== JSON.parse(sessionStorage.getItem('searchEndDate'))) {
    currentPage.value = 1;  // 重置到第1頁
    sessionStorage.setItem('currentPage', JSON.stringify(currentPage.value));
  }

    const response = await axios.get(`http://localhost:8080/api/quiz/search`, {
        params: {
            title: title.value,
            start_date: startDate.value,
            end_date: endDate.value
        }
    })

    let result = response.data.quizVo;
    result = result.filter(item => item.questionnaire.published); // 过滤掉未發布的問卷
    result.sort((a, b) => new Date(b.questionnaire.startDate) - new Date(a.questionnaire.startDate)); // 按開始時間从新到旧排序
    list.value = result;
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
// 暫存查詢
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
// 暫存當前頁
const loadCurrentPage = () => {   // 讀取存在sessionStorage中的當前頁
    if (sessionStorage.getItem('currentPage')) // 如果sessionStorage中存在當前頁
        currentPage.value = JSON.parse(sessionStorage.getItem('currentPage'))
}

// 問卷的狀態
const publishedStatus = (questionnaire) => {
    if (new Date(questionnaire.startDate) > new Date()) {
        return '未開始';
    } else if (new Date(questionnaire.endDate) < new Date()) {
        return '已結束';
    } else {
        return '進行中';
    }
}

// 將數據傳至作答頁
const goAnswer = (row) => {
    router.push({ path: '/answer', query: { data: JSON.stringify(row) } });
}

// 將數據傳至統計頁
const goUserList = async (row) => {
    const questionnaireId = row.questionnaire.id
    const response = await axios.get(`http://localhost:8080/api/user/searchByQuestionnaireId?questionnaireId=${questionnaireId}`)
    const userData = response.data.userList;
    if (userData.length > 0) {
        // 將查詢結果與原數據一起傳遞到統計頁面
        router.push({ path: '/statistics', query: { data: JSON.stringify(row), userData: JSON.stringify(userData) } })
    } else {
        ElMessage.warning('暫無數據')
    }
}

// 監聽 input 中新增或刪除的值
watch([title, startDate, endDate], () => {
    search()
})

onMounted(() => {
  loadCurrentPage();  // 加載當前頁碼
  loadSearch();       // 加載搜索條件
  search();           // 執行搜索
})
</script>

<template>
    <div class="bgArea">
        <div class="searchArea">
            <i class="fa-solid fa-pen-to-square"
                style="font-size: 20pt;margin-left:40px;margin-right: 10px;color: #fff;"></i>
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
                <el-date-picker style="width:27%" v-model="endDate" type="date" placeholder="請選擇日期"
                    value-format="YYYY-MM-DD" />

                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
        <el-table class="main" :data="paginatedList" v-if="paginatedList.length > 0" stripe style="width: 99.9%;">
            <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
            <el-table-column label="標題" prop="questionnaire.title" show-overflow-tooltip></el-table-column>
            <el-table-column label="描述" prop="questionnaire.description" width="370"
                show-overflow-tooltip></el-table-column>
            <el-table-column label="狀態" prop="questionnaire.published" width="90" #default="{ row }">
                {{ publishedStatus(row.questionnaire) }}
            </el-table-column>
            <el-table-column label="開始" prop="questionnaire.startDate" width="120"></el-table-column>
            <el-table-column label="結束" prop="questionnaire.endDate" width="120"></el-table-column>
            <el-table-column label="填寫" width="60" #default="{ row }">
                <i class="fa-solid fa-pen-to-square" v-if="publishedStatus(row.questionnaire) === '進行中'"
                    @click="goAnswer(row)"></i>
            </el-table-column>
            <el-table-column label="統計" width="60" #default="{ row }">
                <i class="fa-solid fa-square-poll-vertical"
                    v-if="publishedStatus(row.questionnaire) === '進行中' || publishedStatus(row.questionnaire) === '已結束'"
                    @click="goUserList(row)"></i>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
    position: relative;

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

    .fa-square-poll-vertical,
    .fa-pen-to-square {
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
