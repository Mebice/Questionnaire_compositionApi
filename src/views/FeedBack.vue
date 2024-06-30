<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const formData = ref(JSON.parse(route.query.data || sessionStorage.getItem('formData')));  // 問卷數據
const userData = ref(JSON.parse(route.query.userData || sessionStorage.getItem('userData')));  // 所有user 數據
const total = ref(0); // 總數據量
const currentPage = ref(1); // 當前頁碼
const pageSize = ref(10); // 每頁顯示數量

// 合併相同 userId 的資料
const mergeUserData = (data) => {
    const mergedData = {};

    data.forEach(item => {
        if (!mergedData[item.userId]) {
            mergedData[item.userId] = {
                userId: item.userId,
                name: item.name,
                phoneNumber: item.phoneNumber,
                email: item.email,
                age: item.age,
                dateTime: item.dateTime,
                answers: []
            };
        }
        mergedData[item.userId].answers.push({
            questionId: item.questionId,
            ans: item.ans
        });
    });
    return Object.values(mergedData);
};

const mergedUserData = ref(mergeUserData(userData.value));
// console.log(mergedUserData.value)
total.value = mergedUserData.value.length; // 更新總數據量

// 計算分頁
const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return mergedUserData.value.slice(start, end);
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

// 返回
const goBack = () => {
    sessionStorage.setItem('currentPage', JSON.stringify(currentPage.value = 1)) // 讓當前頁回到第一頁存在sessionStorage
    sessionStorage.removeItem('formData')
    sessionStorage.removeItem('userData')
    router.push('/managerHome')
}

// 回饋頁
const goRecord = (row) => {
    router.push({ path: '/record', query: { data: JSON.stringify(row) } });
}

onMounted(() => {
    // 根据 dateTime 属性对 userStatistics 数组进行排序
    mergedUserData.value.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    loadCurrentPage();
    // 存儲到 sessionStorage
    sessionStorage.setItem('formData', JSON.stringify(formData.value));
    sessionStorage.setItem('userData', JSON.stringify(userData.value));
});
</script>


<template>
    <div class="bgArea">
        <!-- {{ formData }} -->
        <!-- {{ userData }} -->
        <el-table class="main" :data="paginatedList" stripe style="width:800px">
            <el-table-column label="USER ID" prop="userId" show-overflow-tooltip></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="電子信箱" prop="email"></el-table-column>
            <el-table-column label="填寫時間" prop="dateTime" width="180"></el-table-column>
            <el-table-column label="作答紀錄" width="90" #default="{ row }">
                <i class="fa-solid fa-right-to-bracket" @click="goRecord(row)"></i>
            </el-table-column>
        </el-table>
        <!-- 分頁 -->
        <el-pagination background style="padding: 30px 0;" v-model:current-page="currentPage"
            v-model:page-size="pageSize" layout="prev, pager, next, total, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        <div class="btnArea">
            <i class="fa-solid fa-circle-chevron-left" @click="goBack">
            </i><span class="backText">Back</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

    .fa-right-to-bracket {
        font-size: 15pt;
        color: $maincolor;

        &:hover {
            cursor: pointer;
            color: #e3c416;
        }

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

    .btnArea {
        display: flex;
        color: $maincolor;

        .fa-circle-chevron-left {
            font-size: 20pt;
            border-radius: 50%;
            padding: 12px;
            margin: -10px 0 10px;

            &:hover {
                opacity: 0.6;
                cursor: pointer;
            }
        }

        .backText {
            font-size: 13pt;
            margin-top: 5px;
        }
    }
}
</style>
