<!-- SearchForm.vue -->
<template>
    <div class="bgArea">
        <div class="searchArea">
            <div class="searchTitle">
                <span class="titleText">標題</span>
                <input class="titleInput" type="text" v-model="localTitle" placeholder="請輸入關鍵字" />
            </div>
            <div class="searchDate">
                <span>開始時間</span>
                <el-date-picker style="width:27%" v-model="localStartDate" type="date" placeholder="請選擇日期"
                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                <span>結束時間</span>
                <el-date-picker style="width:27%" v-model="localEndDate" type="date" placeholder="請選擇日期"
                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                <i class="fa-solid fa-magnifying-glass" @click="onSearch"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    title: String,
    startDate: String,
    endDate: String,
});

const emit = defineEmits(['update:title', 'update:startDate', 'update:endDate', 'search']);

const localTitle = ref(props.title);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);

const onSearch = () => {
    emit('update:title', localTitle.value);
    emit('update:startDate', localStartDate.value);
    emit('update:endDate', localEndDate.value);
    emit('search');
};
</script>

<style lang="scss" scoped>

.bgArea {
    display: flex;
    align-items: center;
    justify-content: center;

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
            padding-left: 30px;
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
                font-size: 20pt;
                color: $maincolor;

                &:hover {
                    cursor: pointer;
                    color: #DBD3A4;
                }
            }
        }

    }
}
</style>