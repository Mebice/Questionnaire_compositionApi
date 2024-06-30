<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AgCharts } from 'ag-charts-community';

const route = useRoute();
const formData = ref(JSON.parse(route.query.data));  // 問卷數據
const userData = ref(JSON.parse(route.query.userData));  // 所有user 數據

const chartContainer = ref(null);
const chartOptions = ref({
    container: null,
    data: [
        { category: 'A', value: 30 },
        { category: 'B', value: 80 },
        { category: 'C', value: 45 },
        { category: 'D', value: 60 },
        { category: 'E', value: 20 },
        { category: 'F', value: 90 },
        { category: 'G', value: 75 },
    ],
    series: [{
        type: 'bar',
        xKey: 'category',
        yKey: 'value',
        fill: ({ datum }) => datum.color,
    }],
    title: {
        text: 'Sample Bar Chart'
    },
    legend: {
        enabled: false
    },
    axes: [{
        type: 'category',
        position: 'bottom',
    }, {
        type: 'number',
        position: 'left'
    }]
});

onMounted(() => {
    if (chartContainer.value) {
        chartOptions.value.container = chartContainer.value;
        AgCharts.create(chartOptions.value);
    }
})
</script>


<template>
    <div class="bgArea">
        <!-- {{ formData }}
        {{ userData }} -->
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ formData.questionnaire.startDate + ' ~ ' + formData.questionnaire.endDate }}</p>
            <h2>{{ formData.questionnaire.title }}</h2>
            <p>{{ formData.questionnaire.description }}</p>
        </div>
        <div class="questionListArea">
            <!-- 顯示題目列表 -->
            <div class="questionList" v-for="(questionItem, questionIndex) in formData.questionList"
                :key="questionItem.id">
                <div class="questionListInside">
                    <div class="qTitleAndNecessary">
                        <p>{{ questionIndex + 1 + '. ' + questionItem.qTitle + ' (' + questionItem.optionType + ')' }}
                        </p>
                        <span v-if="questionItem.necessary" style="color: red;font-size:10pt">*[必填]</span>
                    </div>

                </div>
            </div>
            <div class="btnArea">
                <i class="fa-solid fa-circle-chevron-left" @click="$router.push('/managerHome')">
                </i><span class="backText">Back</span>
            </div>
        </div>

        <div id="myChart" ref="chartContainer" style="width: 800px; height: 600px;"></div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    display: flex;
    flex-direction: column;
    align-items: center;

    .titleArea {
        width: 850px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        padding-top: 15px;
        padding-bottom: 10px;
        margin: 20px 0;
        color: #6e4e23;
        font-weight: 700;

        h2 {
            height: 20px;
            margin-top: 10px;
        }

        p {
            padding: 0 60px;
        }
    }

    .questionListArea {
        width: 850px;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25px 0 3px 0;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        margin-bottom: 30px;
        color: #6e4e23;
        font-weight: 700;

        .questionList {
            width: 93%;
            background-color: #fff;
            border-radius: 10px;
            margin-bottom: 23px;
            border: 2px solid #ede9e6;

            .questionListInside {
                padding: 0 5% 10px 5%;

                .qTitleAndNecessary {
                    display: flex;
                    align-items: center;
                }
            }
        }
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