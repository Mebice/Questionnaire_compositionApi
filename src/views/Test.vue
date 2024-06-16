<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import SearchForm from '@/components/SearchForm.vue';
import CommonTable from '@/components/CommonTable.vue';

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
            end_date: endDate.value,
        },
    });
    list.value = response.data.quizVo || [];
    total.value = list.value.length;
};

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

// 查詢
const handleRowClick = (row) => {
    console.log(row);
};
const updateTitle = (newTitle) => {
    title.value = newTitle;
};
const updateStartDate = (newStartDate) => {
    startDate.value = newStartDate;
};
const updateEndDate = (newEndDate) => {
    endDate.value = newEndDate;
};

onMounted(() => search());
</script>

<template>
    <div class="bgArea">
        <search-form :title="title" :startDate="startDate" :endDate="endDate" @update:title="updateTitle"
            @update:startDate="updateStartDate" @update:endDate="updateEndDate" @search="search" />
        <common-table :data="paginatedList" @row-click="handleRowClick">
            <el-table-column label="ID" prop="questionnaire.id" width="70"></el-table-column>
            <el-table-column label="標題" prop="questionnaire.title" width="160"></el-table-column>
            <el-table-column label="描述" prop="questionnaire.description" width="200"></el-table-column>
            <el-table-column label="狀態" prop="questionnaire.published" width="90"></el-table-column>
            <el-table-column label="開始" prop="questionnaire.startDate"></el-table-column>
            <el-table-column label="結束" prop="questionnaire.endDate"></el-table-column>
            <el-table-column label="編輯" width="70">
                <template #default="{ row }">
                    <i class="fa-solid fa-pencil"></i>
                </template>
            </el-table-column>
            <el-table-column label="統計" width="70">
                <template #default="{ row }">
                    <i class="fa-solid fa-square-poll-vertical"></i>
                </template>
            </el-table-column>
            <el-table-column label="回饋" width="70">
                <template #default="{ row }">
                    <i class="fa-solid fa-file-lines"></i>
                </template>
            </el-table-column>
        </common-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>

<style lang="scss" scoped>

.bgArea{
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
}


</style>