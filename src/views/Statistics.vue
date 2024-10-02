<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
    CanvasRenderer,
    PieChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
]);

const route = useRoute();
const formData = ref(JSON.parse(route.query.data));  // 問卷數據
const userData = ref(JSON.parse(route.query.userData));  // 所有user 數據

const chartValue = ref('pie')  // 綁定選擇圓餅圖或長條圖的選項，默認為圓餅圖
const chartType = [ // 綁定選項的值和標籤
    {
        value: 'pie',
        label: '圓餅圖',
    },
    {
        value: 'bar',
        label: '長條圖',
    }
]

// 将选项字符串拆分为数组
formData.value.questionList.forEach(question => {
    question.options = question.option.split(';').map(option => ({ value: option }));
});

// 合併相同 userId 的資料
const mergeUserData = (userData) => {
    const mergedData = {}; // 放置合併資料的地方

    userData.forEach(item => {
        mergedData[item.userId] = {
            userId: item.userId,
            ...item
        };
    });
    return Object.values(mergedData);
};
const mergedUserData = ref(mergeUserData(userData.value));


// 生成每个问题的饼图配置
const chartOptions = computed(() => {
    const questionAnswers = formData.value.questionList.map(question => {
        const answerCounts = {};

        userData.value.forEach(user => {
            if (user.questionId === question.quId) {
                if (question.optionType === '多選') {
                    // 多选题需要分割答案并分别统计
                    const answers = user.ans.split(';');
                    answers.forEach(answer => {
                        if (answer in answerCounts) {
                            answerCounts[answer]++;
                        } else {
                            answerCounts[answer] = 1;
                        }
                    });
                } else {
                    // 单选题直接统计
                    const answer = user.ans;
                    if (answer in answerCounts) {
                        answerCounts[answer]++;
                    } else {
                        answerCounts[answer] = 1;
                    }
                }
            }
        });

        const data = Object.entries(answerCounts).map(([name, value]) => ({ name, value }));

        if (chartValue.value === 'pie') {
            return {
                // title: {
                //     text: question.qTitle,
                //     left: 'center',
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: data.map(item => item.name),
                },
                series: [
                    {
                        name: question.qTitle,
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            }
        } else {
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: question.options.map(option => option.value),
                    axisLabel: {
                        interval: 0,
                        rotate: 45, // 标签旋转角度
                        formatter: function (value) {
                            // 标签自动换行
                            return value.split(" ").join("\n");
                        }
                    },
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: question.qTitle,
                        type: 'bar',
                        data: question.options.map(option => answerCounts[option.value] || 0),
                    },
                ],
            };
        }
    });
    return questionAnswers;
})

</script>

<template>
    <div class="bgArea">
        <!-- {{ formData.questionList }} -->
        <!-- {{ userData }} -->
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ formData.questionnaire.startDate + ' ~ ' + formData.questionnaire.endDate }}</p>
            <h2>{{ formData.questionnaire.title }}</h2>
            <p>{{ formData.questionnaire.description }}</p>
        </div>
        <div class="questionListArea">

            <span class="ansText"> 作答人數 : {{ mergedUserData.length }} 人</span>


            <!-- 顯示題目列表 -->
            <div class="questionList" v-for="(questionItem, questionIndex) in formData.questionList"
                :key="questionItem.id">
                <div class="questionListInside">
                    <div class="qTitleAndNecessary">
                        <p>{{ questionIndex + 1 + '. ' + questionItem.qTitle + ' (' + questionItem.optionType + ')' }}
                        </p>
                        <span v-if="questionItem.necessary" style="color: red;font-size:10pt">*[必填]</span>
                    </div>

                    <div class="contentArea">

                        <!-- 根據問題類型呈現選項 -->
                        <div v-if="questionItem.optionType === '多選'">
                            <div class="option-checkbox" v-for="(option, optionIndex) in questionItem.options"
                                :key="optionIndex">
                                <el-checkbox v-model="option.value" disabled>{{ option.value }}</el-checkbox>
                            </div>
                        </div>
                        <div v-else>
                            <div class="option-radio" v-for="(option, optionIndex) in questionItem.options"
                                :key="optionIndex">
                                <el-radio-group v-model="option.value" disabled>
                                    <el-radio value="option">{{ option.value }}</el-radio>
                                </el-radio-group>
                            </div>
                        </div>

                        <el-select v-model="chartValue" class="chartSelect" placeholder="Select" style="width: 90px">
                            <el-option v-for="item in chartType" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>

                        <!-- 顯示每個問題對應的圖表 -->
                        <v-chart v-if="chartValue === 'pie'" class="pieChart" :option="chartOptions[questionIndex]"
                            autoresize />
                        <v-chart v-if="chartValue === 'bar'" class="barChart" :option="chartOptions[questionIndex]"
                            autoresize />
                    </div>
                </div>
            </div>
            <div class="btnArea" @click="$router.push('/managerHome')">
                <i class="fa-solid fa-circle-chevron-left">
                </i><span class="backText">Back</span>
            </div>
        </div>
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

        .ansText {
            margin-bottom: 20px;
        }

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

            .contentArea {
                display: flex;
                justify-content: space-between;
                position: relative;

                :deep(.el-checkbox__inner),
                :deep(.el-radio__inner) {
                    // 複選框和單選框
                    border: 1px solid $textcolor;
                }

                :deep(.el-checkbox__label),
                :deep(.el-radio__label) {
                    // 複選框和單選框文字
                    font-weight: 700;
                    color: $textcolor;
                }

                .chartSelect {
                    position: absolute;
                    right: 0px;
                    z-index: 999; // 為了能選取統計圖
                }

                :deep(.el-select__wrapper) {
                    box-shadow: 0 0 0 1px $textcolor inset;
                }

                :deep(.el-select__caret) {
                    color: $textcolor;
                }

                .pieChart {
                    width: 450px;
                    height: 350px;
                    margin-right: -50px;
                }

                .barChart {
                    width: 350px;
                    height: 350px;
                }
            }
        }
    }

    .btnArea {
        height: 30px;
        display: flex;
        margin-bottom: 20px;
        color: $maincolor;

        &:hover {
            opacity: 0.6;
            cursor: pointer;
        }

        .fa-circle-chevron-left {
            font-size: 20pt;
            border-radius: 50%;
            padding: 12px;
            margin: -10px 0 10px;
        }

        .backText {
            font-size: 13pt;
            margin-top: 5px;
        }
    }
}
</style>